import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Initialize the response object so we can mutate its cookies later
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // 1. Forward refreshed cookies to downstream Server Components
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          
          // 2. Re-instantiate the response object to capture mutations
          response = NextResponse.next({ request });
          
          // 3. Persist the refreshed HTTP-only cookies back to the browser
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Invoking getUser() is mandatory. It verifies the JWT cryptographically 
  // and triggers the token refresh cycle if the current token has expired.
  const { data: { user } } = await supabase.auth.getUser();

  // ZERO-TRUST ROUTE PROTECTION
  const isProtectedPath = request.nextUrl.pathname.startsWith('/dashboard') || 
                          request.nextUrl.pathname.startsWith('/agent');

  if (!user && isProtectedPath) {
    // User is not logged in, redirect to login page
    const loginRedirect = request.nextUrl.clone();
    loginRedirect.pathname = '/login';
    // Save the intended destination so we can redirect them back after OAuth
    loginRedirect.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(loginRedirect);
  }

  // Prevent logged-in users from seeing the login/signup pages
  if (user && request.nextUrl.pathname === '/login') {
    const dashboardRedirect = request.nextUrl.clone();
    dashboardRedirect.pathname = '/dashboard';
    return NextResponse.redirect(dashboardRedirect);
  }

  return response;
}

// Optimize middleware execution to skip static files and images
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

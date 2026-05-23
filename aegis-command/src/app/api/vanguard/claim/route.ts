import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const ClaimBountySchema = z.object({
  bounty_id: z.string().uuid(),
  idempotency_key: z.string().uuid(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ClaimBountySchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    
    const { bounty_id, idempotency_key } = parsed.data;

    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error: rpcError } = await supabase.rpc('claim_vanguard_bounty', {
      p_user_id: user.id,
      p_bounty_id: bounty_id,
      p_idempotency_key: idempotency_key
    });

    if (rpcError || data === false) {
      return NextResponse.json({ error: "Bounty already resolved." }, { status: 409 });
    }

    return NextResponse.json({ status: "success", points_credited: 500, new_balance: undefined }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development", // Don't cache during hackathon dev!
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Your other Next.js config here
};

export default withSerwist(nextConfig);

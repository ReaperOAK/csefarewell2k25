import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Deployed on Vercel (full Next.js runtime) — no static export, so dynamic routes
  // like /invitation/[id] work for any id and Next image optimization is enabled.
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;

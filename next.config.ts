import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  eslint: {
    // ✅ Skip ESLint checks during Vercel builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

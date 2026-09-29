import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // matches the 5MB limit you validated client-side earlier
    },
  },
};

export default nextConfig;

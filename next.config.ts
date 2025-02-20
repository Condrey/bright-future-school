import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  async rewrites() {
    return [
      {
        source:
          "/director/management/asset-management/store/food_store/consumptions",
        destination: "/director/management/asset-management/store/food_store",
      },
    ];
  },
};

export default nextConfig;

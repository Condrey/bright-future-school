import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  async redirects() {
    return [
      {
        source:
          "/director/management/asset-management/store/food_store/consumptions",
        destination: "/director/management/asset-management/store/food_store",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

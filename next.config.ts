import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.mapbox.com",
        port: "",
        pathname: "/styles/v1/**",
      },
    ],
  },
};

export default nextConfig;

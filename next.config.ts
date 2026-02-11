import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/proxy/uploads/:path*",
        destination: `${process.env.MYSAGRA_API_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;

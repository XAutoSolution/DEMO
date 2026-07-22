import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Belt-and-suspenders noindex for every demo route.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;

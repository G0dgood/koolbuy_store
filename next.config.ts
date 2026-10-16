import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Hosts the store loads product, avatar and logo images from.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "ui-avatars.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "cdn-icons-png.flaticon.com" },
      { protocol: "https", hostname: "koolbuystore.com" },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Döküman "Image Optimization" bölümündeki next.config.js örneğinin
  // güncel (remotePatterns) karşılığı. Bu demo sadece /public altındaki
  // local görselleri kullandığı için aktif değil - dış görsel eklemek
  // istersen aşağıdaki gibi bir remotePatterns girmen yeterli:
  //
  // images: {
  //   remotePatterns: [
  //     { protocol: "https", hostname: "example.com" },
  //     { protocol: "https", hostname: "cdn.example.com" },
  //   ],
  //   formats: ["image/avif", "image/webp"],
  // },
};

export default nextConfig;

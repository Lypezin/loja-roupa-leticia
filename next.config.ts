import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // '**.supabase.co' restringe o proxy pra segurança e anti-SSRF limitando custos ao BD Principal
        hostname: '**.supabase.co', 
      },
      // Descomente e adicione abaixo caso tenha outros provedores (ex: cloudinary / raw.githubusercontent)
      /*
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      }
      */
    ],
  },
};

export default nextConfig;

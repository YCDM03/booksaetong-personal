/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img1.daumcdn.net', 'wwqtgagcybxbzyouattn.supabase.co', 'marketplace.canva.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img1.daumcdn.net'
      },
      {
        protocol: 'https',
        hostname: 'wwqtgagcybxbzyouattn.supabase.co'
      },
      {
        protocol: 'https',
        hostname: 'marketplace.canva.com'
      }
    ]
  }
};

export default nextConfig;

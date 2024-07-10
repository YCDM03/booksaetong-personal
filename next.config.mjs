/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: 'img1.daumcdn.net' }],
    domains: ['wwqtgagcybxbzyouattn.supabase.co']
  }
};

export default nextConfig;

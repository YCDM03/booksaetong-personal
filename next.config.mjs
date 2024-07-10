/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img1.daumcdn.net','wwqtgagcybxbzyouattn.supabase.co'], // 여기에 필요한 도메인을 추가합니다.
    remotePatterns: [{ hostname: 'img1.daumcdn.net' }],
  },
};

export default nextConfig;
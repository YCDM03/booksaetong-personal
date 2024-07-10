/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: 'img1.daumcdn.net' }]
  }
};

export default nextConfig;

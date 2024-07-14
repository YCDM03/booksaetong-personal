import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}`;

export const metadata: Metadata = {
  title: '북새통',
  description: '60계치킨조의 북새통'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <script type="text/javascript" src={KAKAO_SDK_URL} async />
      <head>
        <link
          rel="icon"
          href="https://wwqtgagcybxbzyouattn.supabase.co/storage/v1/object/public/avatars/favicon_booksaetong.png"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import localFont from 'next/font/local';
import Header from '../components/header';
import Footer from '../components/footer';
import GlobalModal from '@/components/modal/globalModal';
import QueryProvider from '@/components/providers/queryProvider';

const pretendard = localFont({
  src: [
    { path: '../public/fonts/Pretendard-Thin.woff2', weight: '100' },
    { path: '../public/fonts/Pretendard-ExtraLight.woff2', weight: '200' },
    { path: '../public/fonts/Pretendard-Light.woff2', weight: '300' },
    { path: '../public/fonts/Pretendard-Regular.woff2', weight: '400' },
    { path: '../public/fonts/Pretendard-Medium.woff2', weight: '500' },
    { path: '../public/fonts/Pretendard-SemiBold.woff2', weight: '600' },
    { path: '../public/fonts/Pretendard-Bold.woff2', weight: '700' },
    { path: '../public/fonts/Pretendard-ExtraBold.woff2', weight: '800' },
    { path: '../public/fonts/Pretendard-Black.woff2', weight: '900' },
  ],
  variable: '--font-pretendard',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.mingling.kr'),
  title: '밍글링 - 중간 위치로 만날 곳 정하기',
  description:
    '퇴근 후 모임, 주말 약속까지! 서울 어디서든 모두가 비슷하게 도착하는 마법의 장소를 찾아드려요.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="flex min-h-screen flex-col">
        <QueryProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <GlobalModal />
        </QueryProvider>
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services,clusterer&autoload=false`}
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}

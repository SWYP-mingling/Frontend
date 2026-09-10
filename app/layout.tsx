import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import Header from '../components/header';
import Footer from '../components/footer';
import GlobalModal from '@/components/modal/globalModal';
import QueryProvider from '@/components/providers/queryProvider';

const GTM_ID = 'GTM-MSQ45TJD';

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
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <QueryProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <GlobalModal />
        </QueryProvider>
        <Script id="gtm-data-layer" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });`}
        </Script>
        <Script id="load-pretendard" strategy="lazyOnload">
          {`const fontStylesheet = document.createElement('link');
fontStylesheet.rel = 'stylesheet';
fontStylesheet.href = '/fonts/pretendard.css';
document.head.appendChild(fontStylesheet);`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-css-tags -- JavaScript 비활성 환경의 폰트 fallback */}
          <link rel="stylesheet" href="/fonts/pretendard.css" />
        </noscript>
        <Script
          id="gtm-script"
          src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}

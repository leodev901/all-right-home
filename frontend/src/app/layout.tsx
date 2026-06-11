import type { Metadata } from 'next';
import GNBHeader from '@/components/GNBHeader';
import './globals.css';

// ============================================================
// SEO 메타데이터
// ============================================================
export const metadata: Metadata = {
  title: {
    default: '올바른부동산 - AI 부동산 포탈',
    template: '%s | 올바른부동산',
  },
  description: '공인중개사를 위한 AI 기반 종합 부동산 관리 포탈. 매물관리, 고객관리, 계약관리, AI 에이전트 서비스를 한곳에서.',
  keywords: ['부동산', '공인중개사', 'AI 에이전트', '매물관리', '계약관리', '법률 에이전트', 'OCR'],
  authors: [{ name: '올바른부동산' }],
  openGraph: {
    title: '올바른부동산 - AI 부동산 포탈',
    description: '공인중개사를 위한 AI 기반 종합 부동산 관리 포탈',
    type: 'website',
    locale: 'ko_KR',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ============================================================
// 루트 레이아웃
// ============================================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* 상단 GNB (이실장 스타일) */}
        <GNBHeader />

        {/* 페이지 콘텐츠 */}
        <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
          {children}
        </div>
      </body>
    </html>
  );
}

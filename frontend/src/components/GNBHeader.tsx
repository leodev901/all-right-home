'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

// ============================================================
// 타입 정의
// ============================================================
type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string; badge?: string }[];
  badge?: string;
};

// ============================================================
// GNB 메뉴 구성 데이터
// ============================================================
const NAV_ITEMS: NavItem[] = [
  { label: '대시보드', href: '/' },
  {
    label: 'AI 서비스',
    children: [
      { label: '🤖 업무 에이전트', href: '/chat' },
      { label: '⚖️ 법률 에이전트', href: '/legal-agent', badge: '준비중' },
      { label: '📄 OCR 계약서 입력', href: '/ocr', badge: '준비중' },
    ],
  },
  { label: '매물관리', href: '/properties', badge: '준비중' },
  { label: '고객관리', href: '/customers', badge: '준비중' },
  { label: '계약관리', href: '/contracts', badge: '준비중' },
  { label: '광고/홍보', href: '/advertising', badge: '준비중' },
  { label: '연락처', href: '/contacts', badge: '준비중' },
  { label: '뉴스/공지', href: '/news', badge: '준비중' },
];

// ============================================================
// 집 아이콘 SVG (간판 스타일 참고)
// ============================================================
function HouseIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 지붕 */}
      <path
        d="M4 14L14 4L24 14"
        stroke="#F97316"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 집 몸통 */}
      <rect x="7" y="13" width="14" height="11" rx="1" stroke="#F97316" strokeWidth="2.2" />
      {/* 문 */}
      <rect x="11.5" y="18" width="5" height="6" rx="0.8" stroke="#F97316" strokeWidth="1.8" />
    </svg>
  );
}

// ============================================================
// GNBHeader 컴포넌트
// ============================================================
export default function GNBHeader() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // AI 서비스 드롭다운이 활성 경로인지 확인
  const isAiActive = ['/chat', '/legal-agent', '/ocr'].some((p) => pathname === p);

  function handleDropdownToggle(label: string) {
    setOpenDropdown((prev) => (prev === label ? null : label));
  }

  function handleDropdownClose() {
    setOpenDropdown(null);
  }

  return (
    <>
      {/* ====================================================
          상단 GNB
          ==================================================== */}
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200"
        style={{ height: 'var(--gnb-height)', boxShadow: 'var(--shadow-sm)' }}
        onMouseLeave={handleDropdownClose}
      >
        <div className="max-w-screen-2xl mx-auto h-full flex items-center justify-between px-4 lg:px-6">

          {/* ── 로고 ── */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <HouseIcon />
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold text-gray-900 tracking-tight">
                올바른<span className="text-orange-500">부동산</span>
              </span>
              <span className="text-[10px] text-gray-400 font-normal">AI 부동산 포탈</span>
            </div>
          </Link>

          {/* ── 데스크톱 메인 메뉴 ── */}
          <nav className="hidden lg:flex items-center h-full gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href
                ? pathname === item.href
                : isAiActive && item.label === 'AI 서비스';

              if (item.children) {
                // 드롭다운 메뉴
                return (
                  <div
                    key={item.label}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                  >
                    <button
                      className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors border
                        ${isActive
                          ? 'text-orange-600 bg-orange-50 border-orange-300 shadow-sm'
                          : 'text-orange-500 bg-orange-50/50 border-orange-200/60 hover:text-orange-600 hover:bg-orange-50 hover:border-orange-300'
                        }
                      `}
                    >
                      <span className="animate-pulse text-orange-500">✨</span>
                      <span>{item.label}</span>
                      <svg
                        className={`w-3.5 h-3.5 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6l4 4 4-4" />
                      </svg>
                    </button>

                    {/* 드롭다운 패널 */}
                    {openDropdown === item.label && (
                      <div className="absolute top-full left-0 mt-0 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 animate-slide-down">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`
                              flex items-center justify-between px-4 py-2.5 text-sm transition-colors
                              ${pathname === child.href
                                ? 'text-orange-500 bg-orange-50 font-medium'
                                : 'text-gray-700 hover:bg-gray-50'
                              }
                            `}
                            onClick={handleDropdownClose}
                          >
                            <span>{child.label}</span>
                            {child.badge && (
                              <span className="coming-soon-badge">{child.badge}</span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // 일반 메뉴
              return (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={`
                    flex flex-col items-center justify-center px-3 py-1 rounded-md text-sm font-medium transition-colors whitespace-nowrap
                    ${isActive
                      ? 'text-orange-500 bg-orange-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                  style={{ minHeight: '38px' }}
                >
                  <span className="leading-none">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] text-gray-400 font-normal mt-1 leading-none">{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── 우측: 알림 + 사용자 ── */}
          <div className="flex items-center gap-2">
            {/* 알림 버튼 */}
            <button
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:bg-gray-100 transition-colors relative"
              title="알림"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* 사용자 프로필 */}
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="hidden sm:block text-sm text-gray-700 font-medium">공인중개사</span>
            </button>

            {/* 모바일 햄버거 */}
            <button
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* ── 모바일 드로어 메뉴 ── */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg animate-slide-down">
            <nav className="px-4 py-3 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                if (item.children) {
                  return (
                    <div key={item.label}>
                      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2">
                        {item.label}
                      </div>
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 ml-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.label}
                          {child.badge && <span className="coming-soon-badge">{child.badge}</span>}
                        </Link>
                      ))}
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${pathname === item.href ? 'text-orange-500 bg-orange-50' : 'text-gray-700 hover:bg-gray-50'}
                    `}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                    {item.badge && <span className="coming-soon-badge">{item.badge}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* GNB 높이만큼 여백 확보 */}
      <div style={{ height: 'var(--gnb-height)' }} />
    </>
  );
}

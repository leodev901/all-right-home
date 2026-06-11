import type { Metadata } from 'next';
import Link from 'next/link';

// ============================================================
// SEO
// ============================================================
export const metadata: Metadata = {
  title: '대시보드',
  description: '올바른부동산 공인중개사 업무 대시보드',
};

// ============================================================
// 더미 데이터 타입
// ============================================================
type StatCard = {
  label: string;
  value: string | number;
  sub: string;
  accentValue?: boolean;
  icon: React.ReactNode;
};

type AiServiceCard = {
  label: string;
  description: string;
  href: string;
  icon: string;
  available: boolean;
  badge?: string;
};

type Notice = {
  id: number;
  type: '일반' | '중요' | '업데이트';
  title: string;
  date: string;
};

// ============================================================
// 통계 카드 데이터 (더미)
// ============================================================
const STAT_CARDS: StatCard[] = [
  {
    label: '등록 매물',
    value: 24,
    sub: '광고중 8건',
    accentValue: false,
    icon: (
      <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    label: '관리 고객',
    value: 137,
    sub: '이번 달 +12명',
    icon: (
      <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4.13a4 4 0 11-8 0 4 4 0 018 0zM21 12a3 3 0 11-6 0 3 3 0 016 0zM7 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: '진행 계약',
    value: 6,
    sub: '완료 예정 3건',
    icon: (
      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: '이번 달 수익',
    value: '3,200만원',
    sub: '전월 대비 +15%',
    accentValue: true,
    icon: (
      <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

// ============================================================
// AI 서비스 카드 데이터
// ============================================================
const AI_SERVICES: AiServiceCard[] = [
  {
    label: '업무 에이전트',
    description: '날씨, 뉴스, 부동산 정보 검색 등 일상 업무를 AI가 도와드립니다.',
    href: '/chat',
    icon: '🤖',
    available: true,
  },
  {
    label: '법률 에이전트',
    description: '부동산 계약, 법령, 조례 관련 법률 질문에 AI가 답변합니다.',
    href: '/legal-agent',
    icon: '⚖️',
    available: false,
    badge: '준비중',
  },
  {
    label: 'OCR 계약서 입력',
    description: '계약서 사진을 업로드하면 AI가 자동으로 내용을 인식하고 입력합니다.',
    href: '/ocr',
    icon: '📄',
    available: false,
    badge: '준비중',
  },
];

// ============================================================
// 공지사항 더미 데이터
// ============================================================
const NOTICES: Notice[] = [
  { id: 1, type: '중요', title: '2025년 부동산 중개 수수료 개정 안내', date: '2025.06.10' },
  { id: 2, type: '업데이트', title: '업무 에이전트 네이버 블로그 검색 기능 추가', date: '2025.06.09' },
  { id: 3, type: '일반', title: '부동산 전자계약 시스템 점검 안내 (6/15)', date: '2025.06.08' },
  { id: 4, type: '일반', title: '국토부 실거래가 데이터 연동 기능 준비 중', date: '2025.06.05' },
];

// 공지 타입별 배지 스타일
const NOTICE_BADGE: Record<Notice['type'], string> = {
  중요: 'bg-red-100 text-red-600',
  업데이트: 'bg-blue-100 text-blue-600',
  일반: 'bg-gray-100 text-gray-500',
};

// ============================================================
// 최근 매물 더미 데이터
// ============================================================
const RECENT_PROPERTIES = [
  { id: 1, type: '아파트', name: '강남 래미안 101동 305호', price: '9억 5,000', status: '광고중', date: '2025.06.08' },
  { id: 2, type: '오피스텔', name: '마포 공덕 파크자이 B208', price: '보3000/130', status: '검토중', date: '2025.06.06' },
  { id: 3, type: '상가', name: '역삼동 1층 코너 상가', price: '15억', status: '광고중', date: '2025.06.04' },
];

const STATUS_STYLE: Record<string, string> = {
  '광고중': 'bg-green-100 text-green-700',
  '검토중': 'bg-yellow-100 text-yellow-700',
  '완료': 'bg-gray-100 text-gray-500',
};

// ============================================================
// 대시보드 페이지
// ============================================================
export default function DashboardPage() {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  });

  return (
    <main className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-6">

      {/* ── 상단 인사말 ── */}
      <section className="mb-6">
        <p className="text-xs text-gray-400 mb-1">{today}</p>
        <h1 className="text-xl font-bold text-gray-900">
          안녕하세요, <span className="text-orange-500">공인중개사</span>님 👋
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">오늘도 올바른부동산과 함께 성공적인 업무 되세요.</p>
      </section>

      {/* ── 통계 카드 그리드 ── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {STAT_CARDS.map((card) => (
          <div key={card.label} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500">{card.label}</span>
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                {card.icon}
              </div>
            </div>
            <p className={`text-2xl font-bold ${card.accentValue ? 'text-orange-500' : 'text-gray-900'}`}>
              {card.value}
            </p>
            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </section>

      {/* ── 2컬럼 레이아웃: AI서비스 + 공지사항 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

        {/* AI 서비스 바로가기 (2/3 너비) */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">AI 서비스</h2>
            <span className="text-xs text-gray-400">베타 서비스</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {AI_SERVICES.map((service) => {
              const cardClass = `card p-4 transition-all duration-200 ${
                service.available
                  ? 'hover:border-orange-300 hover:shadow-md cursor-pointer group'
                  : 'opacity-70 cursor-not-allowed'
              }`;

              const cardContent = (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{service.icon}</span>
                    {service.badge
                      ? <span className="coming-soon-badge">{service.badge}</span>
                      : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          이용 가능
                        </span>
                      )
                    }
                  </div>
                  <p className={`font-semibold text-sm text-gray-900 mb-1 transition-colors ${service.available ? 'group-hover:text-orange-500' : ''}`}>
                    {service.label}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">{service.description}</p>
                </>
              );

              // 이용 가능한 서비스는 Link, 준비중은 div
              if (service.available) {
                return (
                  <Link key={service.label} href={service.href} className={cardClass}>
                    {cardContent}
                  </Link>
                );
              }
              return (
                <div key={service.label} className={cardClass}>
                  {cardContent}
                </div>
              );
            })}
          </div>
        </section>

        {/* 공지사항 (1/3 너비) */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">공지사항</h2>
            <button className="text-xs text-orange-500 hover:text-orange-600 font-medium">더보기</button>
          </div>
          <div className="card divide-y divide-gray-100">
            {NOTICES.map((notice) => (
              <div key={notice.id} className="flex items-start gap-2 p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${NOTICE_BADGE[notice.type]}`}>
                  {notice.type}
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-gray-800 font-medium leading-snug truncate">{notice.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{notice.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── 최근 매물 ── */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">최근 등록 매물</h2>
          <Link href="/properties" className="text-xs text-orange-500 hover:text-orange-600 font-medium">
            전체보기
          </Link>
        </div>
        <div className="card overflow-hidden">
          {/* 테이블 헤더 */}
          <div className="grid grid-cols-4 gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500">
            <span>유형</span>
            <span className="col-span-2">매물명</span>
            <span className="text-right">상태</span>
          </div>
          {/* 테이블 행 */}
          {RECENT_PROPERTIES.map((prop) => (
            <div
              key={prop.id}
              className="grid grid-cols-4 gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors items-center"
            >
              <span className="text-xs text-gray-500 font-medium">{prop.type}</span>
              <div className="col-span-2 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">{prop.name}</p>
                <p className="text-[11px] text-gray-400">{prop.price}만원 · {prop.date}</p>
              </div>
              <div className="flex justify-end">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[prop.status]}`}>
                  {prop.status}
                </span>
              </div>
            </div>
          ))}
          {/* 준비중 안내 */}
          <div className="px-4 py-3 text-center">
            <Link href="/properties" className="text-xs text-gray-400 hover:text-orange-500 transition-colors">
              매물관리 페이지에서 전체 매물을 관리할 수 있습니다 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 하단 빠른 메뉴 ── */}
      <section>
        <h2 className="text-sm font-semibold text-gray-900 mb-3">빠른 메뉴</h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {[
            { icon: '🏠', label: '매물등록', href: '/properties' },
            { icon: '👤', label: '고객추가', href: '/customers' },
            { icon: '📝', label: '계약작성', href: '/contracts' },
            { icon: '📢', label: '광고등록', href: '/advertising' },
            { icon: '📞', label: '연락처', href: '/contacts' },
            { icon: '🤖', label: 'AI 상담', href: '/chat' },
            { icon: '📰', label: '뉴스', href: '/news' },
            { icon: '⚖️', label: '법률', href: '/legal-agent' },
          ].map((menu) => (
            <Link
              key={menu.label}
              href={menu.href}
              className="card flex flex-col items-center gap-1.5 py-3 px-2 hover:border-orange-300 hover:shadow-sm transition-all duration-200 text-center group"
            >
              <span className="text-xl">{menu.icon}</span>
              <span className="text-[11px] font-medium text-gray-600 group-hover:text-orange-500 transition-colors">
                {menu.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}

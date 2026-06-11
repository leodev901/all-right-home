// ============================================================
// ComingSoon 컴포넌트
// 준비중인 페이지에 공통으로 사용하는 UI
// ============================================================

type ComingSoonProps = {
  title: string;
  description?: string;
  icon?: string; // 이모지 아이콘
};

export default function ComingSoon({
  title,
  description,
  icon = '🚧',
}: ComingSoonProps) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* 아이콘 원형 배경 */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-6"
        style={{ background: 'var(--color-accent-light)' }}
      >
        {icon}
      </div>

      {/* 제목 */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>

      {/* 뱃지 */}
      <span className="coming-soon-badge text-sm px-3 py-1 mb-4">준비중</span>

      {/* 설명 */}
      <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
        {description ?? '더 나은 서비스를 위해 열심히 준비하고 있습니다.\n빠른 시일 내에 오픈할 예정입니다.'}
      </p>

      {/* 대시보드로 돌아가기 */}
      <a
        href="/"
        className="mt-8 btn-primary px-6 py-2.5 text-sm inline-block"
        style={{ borderRadius: '8px' }}
      >
        ← 대시보드로 돌아가기
      </a>
    </main>
  );
}

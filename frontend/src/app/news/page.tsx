import type { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';
export const metadata: Metadata = { title: '뉴스/공지' };
export default function NewsPage() {
  return <ComingSoon title="뉴스/공지" description="지역별 부동산 뉴스, 정책 변경 사항, 실거래가 동향을 자동 수집하여 제공하는 기능을 준비하고 있습니다." icon="📰" />;
}

import type { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';
export const metadata: Metadata = { title: '고객관리' };
export default function CustomersPage() {
  return <ComingSoon title="고객관리" description="고객 정보, 연락 이력, 관심 매물 등 고객 관리 기능을 준비하고 있습니다." icon="👤" />;
}

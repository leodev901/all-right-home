import type { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';
export const metadata: Metadata = { title: '계약관리' };
export default function ContractsPage() {
  return <ComingSoon title="계약관리" description="계약 리스트, 진행 현황, 전자계약 연동 기능을 준비하고 있습니다." icon="📝" />;
}

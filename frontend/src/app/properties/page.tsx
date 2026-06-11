import type { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';
export const metadata: Metadata = { title: '매물관리' };
export default function PropertiesPage() {
  return <ComingSoon title="매물관리" description="매물 등록, 수정, 삭제 및 광고 현황을 한눈에 관리하는 기능을 준비하고 있습니다." icon="🏠" />;
}

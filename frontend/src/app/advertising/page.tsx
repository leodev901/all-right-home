import type { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';
export const metadata: Metadata = { title: '광고/홍보' };
export default function AdvertisingPage() {
  return <ComingSoon title="광고/홍보" description="매물 광고 등록, 네이버/다방/직방 연동 광고 현황 관리 기능을 준비하고 있습니다." icon="📢" />;
}

import type { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';
export const metadata: Metadata = { title: '연락처' };
export default function ContactsPage() {
  return <ComingSoon title="연락처" description="고객, 동료 공인중개사, 관계자 연락처를 통합 관리하는 기능을 준비하고 있습니다." icon="📞" />;
}

import type { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';
export const metadata: Metadata = { title: '법률 에이전트' };
export default function LegalAgentPage() {
  return <ComingSoon title="법률 에이전트" description="부동산 계약, 법령, 조례 관련 법률 질문에 AI가 전문적으로 답변하는 서비스를 준비하고 있습니다." icon="⚖️" />;
}

import type { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';
export const metadata: Metadata = { title: 'OCR 계약서 입력' };
export default function OcrPage() {
  return <ComingSoon title="OCR 계약서 자동 입력" description="계약서 사진을 업로드하면 AI가 자동으로 내용을 인식하고 입력해주는 기능을 준비하고 있습니다." icon="📄" />;
}

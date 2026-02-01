import { notFound } from 'next/navigation';
import ShareClient from './shareClient';
import { apiGet } from '@/lib/api';

// UUID 형식 검사 정규식
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  // 형식이 UUID가 아니면 바로 404 에러
  if (!UUID_REGEX.test(id)) {
    notFound();
  }

  // DB를 통해 실제로 존재하는 모임인지 확인
  try {
    // 모임 상세 조회 API를 호출
    await apiGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/meeting/result/${id}`);
  } catch (error) {
    notFound();
  }

  // 검증 통과 시 UI 렌더링
  return <ShareClient meetingId={id} />;
}

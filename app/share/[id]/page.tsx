import { notFound } from 'next/navigation';
import ShareClient from './shareClient';
import { apiGet } from '@/lib/api'; // 아까 만든 API 유틸

// UUID 형식 검사 정규식
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface PageProps {
  params: Promise<{ id: string }>;
}

// Next.js Server Component
export default async function Page({ params }: PageProps) {
  const { id } = await params;

  // 1. [1차 방어] 형식이 UUID가 아니면 바로 404 (DB 찌를 필요도 없음)
  if (!UUID_REGEX.test(id)) {
    notFound();
  }

  // // 2. [2차 방어] 실제 DB에 존재하는 모임인지 확인
  // try {
  //   // 모임 상세 조회 API를 호출해봅니다. (엔드포인트는 실제 서버 API에 맞게 수정)
  //   // 데이터가 없거나 에러가 나면 catch로 넘어갑니다.
  //   await apiGet(`/meeting/${id}/status`);
  // } catch (error) {
  //   // 존재하지 않는 모임 ID라면 404 페이지로 보냄
  //   notFound();
  // }

  // 3. 검증 통과 시 UI 렌더링
  return <ShareClient meetingId={id} />;
}

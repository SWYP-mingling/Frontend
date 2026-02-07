import type { Metadata, ResolvingMetadata } from 'next';
import JoinForm from '@/components/join/joinForm';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const { view } = await searchParams;

  // 부모(layout.tsx)의 이미지 정보 가져오기
  const previousImages = (await parent).openGraph?.images || [];

  // 상황별 텍스트 및 이미지 설정
  const isNudge = view === 'nudge';

  const title = isNudge ? '모임원들이 결과를 기다리고 있어요!' : '모임에 참여하세요!';

  // 쿼리스트링에 따라 이미지 URL만 변경
  const imageUrl =
    view === 'nudge'
      ? '/images/og-image/nudge_meeting_card.jpg' // 재촉하기 이미지
      : '/images/og-image/share_meeting_card.jpg'; // 기본 초대 이미지

  return {
    title,
    openGraph: {
      title,
      url: `https://www.mingling.kr/join/${id}`, // 실제 도메인으로 변경 권장
      images: [imageUrl, ...previousImages],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <JoinForm meetingId={id} />;
}

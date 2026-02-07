import type { Metadata } from 'next';
import ShareContent from '@/components/share/shareContent';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  return {
    title: '모임이 만들어졌어요! 🎉',
    description: '친구들에게 링크를 공유하고 출발지를 받아보세요.',
    openGraph: {
      title: '모임이 만들어졌어요! 🎉',
      description: '친구들에게 링크를 공유하고 출발지를 받아보세요.',
      images: ['/images/og-image/create_meeting_card.jpg'],
      url: `https://www.mingling.kr/share/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: '모임이 만들어졌어요! 🎉',
      description: '친구들에게 링크를 공유하고 출발지를 받아보세요.',
      images: ['/images/og-image/create_meeting_card.jpg'],
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <ShareContent id={id} />;
}

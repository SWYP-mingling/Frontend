'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Toast from '@/components/ui/toast';
import { useShareMeeting } from '@/hooks/api/query/useShareMeeting';
import Image from 'next/image';
import { sendGAEvent } from '@next/third-parties/google';

interface ShareContentProps {
  id: string;
}

export default function ShareContent({ id }: ShareContentProps) {
  // useParams() 대신 부모(Page)에서 전달받은 id 사용
  const { shareUrl, isError, isLoading, handleCopyLink, isVisible } = useShareMeeting(id);

  // 복사 버튼 클릭 시 실행할 래퍼 함수 생성
  const handleCopyClickWithGA = () => {
    handleCopyLink();

    // 2. GA4 이벤트 전송 로직 인라인 처리
    if (typeof window !== 'undefined') {
      // 브라우저 식별자(browser_id) 확인 및 생성 (Get or Create)
      let browserId = localStorage.getItem('browser_id');
      if (!browserId) {
        const randomStr = Math.random().toString(36).substring(2, 15);
        browserId = `bid_${randomStr}${Date.now().toString(36)}`;
        localStorage.setItem('browser_id', browserId);
      }

      sendGAEvent('event', 'share_link', {
        meeting_url_id: id,
        location: 'creation_complete',
        browser_id: browserId,
      });
    }
  };

  if (isError) notFound();
  if (isLoading) return null;

  return (
    <div className="flex flex-col items-center justify-center bg-white px-5 py-10 md:py-25">
      <h2 className="text-gray-10 mb-9 text-center text-2xl leading-[1.334] font-bold">
        모임원들에게
        <br />
        링크를 공유해주세요
      </h2>

      <section className="mb-9 flex h-70 w-80 max-w-sm items-center justify-center rounded-2xl md:w-90">
        <Image
          src="/images/create_meeting.jpg"
          width={360}
          height={257}
          alt="모임이 만들어졌어요"
        />
      </section>

      <div className="relative z-10 mb-9 flex w-full rounded-sm md:w-90">
        <Toast message="주소가 복사되었습니다" isVisible={isVisible} />
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="border-gray-1 grow rounded-l-sm border border-r-0 bg-white p-2.5 text-[15px] font-normal text-black focus:outline-none"
        />
        <button
          type="button"
          onClick={handleCopyClickWithGA}
          className="bg-gray-1 text-gray-6 border-gray-1 hover:bg-gray-2 cursor-pointer rounded-r-sm border px-3.5 py-3 text-sm font-semibold whitespace-nowrap transition-colors"
        >
          복사
        </button>
      </div>

      <Link
        href={`/join/${id}`}
        className="bg-blue-5 hover:bg-blue-8 h-12 w-full rounded-sm py-2.5 pt-3 text-center text-lg font-normal text-white transition-colors md:w-90"
      >
        내 출발지 등록하기
      </Link>
    </div>
  );
}

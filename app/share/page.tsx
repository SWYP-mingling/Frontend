'use client';

import Toast from '@/components/ui/toast';
import Link from 'next/link';
import { useToast } from '@/hooks/useToast';
import { useState } from 'react';

export default function ShareLinkPage() {
  const [link, setLink] = useState('www.abcabc');
  const { isVisible, show } = useToast();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      show();
    } catch (error) {
      console.error('복사 실패: ', error);
      alert('복사에 실패했습니다. 링크를 직접 복사해주세요.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white px-5 py-10 md:py-25">
      <h3 className="text-gray-10 mb-9 text-center text-2xl leading-[1.334] font-bold md:text-4xl">
        모임이 만들어졌어요!
        <br />
        링크를 공유해주세요
      </h3>

      <section className="mb-9 flex h-70 w-80 max-w-sm items-center justify-center rounded-2xl bg-gray-200 md:w-90">
        <div className="text-gray-10 text-center font-semibold">
          <p className="text-lg">이미지</p>
          <p className="text-lg">(빵빠레~)</p>
        </div>
      </section>

      <div className="relative z-10 mb-9 flex w-full rounded-sm md:w-90">
        <Toast message="주소가 복사되었습니다" isVisible={isVisible} />

        <input
          type="text"
          name="shareLink"
          aria-label="모임 공유 링크"
          value={link}
          readOnly
          className="border-gray-1 grow rounded-l-sm border border-r-0 bg-white p-2.5 text-[15px] font-normal text-black focus:outline-none"
        />
        <button
          type="button"
          onClick={handleCopyLink}
          className="bg-gray-1 text-gray-6 border-gray-1 hover:bg-gray-2 cursor-pointer rounded-r-sm border px-3.5 py-3 text-sm font-semibold whitespace-nowrap transition-colors"
        >
          복사
        </button>
      </div>

      <Link
        href="/"
        className="bg-blue-5 hover:bg-blue-8 h-12 w-full rounded-sm py-2.5 pt-3 text-center text-lg font-normal text-white transition-colors md:w-90"
      >
        내 출발지 등록하기
      </Link>
    </div>
  );
}

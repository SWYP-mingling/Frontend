'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ShareLinkPage() {
  const [link, setLink] = useState('www.abcabc');
  const [showToast, setShowToast] = useState(false);

  const handleCopyLink = async () => {
    if (showToast) return;

    try {
      await navigator.clipboard.writeText(link);
      setShowToast(true);
    } catch (err) {
      console.error('복사 실패', err);
    }
  };

  // 2초 뒤에 자동으로 사라지게 하는 로직
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

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
        <div
          className={`absolute bottom-full left-1/2 mb-3 h-8 -translate-x-1/2 whitespace-nowrap transition-all duration-300 ease-out ${showToast ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`}
        >
          <div className="bg-gray-8 relative rounded-full px-7 py-2 text-xs font-normal text-white">
            주소가 복사되었습니다
          </div>
        </div>

        <input
          type="text"
          name="shareLink"
          value={link}
          readOnly
          className="border-gray-1 grow border border-r-0 bg-white p-2.5 text-[15px] font-normal text-black focus:outline-none"
        />
        <button
          onClick={handleCopyLink}
          className="bg-gray-1 text-gray-6 border-gray-1 hover:bg-gray-2 cursor-pointer border px-3.5 py-3 text-sm font-semibold whitespace-nowrap transition-colors"
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

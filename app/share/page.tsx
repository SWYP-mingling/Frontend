'use client';

import { useState } from 'react';

export default function ShareLinkPage() {
  const [link, setLink] = useState('www.abcabc');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    alert('링크가 복사되었습니다!');
  };

  return (
    <main className="flex flex-col items-center justify-center bg-white px-5 py-10 md:py-25">
      {/* 1. 타이틀 영역 */}
      <h3 className="text-gray-10 mb-9 text-center text-2xl leading-[1.334] font-bold md:text-4xl">
        모임이 만들어졌어요!
        <br />
        링크를 공유해주세요
      </h3>

      <div className="mb-9 flex h-70 w-80 max-w-sm items-center justify-center rounded-2xl bg-gray-200 md:w-90">
        <div className="text-center font-medium text-gray-600">
          <p className="text-lg">이미지</p>
          <p className="text-lg">(빵빠레~)</p>
        </div>
      </div>

      <div className="mb-9 flex w-full rounded-sm md:w-90">
        <input
          type="text"
          value={link}
          readOnly
          className="border-gray-1 grow border border-r-0 bg-white p-2.5 text-[15px] font-normal text-black focus:outline-none"
        />
        <button
          onClick={handleCopyLink}
          className="bg-gray-1 text-gray-6 border-gray-1 hover:bg-gray-2 border px-3.5 py-3 text-sm font-semibold whitespace-nowrap transition-colors"
        >
          복사
        </button>
      </div>

      <button
        className="bg-blue-5 hover:bg-blue-8 h-12 w-full rounded-sm py-2.5 pt-3 text-lg font-normal text-white transition-colors md:w-90"
        onClick={() => console.log('내 출발지 등록 페이지로 이동')}
      >
        내 출발지 등록하기
      </button>
    </main>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import KakaoMap from '@/components/map/kakaoMap';

// 목 데이터
const MOCK_PARTICIPANTS = [
  { id: 1, name: '안', station: '홍대입구역', status: 'pending', color: 'bg-blue-500' },
  { id: 2, name: '손', station: '성수역', status: 'pending', color: 'bg-orange-400' },
  { id: 3, name: '김', station: '강남역', status: 'done', color: 'bg-red-500' },
  { id: 4, name: '이', station: '건대입구역', status: 'done', color: 'bg-purple-600' },
];

export default function MeetingPage() {
  const [searchValue, setSearchValue] = useState('');

  return (
    // 전체 화면 배경 및 중앙 정렬
    <div className="flex items-center justify-center p-0 md:min-h-[calc(100vh-200px)] md:py-25">
      {/* 메인 컨테이너 (반응형 박스) */}
      <div className="flex h-full w-full flex-col overflow-hidden bg-white md:h-175 md:w-174 md:flex-row md:gap-4 md:rounded-xl lg:w-215">
        {/* [LEFT PANEL] 데스크탑 전용 정보 영역 */}
        <section className="border-gray-1 flex w-full flex-col gap-5 bg-white md:w-77.5 md:gap-10">
          {/* 타이머 섹션 */}
          <div className="px-5 pt-10 md:p-0">
            <div className="flex items-start justify-between">
              <div className="text-[22px] leading-[1.364] font-semibold tracking-[-1.948%]">
                <h2 className="text-gray-9">
                  투표 마감 시간
                  <br />
                  <span className="text-blue-5">03: 45</span> 남았습니다
                </h2>
                <p className="text-gray-5 mt-2 text-[15px] font-normal">
                  아직 입력 안 한 모임원 2명
                </p>
              </div>
              <button
                className="text-blue-5 bg-blue-1 flex h-6 w-30 cursor-pointer items-center gap-0.5 rounded px-3 py-1.5 text-[11px] font-semibold transition-colors"
                type="button"
              >
                <Image src="/icon/share.svg" alt="공유 아이콘" width={12} height={12} />
                참여 링크 공유하기
              </button>
            </div>
          </div>

          {/* 모바일 전용 지도 영역 */}
          <KakaoMap className="relative block aspect-video h-93.5 bg-gray-100 md:hidden" />

          {/* 검색창 */}
          <div className="px-5 md:p-0">
            <h3 className="text-gray-9 mb-3 text-xl font-semibold">내 출발지</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="출발역을 검색해주세요"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="bg-gray-1 placeholder:text-gray-4 border-gray-2 focus:ring-blue-5 h-10 w-full rounded border py-2 pl-3 text-[15px] text-gray-900 transition-all outline-none focus:ring-1"
              />
              <Image
                className="text-gray-6 absolute top-1/2 right-2.5 -translate-y-1/2"
                src="/icon/search.svg"
                alt="돋보기 아이콘"
                width={20}
                height={20}
              />
            </div>
          </div>

          <div className="bg-gray-1 relative h-1 w-full md:hidden"></div>

          {/* 참여 현황 */}
          <div className="flex flex-1 flex-col gap-3 overflow-hidden px-5 md:gap-3.5 md:p-0">
            {/* [1] 상단 고정 영역 */}
            <div className="flex items-center justify-between bg-white">
              <h3 className="text-gray-9 text-xl font-semibold">참여현황</h3>
              <span className="text-gray-6 text-normal text-xs">
                <span className="text-blue-5">{MOCK_PARTICIPANTS.length}명</span>이 참여 중
              </span>
            </div>

            {/* [2] 재촉하기 배너 */}
            <div className="bg-blue-5 hover:bg-blue-8 flex h-21 w-full cursor-pointer items-center justify-between rounded p-4 text-white transition-transform active:scale-[0.98]">
              <div className="flex flex-col gap-0.5">
                <span className="text-lg leading-[1.44] font-semibold">
                  아직 입력하지 않은 친구
                  <br />
                  재촉하기
                </span>
              </div>

              <div className="bg-gray-3 h-13 w-14"></div>
            </div>

            {/* [3] 출발지 컴포넌트 */}
            <div className="mb-10 flex-1">
              <div className="flex flex-col gap-3.5">
                {MOCK_PARTICIPANTS.map((user) => (
                  <div
                    key={user.id}
                    className="border-gray-2 flex h-17 items-center justify-between rounded border bg-white px-5"
                  >
                    <span className="text-gray-8 text-[17px] font-semibold">{user.station}</span>
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-normal text-white ${user.color}`}
                      >
                        {user.name}
                      </div>
                      <span className="text-gray-8 text-[15px]">안가연</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* [RIGHT PANEL] 데스크탑 전용 지도 영역 */}
        <section className="hidden h-full flex-1 bg-gray-100 md:block">
          <KakaoMap className="h-full w-full" />
        </section>
      </div>
    </div>
  );
}

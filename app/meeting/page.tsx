'use client';

import { useState } from 'react';
import { Search, Share2 } from 'lucide-react';
import KakaoMap from '@/components/map/kakaoMap'; // 컴포넌트 임포트

const MOCK_PARTICIPANTS = [
  { id: 1, name: '안', station: '홍대입구역', status: 'pending', color: 'bg-blue-500' },
  { id: 2, name: '손', station: '성수역', status: 'pending', color: 'bg-orange-400' },
  { id: 3, name: '김', station: '강남역', status: 'done', color: 'bg-red-500' },
  { id: 4, name: '이', station: '건대입구역', status: 'done', color: 'bg-purple-600' },
  { id: 5, name: '강', station: '천호역', status: 'done', color: 'bg-yellow-500' },
  { id: 6, name: '최', station: '사당역', status: 'done', color: 'bg-violet-600' },
  { id: 7, name: '정', station: '고속터미널역', status: 'pending', color: 'bg-sky-500' },
];

export default function MeetingPage() {
  const [searchValue, setSearchValue] = useState('');

  return (
    // 1. 전체 화면 배경 및 중앙 정렬 (회색 배경)
    <div className="flex items-center justify-center p-0 md:min-h-[calc(100vh-200px)] md:py-25">
      {/* 2. 메인 컨테이너 (반응형 박스) */}
      <div className="flex h-full w-full flex-col overflow-hidden bg-white md:h-175 md:w-215 md:flex-row md:gap-4 md:rounded-xl">
        {/* =========================================================
            [LEFT PANEL] 정보 영역
        ========================================================= */}
        <section className="flex w-full flex-col border-gray-100 bg-white md:w-77.5">
          {/* A. 타이머 섹션 */}
          <div className="px-6 pt-8 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[22px] leading-snug font-bold text-gray-900">
                  투표 마감 시간
                  <br />
                  <span className="text-blue-500">03 : 45</span> 남았습니다
                </h2>
                <p className="mt-2 text-[13px] font-medium text-gray-500">
                  아직 입력 안 한 모임원 2명
                </p>
              </div>
              <button className="flex items-center gap-1.5 rounded bg-blue-50 px-3 py-1.5 text-[11px] font-semibold text-blue-500 transition-colors hover:bg-blue-100">
                <Share2 size={12} />
                공유
              </button>
            </div>
          </div>

          {/* ★★★ B. [모바일 전용 지도] 교체 완료 ★★★ 
              - 기존 div 태그를 KakaoMap 컴포넌트로 변경
              - className은 기존 div의 것을 그대로 승계 (배경색, aspect-ratio 등 유지)
          */}
          <KakaoMap className="relative mb-4 block aspect-video w-full bg-gray-100 md:hidden" />

          {/* C. 검색창 */}
          <div className="mb-4 px-6">
            <h3 className="mb-3 text-[15px] font-bold text-gray-900">내 출발지</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="출발역을 검색해주세요"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full rounded border border-gray-200 bg-gray-50 py-3 pr-10 pl-4 text-[14px] text-gray-900 transition-all outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-blue-500"
              />
              <Search
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>

          {/* D. 참여 현황 */}
          <div className="flex flex-1 flex-col overflow-hidden pb-6">
            {/* [1] 상단 고정 영역 */}
            <div className="px-6 pt-2">
              <div className="mb-3 flex items-end justify-between bg-white">
                <h3 className="text-[15px] font-bold text-gray-900">참여현황</h3>
                <span className="text-[13px] text-gray-500">
                  <span className="font-semibold text-blue-500">{MOCK_PARTICIPANTS.length}명</span>
                  이 참여 중
                </span>
              </div>

              {/* 재촉하기 배너 */}
              <div className="mb-4 flex w-full shrink-0 cursor-pointer items-center justify-between rounded bg-blue-500 px-5 py-4 text-white shadow-sm transition-transform active:scale-[0.98]">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[12px] font-medium opacity-90">
                    아직 입력하지 않은 친구
                  </span>
                  <span className="text-[16px] font-bold">재촉하기</span>
                </div>
                <div className="h-10 w-10 rounded bg-white/20 backdrop-blur-sm"></div>
              </div>
            </div>

            {/* [2] 하단 스크롤 영역 */}
            <div className="scrollbar-hide flex-1 overflow-y-auto pr-2 pl-6">
              <div className="flex flex-col gap-3">
                {MOCK_PARTICIPANTS.map((user) => (
                  <div
                    key={user.id}
                    className="flex h-14 shrink-0 items-center justify-between rounded border border-gray-100 bg-white px-4 transition-colors hover:border-blue-200"
                  >
                    <span className="text-[14px] font-medium text-gray-800">{user.station}</span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ${user.color}`}
                      >
                        {user.name}
                      </div>
                      <span className="text-[12px] text-gray-400">
                        {user.status === 'done' ? '만기면' : '안가연'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            [RIGHT PANEL] 데스크탑 전용 지도 영역
        ========================================================= */}
        <section className="hidden h-full flex-1 bg-gray-100 md:block">
          {/* ★★★ [데스크탑 지도] 교체 완료 ★★★ 
               - 기존의 배경 이미지와 절대 좌표 핀 div들을 제거하고 
               - KakaoMap이 부모 section(flex-1)을 가득 채우도록 h-full w-full 적용
           */}
          <KakaoMap className="h-full w-full" />
        </section>
      </div>
    </div>
  );
}

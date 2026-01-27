'use client';

import { useState } from 'react';
import Image from 'next/image';
import KakaoMap from '@/components/map/kakaoMap';
import StationSearch from '@/components/meeting/stationSearch';
import { useOpenModal } from '@/hooks/useOpenModal';
import { MOCK_PARTICIPANTS, MOCK_SEARCH_STATIONS } from '@/mock/mockData';

export default function MeetingPage() {
  // 선택된 역 이름 상태 관리
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const openModal = useOpenModal();

  // 1. [좌표 찾기] 선택된 역 이름으로 MOCK 데이터에서 정보 찾기
  const selectedStationInfo = MOCK_SEARCH_STATIONS.find(
    (station) => station.name === selectedStation
  );

  // 2. [내 참가자 객체 생성] 선택된 역이 있을 때만 생성
  const myParticipant = selectedStation
    ? {
        id: 'me', // 고유 ID (문자열)
        name: '나',
        station: selectedStation,
        // 정보가 없으면 서울시청 좌표를 기본값으로 사용 (예외 처리)
        lat: selectedStationInfo?.lat || 37.5665,
        lng: selectedStationInfo?.lng || 126.978,
        status: 'done',
        hexColor: '#000000',
      }
    : null;

  // 3. [최종 리스트 병합] 내가 있으면 맨 앞에 추가, 없으면 기존 리스트만 사용
  const allParticipants = myParticipant ? [myParticipant, ...MOCK_PARTICIPANTS] : MOCK_PARTICIPANTS;

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
                className="text-blue-5 bg-blue-1 hover:bg-blue-2 flex h-6 w-30 cursor-pointer items-center gap-0.5 rounded px-3 py-1.5 text-[11px] font-semibold transition-colors"
                type="button"
                onClick={(e) => openModal('SHARE', e)}
              >
                <Image src="/icon/share.svg" alt="공유 아이콘" width={12} height={12} />
                참여 링크 공유하기
              </button>
            </div>
          </div>

          {/* 모바일 전용 지도 영역: allParticipants 전달 */}
          <KakaoMap
            className="relative block aspect-video h-93.5 bg-gray-100 md:hidden"
            participants={allParticipants}
          />

          {/* 출발지 검색 창 컴포넌트 */}
          <StationSearch
            stations={MOCK_SEARCH_STATIONS}
            selectedStation={selectedStation}
            onSelect={setSelectedStation}
          />

          <div className="bg-gray-1 relative h-1 w-full md:hidden"></div>

          {/* 참여 현황 */}
          <div className="flex flex-1 flex-col gap-3 overflow-hidden px-5 md:gap-3.5 md:p-0">
            {/* [1] 상단 고정 영역 */}
            <div className="flex items-center justify-between bg-white">
              <h3 className="text-gray-9 text-xl font-semibold">참여현황</h3>
              <span className="text-gray-6 text-normal text-xs">
                {/* 전체 인원 수 동적 반영 */}
                <span className="text-blue-5">{allParticipants.length}명</span>이 참여 중
              </span>
            </div>

            {/* [2] 재촉하기 배너 */}
            <button
              type="button"
              className="bg-blue-5 hover:bg-blue-8 flex h-21 w-full cursor-pointer items-center justify-between rounded p-4 text-left text-white transition-transform active:scale-[0.98]"
              onClick={(e) => openModal('NUDGE', e)}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-lg leading-[1.44] font-semibold">
                  아직 입력하지 않은 친구
                  <br />
                  재촉하기
                </span>
              </div>
              <div className="bg-gray-3 h-13 w-14"></div>
            </button>

            {/* [3] 출발지 컴포넌트: 리스트 렌더링 */}
            <div className="mb-10 flex-1">
              <div className="[&::-webkit-scrollbar-thumb]:bg-gray-6 flex h-80 flex-col gap-3.5 overflow-y-scroll pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full">
                {allParticipants.map((user) => (
                  <div
                    key={user.id}
                    className={`flex h-17 shrink-0 items-center justify-between rounded border bg-white px-5 ${
                      // 내가 선택한 경우, 강조하기
                      user.id === 'me' ? 'border-blue-5' : 'border-gray-2'
                    }`}
                  >
                    <span className="text-gray-8 text-[17px] font-semibold">{user.station}</span>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-normal text-white"
                        style={{ backgroundColor: `${user.hexColor}` }}
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

        {/* [RIGHT PANEL] 데스크탑 전용 지도 영역: allParticipants 전달 */}
        <section className="bg-gray-1 hidden h-full flex-1 md:block">
          <KakaoMap className="h-full w-full" participants={allParticipants} />
        </section>
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import KakaoMap from '@/components/map/kakaoMap';
import StationSearch from '@/components/meeting/stationSearch';
import { useOpenModal } from '@/hooks/useOpenModal';
import { useParams, useRouter } from 'next/navigation';
import { useSetDeparture } from '@/hooks/api/mutation/useSetDeparture';
import { useCheckMeeting } from '@/hooks/api/query/useCheckMeeting'; // [추가] 조회 훅
import StationDataRaw from '@/database/stations_info.json';
import { getRandomHexColor } from '@/lib/color';

// 로컬 데이터 타입 정의
interface StationInfo {
  line: string;
  name: string;
  latitude: number;
  longitude: number;
}

const STATION_DATA = StationDataRaw as StationInfo[];

export default function Page() {
  // 선택된 역 이름 상태 관리
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  // 내 이름 관리 (로컬 스토리지에서 가져옴)

  const params = useParams();
  const id = params?.id as string;

  const openModal = useOpenModal();
  const router = useRouter();

  // [API Hook] 모임 정보 조회 & 출발지 등록
  const { data: meetingData } = useCheckMeeting(id);
  const { mutate: setDeparture } = useSetDeparture(id);
  const [myName] = useState<string>(() => {
       if (typeof window === 'undefined') return '';
       return localStorage.getItem('userId') || sessionStorage.getItem('userId') || '';
     });

  // 2. 역 선택 시 실행될 로직 (상태 변경 + API 전송)
  const handleSelectStation = (stationName: string | null) => {
    // 화면 UI 즉시 업데이트
    setSelectedStation(stationName);

    if (!stationName) return;

    const stationInfo = STATION_DATA.find((s) => s.name === stationName);

    if (stationInfo) {
      // API 전송 (백엔드 스펙: { departure: "역이름" })
      setDeparture({
        departure: stationInfo.name,
      });
    } else {
      console.error('역 정보를 찾을 수 없습니다.');
    }
  };

  // 3. '나' 객체 생성 (로컬 데이터 기반 즉시 반영)
  const myParticipant = useMemo(() => {
    if (!selectedStation) return null;

    // 로컬 JSON에서 좌표 즉시 조회 (API 응답 대기 X -> 속도 UP)
    const info = STATION_DATA.find((s) => s.name === selectedStation);
    if (!info) return null;

    return {
      id: 'me',
      name: myName || '나', // 로컬 스토리지 이름 사용
      station: info.name,
      line: info.line,
      latitude: info.latitude,
      longitude: info.longitude,
      status: 'done',
      hexColor: '#000000', // 나는 검정색 고정
    };
  }, [selectedStation, myName]);

  // 4. [최종 리스트 병합] 서버 데이터(남) + 로컬 데이터(나)
  const allParticipants = useMemo(() => {
    // 서버에서 받은 '이미 등록한 참가자들'
    const serverParticipants = meetingData?.data.participants || [];

    // 지도 표시용 포맷으로 변환
       const others = serverParticipants
        .filter((p) => p.userName !== myName) // 혹시 모를 중복 방지 (내 이름 제외)
        .map((p, index) => {
           const stationInfo = STATION_DATA.find((s) => s.name === p.stationName);
           return {
            id: `other-${index}`,
            name: p.userName,
            station: p.stationName,
            line: stationInfo?.line ?? '미확인',
            latitude: p.latitude,
            longitude: p.longitude,
            status: 'done',
            hexColor: getRandomHexColor(p.userName || p.stationName || `user-${index}`),
           };
        });

    // 내가 선택했으면 [나, ...다른사람들], 아니면 [...다른사람들]
    return myParticipant ? [myParticipant, ...others] : others;
  }, [meetingData, myParticipant, myName]); 

  const handleSubmit = () => {
    if (!selectedStation) {
      alert('출발지를 먼저 선택해주세요!');
      return;
    }
    // 결과 페이지로 이동
    router.push(`/result/${id}`);
  };

  return (
    <div className="flex items-center justify-center p-0 md:min-h-[calc(100vh-200px)] md:py-25">
      <div className="flex h-full w-full flex-col bg-white md:h-175 md:w-174 md:flex-row md:gap-4 md:rounded-xl lg:w-215">
        {/* [LEFT PANEL] 데스크탑 전용 정보 영역 */}
        <section className="border-gray-1 flex w-full flex-col gap-5 bg-white md:w-77.5 md:gap-10">
          {/* 타이머 섹션 */}
          <div className="px-5 pt-10 md:p-0">
            <div className="flex items-start justify-between">
              <div className="text-[22px] leading-[1.364] font-semibold tracking-[-1.948%]">
                <h2 className="text-gray-9">
                  투표 마감 시간
                  <br />
                  {/* 마감 시간은 API 데이터가 있으면 그것을 활용하거나 기존대로 유지 */}
                  <span className="text-blue-5">03: 45</span> 남았습니다
                </h2>
                <p className="text-gray-5 mt-2 text-[15px] font-normal">
                  {/* API 데이터로 '안 한 사람' 수 계산 */}
                  아직 입력 안 한 모임원 {meetingData?.data.pendingParticipantCount ?? 0}명
                </p>
              </div>
              <button
                className="text-blue-5 bg-blue-1 hover:bg-blue-2 flex h-6 w-30 cursor-pointer items-center gap-0.5 rounded px-3 py-1.5 text-[11px] font-semibold transition-colors"
                type="button"
                onClick={(e) => openModal('SHARE', { meetingId: id }, e)}
              >
                <Image src="/icon/share.svg" alt="공유 아이콘" width={12} height={12} />
                참여 링크 공유하기
              </button>
            </div>
          </div>

          {/* 모바일 전용 지도 영역 */}
          <KakaoMap
            className="bg-gray-1 relative block aspect-video h-93.5 md:hidden"
            participants={allParticipants}
          />

          {/* 출발지 검색 창 컴포넌트 */}
          <StationSearch
            stations={STATION_DATA}
            selectedStation={selectedStation}
            onSelect={handleSelectStation}
          />

          <div className="bg-gray-1 relative h-1 w-full md:hidden"></div>

          {/* 참여 현황 */}
          <div className="relative flex flex-1 flex-col gap-3 overflow-hidden px-5 md:gap-3.5 md:p-0">
            {/* 상단 고정 영역 */}
            <div className="flex items-center justify-between bg-white">
              <h3 className="text-gray-9 text-xl font-semibold">참여현황</h3>
              <span className="text-gray-6 text-normal text-xs">
                {/* 전체 인원 수 동적 반영 (API) */}
                <span className="text-blue-5">
                  {meetingData?.data.totalParticipantCount ?? 0}명
                </span>
                이 참여 중
              </span>
            </div>

            {/* 재촉하기 배너 */}
            <button
              type="button"
              className="bg-blue-5 hover:bg-blue-8 flex h-21 w-full cursor-pointer items-center justify-between rounded p-4 text-left text-white transition-transform active:scale-[0.98]"
              onClick={(e) => openModal('NUDGE', { meetingId: id }, e)}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-lg leading-[1.44] font-semibold">
                  아직 입력하지 않은 친구
                  <br />
                  재촉하기
                </span>
              </div>
              <Image
                src="/images/nudge_meeting.png"
                width={84}
                height={52}
                alt="아직 입력하지 않은 친구 재촉하기"
              />
            </button>

            {/* 출발지 컴포넌트: 리스트 렌더링 */}
            <div className="mb-10 flex-1">
              <div className="[&::-webkit-scrollbar-thumb]:bg-gray-6 flex h-80 flex-col gap-3.5 overflow-y-scroll pr-2 pb-5 md:pb-18 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full">
                {allParticipants.map((user) => (
                  <div
                    key={user.id}
                    className={`flex h-17 shrink-0 items-center justify-between rounded border bg-white px-5 ${
                      // 내가 선택한 경우, 강조하기 (ID가 'me'이거나 이름이 내 이름일 때)
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
                      <span className="text-gray-8 text-[15px]">{user.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="bg-gray-8 absolute right-5 bottom-0 left-5 h-12 rounded text-lg text-white md:right-0 md:left-0"
            >
              결과보기
            </button>
          </div>
        </section>

        {/* [RIGHT PANEL] 데스크탑 전용 지도 영역 */}
        <section className="bg-gray-1 hidden h-full flex-1 md:block">
          <KakaoMap className="h-full w-full" participants={allParticipants} />
        </section>
      </div>
    </div>
  );
}

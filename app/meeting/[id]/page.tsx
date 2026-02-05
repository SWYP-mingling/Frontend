'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import KakaoMap from '@/components/map/kakaoMap';
import StationSearch from '@/components/meeting/stationSearch';
import { useOpenModal } from '@/hooks/useOpenModal';
import { useParams, useRouter } from 'next/navigation';
import { useSetDeparture } from '@/hooks/api/mutation/useSetDeparture';
import { useCheckMeeting } from '@/hooks/api/query/useCheckMeeting';
import StationDataRaw from '@/database/stations_info.json';
import { getRandomHexColor } from '@/lib/color';
import MeetingInfoSection from '@/components/meeting/MeetingInfoSection';

interface StationInfo {
  line: string;
  name: string;
  latitude: number;
  longitude: number;
}

const STATION_DATA = StationDataRaw as StationInfo[];

export default function Page() {
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  const params = useParams();
  const id = params?.id as string;

  const openModal = useOpenModal();
  const router = useRouter();

  const [myName] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('userId') || sessionStorage.getItem('userId') || '';
  });

  // ⭐ 로그인 정보 없으면 join으로 리다이렉트
  useEffect(() => {
    if (!myName && id) {
      console.log('❌ 로그인 정보 없음 - /join으로 리다이렉트');
      router.replace(`/join/${id}`);
    }
  }, [myName, id, router]);

  const { data: meetingData, error, isError } = useCheckMeeting(id);
  const { mutate: setDeparture } = useSetDeparture(id);

  // ⭐ API 에러 처리 - 한 번만 실행되도록 ref 사용
  const [hasHandledError, setHasHandledError] = useState(false);

  useEffect(() => {
    if (isError && error && !hasHandledError) {
      console.error('세션 만료 또는 권한 없음:', error);

      // 스토리지 클리어
      localStorage.removeItem('userId');
      sessionStorage.removeItem('userId');

      // 에러 처리 완료 표시
      setHasHandledError(true);

      // join으로 리다이렉트
      router.replace(`/join/${id}`);
    }
  }, [isError, error, hasHandledError, id, router]);

  // ⭐ 로그인 정보 없으면 로딩 화면 표시
  if (!myName) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
      </div>
    );
  }

  const handleShareClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    openModal('SHARE', { meetingId: id }, e);
  };

  const handleSelectStation = (stationName: string | null) => {
    setSelectedStation(stationName);

    if (!stationName) return;

    const stationInfo = STATION_DATA.find((s) => s.name === stationName);

    if (stationInfo) {
      setDeparture({
        departure: stationInfo.name,
      });
    } else {
      console.error('역 정보를 찾을 수 없습니다.');
    }
  };

  useEffect(() => {
    if (meetingData?.data?.participants && myName) {
      const myData = meetingData.data.participants.find((p) => p.userName === myName);

      if (myData?.stationName && !selectedStation) {
        setSelectedStation(myData.stationName);
      }
    }
  }, [meetingData, myName, selectedStation]);

  const myParticipant = useMemo(() => {
    if (!selectedStation) return null;

    const info = STATION_DATA.find((s) => s.name === selectedStation);
    if (!info) return null;

    return {
      id: 'me',
      name: myName || '나',
      station: info.name,
      line: info.line,
      latitude: info.latitude,
      longitude: info.longitude,
      status: 'done',
      hexColor: '#000000',
    };
  }, [selectedStation, myName]);

  const allParticipants = useMemo(() => {
    const serverParticipants = meetingData?.data.participants || [];

    const others = serverParticipants
      .filter((p) => p.userName !== myName)
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

    return myParticipant ? [myParticipant, ...others] : others;
  }, [meetingData, myParticipant, myName]);

  const handleSubmit = () => {
    if (!selectedStation) {
      alert('출발지를 먼저 선택해주세요!');
      return;
    }
    router.push(`/result/${id}`);
  };

  return (
    <div className="flex items-center justify-center p-0 md:min-h-[calc(100vh-200px)] md:py-25">
      <div className="flex h-full w-full flex-col bg-white md:h-175 md:w-174 md:flex-row md:gap-4 md:rounded-xl lg:w-215">
        <section className="border-gray-1 flex w-full flex-col gap-5 bg-white md:w-77.5 md:gap-10">
          {meetingData?.data && (
            <MeetingInfoSection
              deadline={meetingData.data.deadlineAt}
              totalCapacity={meetingData.data.totalParticipantCount}
              currentParticipants={meetingData.data.currentParticipantCount}
              isDeadlineFlexible={false}
              isParticipantUndecided={false}
              onShare={handleShareClick}
            />
          )}

          <KakaoMap
            className="bg-gray-1 relative block aspect-video h-93.5 md:hidden"
            participants={allParticipants}
          />

          <StationSearch
            stations={STATION_DATA}
            selectedStation={selectedStation}
            onSelect={handleSelectStation}
          />

          <div className="bg-gray-1 relative h-1 w-full md:hidden"></div>

          <div className="relative flex flex-1 flex-col gap-3 overflow-hidden px-5 md:gap-3.5 md:p-0">
            <div className="flex items-center justify-between bg-white">
              <h3 className="text-gray-9 text-xl font-semibold">참여현황</h3>
              <span className="text-gray-6 text-normal text-xs">
                <span className="text-blue-5">{meetingData?.data.currentParticipantCount}명</span>이
                참여 중
              </span>
            </div>

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

            <div className="mb-10 flex-1">
              <div className="[&::-webkit-scrollbar-thumb]:bg-gray-6 flex h-80 flex-col gap-3.5 overflow-y-scroll pr-2 pb-5 md:pb-18 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full">
                {allParticipants.map((user) => (
                  <div
                    key={user.id}
                    className={`flex h-17 shrink-0 items-center justify-between rounded border bg-white px-5 ${
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

        <section className="bg-gray-1 hidden h-full flex-1 md:block">
          <KakaoMap className="h-full w-full" participants={allParticipants} />
        </section>
      </div>
    </div>
  );
}

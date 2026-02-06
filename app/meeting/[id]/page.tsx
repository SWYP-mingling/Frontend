'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
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
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/ui/toast';
import { getMeetingUserId, removeMeetingUserId } from '@/lib/storage';

interface StationInfo {
  line: string;
  name: string;
  latitude: number;
  longitude: number;
}

const STATION_DATA = StationDataRaw as StationInfo[];

export default function Page() {
  // [1] State 및 Hook 선언 (순서 고정)
  const [isMounted, setIsMounted] = useState(false);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [myName, setMyName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');

  // 에러 처리용 Ref (렌더링 방지)
  const hasHandledErrorRef = useRef(false);

  const params = useParams();
  const id = params?.id as string;

  const openModal = useOpenModal();
  const router = useRouter();
  const { isVisible, show } = useToast();

  // API Hooks
  const { data: meetingData, error, isError, isLoading } = useCheckMeeting(id);
  const { mutate: setDeparture } = useSetDeparture(id);

  // [2] 초기화 Effect (ESLint 경고 방지용 setTimeout)
  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
      // 클라이언트 마운트 후 스토리지 접근
      const storedName = getMeetingUserId(id) || '';
      setMyName(storedName);
    }, 0);
  }, [id]);

  // [3] 로그인 정보 리다이렉트
  useEffect(() => {
    if (isMounted && !myName && id) {
      console.log('❌ 로그인 정보 없음 - /join으로 리다이렉트');
      router.replace(`/join/${id}`);
    }
  }, [isMounted, myName, id, router]);

  // [4] API 에러 처리 (Ref 사용 + Safari 호환성)
  useEffect(() => {
    if (isError && error && !hasHandledErrorRef.current) {
      console.error('세션 만료 또는 권한 없음:', error);

      // 해당 모임의 userId 삭제
      removeMeetingUserId(id);

      // Ref 업데이트 (렌더링 유발 X)
      hasHandledErrorRef.current = true;

      // 강제 이동 (쿠키/스토리지 동기화 보장)
      window.location.href = `/join/${id}`;
    }
  }, [isError, error, id]);

  // [5] Helper Functions
  const handleShareClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    openModal('SHARE', { meetingId: id }, e);
  };

  const handleSelectStation = (stationName: string | null) => {
    setSelectedStation(stationName);

    if (!stationName) return;

    // "역" 중복 방지 로직
    const searchName = stationName.endsWith('역') ? stationName : `${stationName}역`;
    const stationInfo = STATION_DATA.find((s) => s.name === searchName);

    if (stationInfo) {
      setDeparture({
        departure: stationInfo.name,
      });
    } else {
      console.error('역 정보를 찾을 수 없습니다.');
    }
  };

  const handleSubmit = () => {
    if (!selectedStation) {
      setErrorMessage('출발지를 먼저 선택해주세요!');
      show();
      return;
    }
    router.push(`/result/${id}`);
  };

  // [6] 데이터 동기화 Effect (setTimeout 적용)
  useEffect(() => {
    if (meetingData?.data?.participants && myName) {
      const myData = meetingData.data.participants.find((p) => p.userName === myName);

      if (myData?.stationName && !selectedStation) {
        // 렌더링 중 상태 업데이트 경고 해결을 위해 비동기 처리
        setTimeout(() => {
          setSelectedStation(myData.stationName);
        }, 0);
      }
    }
  }, [meetingData, myName, selectedStation]);

  // [7] Memoized Data
  const myParticipant = useMemo(() => {
    if (!selectedStation || !myName) return null;

    const correctStationName = selectedStation.endsWith('역')
      ? selectedStation
      : `${selectedStation}역`;
    const info = STATION_DATA.find((s) => s.name === correctStationName);
    if (!info) return null;

    return {
      id: 'me',
      name: myName,
      station: info.name,
      line: info.line,
      latitude: info.latitude,
      longitude: info.longitude,
      status: 'done',
      hexColor: '#000000',
    };
  }, [selectedStation, myName]);

  const allParticipants = useMemo(() => {
    if (!myName) return [];

    const serverParticipants = meetingData?.data.participants || [];

    const others = serverParticipants
      .filter((p) => p.userName !== myName)
      .map((p, index) => {
        // 역 이름 포맷팅
        const displayStationName = p.stationName
          ? p.stationName.endsWith('역')
            ? p.stationName
            : `${p.stationName}역`
          : '';

        const stationInfo = STATION_DATA.find((s) => s.name === displayStationName);

        return {
          id: `other-${index}`,
          name: p.userName,
          station: displayStationName,
          line: stationInfo?.line ?? '미확인',
          latitude: p.latitude,
          longitude: p.longitude,
          status: 'done',
          hexColor: getRandomHexColor(p.userName || p.stationName || `user-${index}`),
        };
      });

    return myParticipant ? [myParticipant, ...others] : others;
  }, [meetingData, myParticipant, myName]);

  // [8] 로딩 화면 처리 (Hook 호출 이후, JSX 리턴 직전)
  if (!isMounted || !myName) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
      </div>
    );
  }

  // 메인 UI
  return (
    <div className="flex items-center justify-center p-0 md:min-h-[calc(100vh-200px)] md:py-25">
      <div className="flex h-full w-full flex-col bg-white md:h-175 md:w-174 md:flex-row md:gap-4 md:rounded-xl lg:w-215">
        <section className="border-gray-1 flex w-full flex-col gap-5 bg-white md:w-77.5 md:gap-10">
          {isLoading && (
            <div className="flex h-20 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
            </div>
          )}

          {meetingData?.data ? (
            <MeetingInfoSection
              deadline={meetingData.data.deadlineAt}
              totalCapacity={meetingData.data.totalParticipantCount}
              currentParticipants={meetingData.data.currentParticipantCount}
              isDeadlineFlexible={false}
              isParticipantUndecided={false}
              onShare={handleShareClick}
            />
          ) : (
            !isLoading && (
              <div className="text-center text-gray-500">모임 정보를 불러올 수 없습니다.</div>
            )
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
                <span className="text-blue-5">
                  {meetingData?.data.currentParticipantCount || 0}명
                </span>
                이 참여 중
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
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-gray-8 text-[15px]">{user.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="bg-gray-8 absolute right-5 bottom-0 left-5 h-12 cursor-pointer rounded text-lg text-white md:right-0 md:left-0"
            >
              결과보기
            </button>
            <Toast message={errorMessage} isVisible={isVisible} />
          </div>
        </section>

        <section className="bg-gray-1 hidden h-full flex-1 md:block">
          <KakaoMap className="h-full w-full" participants={allParticipants} />
        </section>
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import KakaoMap from '@/components/map/kakaoMap';
import StationSearch from '@/components/meeting/stationSearch';
import { useOpenModal } from '@/hooks/useOpenModal';
import { useParams, useRouter } from 'next/navigation';
import { useSetDeparture } from '@/hooks/api/mutation/useSetDeparture';
import { useDeleteDeparture } from '@/hooks/api/mutation/useDeleteDeparture';
import { useCheckMeeting } from '@/hooks/api/query/useCheckMeeting';
import StationDataRaw from '@/database/stations_info.json';
import { getRandomHexColor } from '@/lib/color';
import MeetingInfoSection from '@/components/meeting/MeetingInfoSection';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/ui/toast';
import { getMeetingUserId, removeMeetingUserId } from '@/lib/storage';
import { sendGAEvent } from '@next/third-parties/google';

interface StationInfo {
  line: string;
  name: string;
  latitude: number;
  longitude: number;
}

const STATION_DATA = StationDataRaw as StationInfo[];

export default function Page() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [myName, setMyName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');

  const hasHandledErrorRef = useRef(false);
  const isDeletingRef = useRef(false);
  const hasInitializedRef = useRef(false);

  const params = useParams();
  const id = params?.id as string;

  const openModal = useOpenModal();
  const router = useRouter();
  const { isVisible, show } = useToast();

  const { data: meetingData, error, isError, isLoading, refetch } = useCheckMeeting(id);
  const { mutate: setDeparture } = useSetDeparture(id);
  const { mutate: deleteDeparture } = useDeleteDeparture(id);

  const currentCount = meetingData?.data?.currentParticipantCount || 0;
  const totalCount = meetingData?.data?.totalParticipantCount || 0;
  const isResultEnabled = totalCount > 0 && currentCount === totalCount;

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
      const storedName = getMeetingUserId(id) || '';
      setMyName(storedName);
    }, 0);
  }, [id]);

  useEffect(() => {
    if (isMounted && !myName && id) {
      router.replace(`/join/${id}`);
    }
  }, [isMounted, myName, id, router]);

  useEffect(() => {
    if (isError && error && !hasHandledErrorRef.current) {
      console.error('세션 만료 또는 권한 없음:', error);
      removeMeetingUserId(id);
      hasHandledErrorRef.current = true;
      window.location.href = `/join/${id}`;
    }
  }, [isError, error, id]);

  // GA4 전송 전용 도우미 함수
  const trackShareEvent = () => {
    if (typeof window !== 'undefined') {
      let browserId = localStorage.getItem('browser_id');
      if (!browserId) {
        browserId = `bid_${Math.random().toString(36).substring(2, 15)}${Date.now().toString(36)}`;
        localStorage.setItem('browser_id', browserId);
      }

      sendGAEvent('event', 'share_link', {
        meeting_url_id: id,
        location: 'creation_complete',
        browser_id: browserId,
      });
    }
  };

  // 공유하기 버튼 전용 핸들러
  const handleShareClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    openModal('SHARE', { meetingId: id }, e);
    trackShareEvent();
  };

  // 재촉하기 버튼 전용 핸들러
  const handleNudgeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    openModal('NUDGE', { meetingId: id }, e);
    trackShareEvent();
  };

  const handleSelectStation = (stationName: string | null) => {
    if (stationName === null) {
      isDeletingRef.current = true;
      setSelectedStation(null);

      deleteDeparture(undefined, {
        onSuccess: () => {
          refetch().then(() => {
            isDeletingRef.current = false;
          });
        },
        onError: () => {
          setErrorMessage('출발지 삭제에 실패했습니다.');
          show();
          isDeletingRef.current = false;
        },
      });
      return;
    }

    setSelectedStation(stationName);

    const stationInfo = STATION_DATA.find((s) => s.name === stationName);

    if (stationInfo) {
      setDeparture(
        {
          departure: stationInfo.name,
        },
        {
          onSuccess: () => {
            refetch();
          },
          onError: () => {
            setErrorMessage('출발지 등록에 실패했습니다.');
            show();
          },
        }
      );
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

  useEffect(() => {
    if (
      meetingData?.data?.participants &&
      myName &&
      !isDeletingRef.current &&
      !hasInitializedRef.current
    ) {
      const myData = meetingData.data.participants.find((p) => p.userName === myName);

      if (myData?.stationName) {
        setTimeout(() => {
          setSelectedStation(myData.stationName);
          hasInitializedRef.current = true;
        }, 0);
      } else {
        hasInitializedRef.current = true;
      }
    }
  }, [meetingData, myName]);

  const allParticipants = useMemo(() => {
    if (!myName) return [];

    const serverParticipants = meetingData?.data.participants || [];

    const participantsWithColor = serverParticipants.map((p, index) => {
      const stationInfo = STATION_DATA.find((s) => s.name === p.stationName);

      return {
        id: p.userName === myName ? 'me' : `other-${index}`,
        name: p.userName,
        station: p.stationName,
        line: stationInfo?.line ?? '미확인',
        latitude: p.latitude,
        longitude: p.longitude,
        status: 'done',
        hexColor: getRandomHexColor(p.userName, id),
      };
    });

    const myParticipant = participantsWithColor.find((p) => p.name === myName);
    const others = participantsWithColor.filter((p) => p.name !== myName);

    if (myParticipant && selectedStation) {
      const info = STATION_DATA.find((s) => s.name === selectedStation);
      if (info) {
        myParticipant.station = info.name;
        myParticipant.line = info.line;
        myParticipant.latitude = info.latitude;
        myParticipant.longitude = info.longitude;
      }
    }

    return myParticipant ? [myParticipant, ...others] : others;
  }, [meetingData, selectedStation, myName, id]);

  if (!isMounted || !myName) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="border-t-blue-5 h-8 w-8 animate-spin rounded-full border-4 border-gray-200" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-0 md:min-h-[calc(100vh-200px)] md:py-25">
      <div className="flex h-full w-full flex-col bg-white md:h-175 md:w-174 md:flex-row md:gap-4 md:rounded-xl lg:w-215">
        <section className="border-gray-1 flex w-full flex-col gap-5 bg-white md:w-77.5 md:gap-10">
          {isLoading && (
            <div className="flex h-20 items-center justify-center">
              <div className="border-t-blue-5 border-gray-2 h-6 w-6 animate-spin rounded-full border-4" />
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
              <div className="text-gray-6 text-center">모임 정보를 불러올 수 없습니다.</div>
            )
          )}

          <KakaoMap
            className="bg-gray-1 relative block h-93.5 md:hidden"
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
              <h3 className="text-gray-9 text-[22px] font-semibold">참여현황</h3>
              <span className="text-gray-6 text-normal text-xs">
                <span className="text-blue-5">{currentCount}</span>
                <span> / {totalCount}</span>
              </span>
            </div>

            <button
              type="button"
              className="bg-blue-5 hover:bg-blue-8 flex h-21 w-full cursor-pointer items-center justify-between rounded p-4 text-left text-white transition-transform active:scale-[0.98]"
              onClick={handleNudgeClick}
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

            <div className="flex-1">
              <div className="[&::-webkit-scrollbar-thumb]:bg-gray-6 flex h-80 flex-col gap-3.5 overflow-y-scroll pb-5 md:pb-38 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full">
                {allParticipants.length > 0 ? (
                  allParticipants.map((user) => (
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
                          style={{ backgroundColor: user.hexColor }}
                        >
                          {user.name.charAt(0)}
                        </div>
                        <span className="text-gray-8 text-[15px]">{user.name}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-5 flex h-20 items-center justify-center text-sm">
                    아직 참여한 인원이 없습니다.
                  </div>
                )}
              </div>
            </div>

            <div className="group relative mb-10 md:absolute md:right-0 md:bottom-0 md:left-0 md:mb-0">
              {!isResultEnabled && (
                <div className="bg-gray-9 absolute bottom-full left-1/2 mb-2 hidden w-max -translate-x-1/2 rounded px-3 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:block group-hover:opacity-100">
                  모든 팀원이 참여해야 결과를 확인할 수 있어요
                  <div className="border-t-gray-9 absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"></div>
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={!isResultEnabled}
                className={`h-12 w-full rounded text-lg font-semibold text-white transition-colors ${
                  isResultEnabled ? 'bg-gray-8 cursor-pointer' : 'bg-gray-4 cursor-not-allowed'
                }`}
              >
                결과보기
              </button>
            </div>
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

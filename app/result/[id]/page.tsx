'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useOpenModal } from '@/hooks/useOpenModal';
import { useParams, useRouter } from 'next/navigation';
import KakaoMapLine from '@/components/map/kakaoMapLine';
import { useMidpoint } from '@/hooks/api/query/useMidpoint';
import { useCheckMeeting } from '@/hooks/api/query/useCheckMeeting';
import { getMeetingUserId } from '@/lib/storage';
import { useQueryClient } from '@tanstack/react-query';
import Loading from '@/components/loading/loading';
import { getRandomHexColor } from '@/lib/color';
import { sendGAEvent } from '@next/third-parties/google';

export default function Page() {
  const queryClient = useQueryClient();
  const openModal = useOpenModal();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [myNickname] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return getMeetingUserId(id) || '';
  });

  // 로컬스토리지에서 가져온 카테고리 값을 저장할 State
  const [localCategory, setLocalCategory] = useState<string>('');

  const { data: midpointData, isLoading, isError } = useMidpoint(id);
  const { data: meetingData } = useCheckMeeting(id);

  // 컴포넌트 마운트 시 로컬스토리지 값 가져오기 (Hydration 에러 방지)
  useEffect(() => {
    if (typeof window !== 'undefined' && id) {
      const storedCategory = localStorage.getItem(`meeting_${id}_category`);
      if (storedCategory) {
        setLocalCategory(storedCategory);
      }
    }
  }, [id]);

  const locationResults = useMemo(() => {
    if (!midpointData?.success || !midpointData.data || !Array.isArray(midpointData.data)) {
      return [];
    }

    return midpointData.data.map((midpoint, index) => {
      const { endStation, endStationLine, userRoutes, hot } = midpoint;

      const routesWithColor = userRoutes.map((route) => {
        return {
          ...route,
          hexColor: getRandomHexColor(route.nickname, id),
        };
      });

      const myRoute = routesWithColor.find((route) => route.nickname === myNickname);
      const travelTime = myRoute?.travelTime || 0;

      const totalTravelTime = routesWithColor.reduce(
        (sum, route) => sum + (route.travelTime || 0),
        0
      );
      const averageTravelTime =
        routesWithColor.length > 0 ? Math.round(totalTravelTime / routesWithColor.length) : 0;

      const extractLineNumber = (linenumber: string): string => {
        if (!linenumber) return '';
        const cleaned = linenumber.replace('호선', '').trim();
        const hasNumber = /\d/.test(cleaned);
        if (hasNumber) {
          return cleaned.replace(/\D/g, '');
        } else {
          return cleaned.charAt(0);
        }
      };

      const transferPathLines: Array<{ display: string; text: string }> = [];

      if (
        myRoute?.transferPath &&
        Array.isArray(myRoute.transferPath) &&
        myRoute.transferPath.length > 0
      ) {
        for (const path of myRoute.transferPath) {
          if (path?.linenumber) {
            const lineNumber = extractLineNumber(path.linenumber);
            if (lineNumber) {
              transferPathLines.push({
                display: lineNumber,
                text: path.linenumber,
              });
            }
          }
        }
      }

      if (endStationLine) {
        const endLineNumber = extractLineNumber(endStationLine);
        if (endLineNumber) {
          const lastLine = transferPathLines[transferPathLines.length - 1];
          if (lastLine?.display !== endLineNumber) {
            transferPathLines.push({
              display: endLineNumber,
              text: endStationLine,
            });
          }
        }
      }

      return {
        id: index + 1,
        endStation,
        endStationLine,
        latitude: midpoint.latitude,
        longitude: midpoint.longitude,
        travelTime,
        averageTravelTime,
        transferPath: myRoute?.transferPath || [],
        transferPathLines,
        userRoutes: routesWithColor,
        hot,
      };
    });
  }, [midpointData, myNickname, id]);

  // 카테고리 텍스트 생성 함수 업데이트
  const getCategoryText = (
    apiCategory: string | undefined,
    hot: boolean | undefined, // hot 파라미터를 안 쓰게 되더라도 시그니처 유지를 위해 둠
    rank: number
  ): string => {
    // 밍글링 추천 문구가 들어가는 1위, 2위는 "OO이 많은 장소" 텍스트를 완전히 생략합니다.
    if (rank === 1) {
      return '밍글링 추천 1위';
    } else if (rank === 2) {
      return '밍글링 추천 2위';
    }

    // 3위 등 밍글링 추천이 안 붙는 경우에만 로컬스토리지 값 활용하여 "OO이/가 많은 장소" 표시
    const purposeText = localCategory || apiCategory || '모임 목적';
    const lastChar = purposeText.charCodeAt(purposeText.length - 1);
    const hasJongseong = (lastChar - 0xac00) % 28 !== 0;

    return `${purposeText}${hasJongseong ? '이' : '가'} 많은 장소`;
  };

  const [selectedResultId, setSelectedResultId] = useState<number>(1);

  // 중간지점 후보 조회 GA 이벤트
  const trackMidpointCandidateViewed = useCallback(
    (candidateRankOrder: number, candidateId: string) => {
      if (typeof window === 'undefined' || !id) return;
      const browserId = localStorage.getItem('browser_id');
      const isHost = localStorage.getItem(`is_host_${id}`) === 'true';
      const userRole = isHost ? 'host' : 'participant';

      sendGAEvent('event', 'midpoint_candidate_viewed', {
        meeting_url_id: id,
        user_cookie_id: browserId,
        role: userRole,
        candidate_rank_order: candidateRankOrder,
        candidate_id: candidateId,
      });
    },
    [id]
  );

  // 장소 리스트에서 결과보기 페이지로 돌아왔을 때 midpoint_candidate_viewed 전송
  useEffect(() => {
    if (typeof window === 'undefined' || !id || locationResults.length === 0) return;
    const fromRecommend = sessionStorage.getItem(`from_recommend_${id}`);
    if (fromRecommend !== '1') return;

    sessionStorage.removeItem(`from_recommend_${id}`);
    const selected = locationResults.find((r) => r.id === selectedResultId) ?? locationResults[0];
    const candidateId = `mid_${selected.endStation.replace(/\s+/g, '_')}`;
    trackMidpointCandidateViewed(selected.id, candidateId);
  }, [id, locationResults, selectedResultId, trackMidpointCandidateViewed]);

  // 뒤로 가기 클릭 시 캐시 데이터 무효화
  const clearRelatedCache = useCallback(() => {
    queryClient.removeQueries({ queryKey: ['midpoint', id] });
    queryClient.removeQueries({ queryKey: ['recommend', id] });
  }, [id, queryClient]);

  const handleModifyStart = () => {
    clearRelatedCache();
    router.replace(`/meeting/${id}`);
  };

  const handleResultShareClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 1. GA 데이터 먼저 전송!
    if (typeof window !== 'undefined') {
      let browserId = localStorage.getItem('browser_id');
      if (!browserId) {
        browserId = `bid_${Math.random().toString(36).substring(2, 15)}${Date.now().toString(36)}`;
        localStorage.setItem('browser_id', browserId);
      }

      sendGAEvent('event', 'share_link', {
        meeting_url_id: id,
        location: 'place_list', // PM님 명세: 결과 리스트 페이지
        browser_id: browserId,
      });
    }

    // 2. 안전하게 전송 후 모달 띄우기
    openModal('SHARE', { meetingId: id }, e);
  };

  useEffect(() => {
    clearRelatedCache();

    return () => clearRelatedCache();
  }, [clearRelatedCache]);

  return (
    <div className="flex items-center justify-center p-0 md:min-h-[calc(100vh-200px)] md:py-20">
      <div className="flex h-full w-full flex-col bg-white md:h-175 md:w-174 md:flex-row md:gap-4 lg:w-215">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loading />
          </div>
        ) : (
          <>
            <section className="border-gray-1 flex w-full flex-col gap-5 bg-white md:w-77.5 md:gap-3">
              <div className="px-5 pt-5 md:p-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleModifyStart}
                    className="flex items-center justify-center"
                    type="button"
                  >
                    <Image src="/icon/left_chevron.svg" alt="뒤로가기" width={24} height={24} />
                  </button>
                  <div className="text-gray-9 text-[22px] font-semibold tracking-[-1.94%]">
                    최종 위치 결과 Top3
                  </div>
                </div>
              </div>

              {locationResults.length > 0 &&
                (() => {
                  const selectedResult =
                    locationResults.find((r) => r.id === selectedResultId) || locationResults[0];
                  return (
                    <div className="relative h-93.5 w-full max-w-[100vw] overflow-hidden md:hidden">
                      <KakaoMapLine
                        className="bg-gray-1 relative block h-93.5 md:hidden"
                        endStation={{
                          name: selectedResult.endStation,
                          latitude: selectedResult.latitude,
                          longitude: selectedResult.longitude,
                        }}
                        userRoutes={selectedResult.userRoutes}
                        meetingId={id}
                        purposes={meetingData?.data?.purposes}
                      />
                    </div>
                  );
                })()}

              <div className="relative mb-10 flex flex-1 flex-col gap-3 px-5 md:mb-0 md:p-0">
                <div className="mb-15 flex-1 overflow-auto">
                  <div className="flex h-125 min-h-0 flex-col gap-3 pr-1">
                    {isError || locationResults.length === 0 ? (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-gray-6 text-sm">
                          {isError ? '데이터를 불러오는데 실패했습니다.' : '결과가 없습니다.'}
                        </span>
                      </div>
                    ) : (
                      locationResults.map((result) => {
                        const category =
                          meetingData?.data?.purposes?.[meetingData.data.purposes.length - 1];
                        const categoryText = getCategoryText(category, result.hot, result.id);

                        const handleRecommendClick = (e: React.MouseEvent) => {
                          e.stopPropagation();
                          if (!id || !result.endStation) return;

                          let meetingType = '';
                          let categoryParam = '';

                          if (typeof window !== 'undefined') {
                            meetingType = localStorage.getItem(`meeting_${id}_meetingType`) || '';
                            categoryParam = localStorage.getItem(`meeting_${id}_category`) || '';
                          }

                          if (
                            !meetingType &&
                            meetingData?.data?.purposes &&
                            meetingData.data.purposes.length > 0
                          ) {
                            meetingType = meetingData.data.purposes[0];
                          }
                          if (!categoryParam && category) {
                            categoryParam = category;
                          }

                          const params = new URLSearchParams({
                            meetingId: id,
                            midPlace: result.endStation,
                            lat: result.latitude.toString(),
                            lng: result.longitude.toString(),
                          });

                          if (meetingType) params.append('meetingType', meetingType);
                          if (categoryParam) params.append('category', categoryParam);

                          if (typeof window !== 'undefined') {
                            sessionStorage.setItem(`from_recommend_${id}`, '1');
                          }
                          router.push(`/recommend?${params.toString()}`);
                        };

                        return (
                          <div
                            key={result.id}
                            onClick={() => {
                              setSelectedResultId(result.id);
                              const candidateId = `mid_${result.endStation.replace(/\s+/g, '_')}`;
                              trackMidpointCandidateViewed(result.id, candidateId);
                            }}
                            className={`flex cursor-pointer flex-col gap-3.75 rounded border bg-white p-5 ${
                              selectedResultId === result.id
                                ? 'border-blue-5 border-2'
                                : 'border-gray-2 hover:bg-gray-1'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <Image src="/icon/stars.svg" alt="stars" width={16} height={16} />
                              <span className="text-blue-5 text-sm font-medium">
                                {categoryText}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-gray-10 text-xl font-bold">
                                {result.endStation}역
                              </span>
                              <div className="flex flex-col items-end">
                                <span className="text-gray-6 text-[13px] font-normal">
                                  평균 이동시간{' '}
                                  <span className="text-blue-5 text-[18px] font-bold">
                                    {result.averageTravelTime}분
                                  </span>
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={handleRecommendClick}
                                className="bg-gray-8 hover:bg-gray-9 h-10 flex-1 cursor-pointer rounded text-[15px] font-normal text-white transition-colors"
                                type="button"
                              >
                                주변 장소 추천
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(
                                    'TRANSFER',
                                    {
                                      meetingId: id,
                                      userRoutes: result.userRoutes,
                                      endStation: result.endStation,
                                    },
                                    e
                                  );
                                }}
                                className="bg-gray-1 hover:bg-gray-2 text-blue-5 h-10 flex-1 cursor-pointer rounded text-[15px] font-normal transition-colors"
                                type="button"
                              >
                                환승 경로 보기
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <button
                  onClick={handleResultShareClick}
                  className="bg-blue-5 hover:bg-blue-8 absolute right-5 bottom-0 left-5 flex h-12 items-center justify-center gap-2.5 rounded text-lg font-semibold text-white transition-transform active:scale-[0.98] md:right-0 md:left-0"
                >
                  <Image src="/icon/share-white.svg" alt="공유 아이콘" width={20} height={20} />
                  결과 공유하기
                </button>
              </div>
            </section>

            <section className="bg-gray-1 hidden h-full flex-1 md:block">
              {locationResults.length > 0 &&
                (() => {
                  const selectedResult =
                    locationResults.find((r) => r.id === selectedResultId) || locationResults[0];
                  return (
                    <KakaoMapLine
                      className="h-full w-full"
                      endStation={{
                        name: selectedResult.endStation,
                        latitude: selectedResult.latitude,
                        longitude: selectedResult.longitude,
                      }}
                      userRoutes={selectedResult.userRoutes}
                      meetingId={id}
                      purposes={meetingData?.data?.purposes}
                    />
                  );
                })()}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

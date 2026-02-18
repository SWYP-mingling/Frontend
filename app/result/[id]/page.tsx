'use client';

import { useState, useMemo } from 'react';
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

  const { data: midpointData, isLoading, isError } = useMidpoint(id);
  const { data: meetingData } = useCheckMeeting(id);

  const locationResults = useMemo(() => {
    if (!midpointData?.success || !midpointData.data || !Array.isArray(midpointData.data)) {
      return [];
    }

    return midpointData.data.map((midpoint, index) => {
      const { endStation, endStationLine, userRoutes } = midpoint;

      const routesWithColor = userRoutes.map((route) => {
        return {
          ...route,
          hexColor: getRandomHexColor(route.nickname, id),
        };
      });

      const myRoute = routesWithColor.find((route) => route.nickname === myNickname);
      const travelTime = myRoute?.travelTime || 0;
      
      
      const totalTravelTime = routesWithColor.reduce((sum, route) => sum + (route.travelTime || 0), 0);
      const averageTravelTime = routesWithColor.length > 0 ? Math.round(totalTravelTime / routesWithColor.length) : 0;

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
      };
    });
  }, [midpointData, myNickname, id]);
  
  // 카테고리 텍스트 생성 함수
  const getCategoryText = (category: string | undefined): string => {
    if (!category) return '밍글링 추천 1위';
    return `${category}이 많은 장소`;
  };

  const [selectedResultId, setSelectedResultId] = useState<number>(1);

  const handleModifyStart = () => {
    queryClient.removeQueries({ queryKey: ['midpoint', id] });
    queryClient.removeQueries({ queryKey: ['recommend', id] });
    router.back();
  };

  const getLineColor = (fullLineName: string) => {
    const cleaned = fullLineName.replace('호선', '').trim();
    if (/^\d+$/.test(cleaned)) {
      switch (cleaned) {
        case '1':
          return 'bg-[#004A85]';
        case '2':
          return 'bg-[#00A23F]';
        case '3':
          return 'bg-[#ED6C00]';
        case '4':
          return 'bg-[#009BCE]';
        case '5':
          return 'bg-[#794698]';
        case '6':
          return 'bg-[#7C4932]';
        case '7':
          return 'bg-[#6E7E31]';
        case '8':
          return 'bg-[#D11D70]';
        case '9':
          return 'bg-[#A49D87]';
        default:
          return 'bg-gray-400';
      }
    }
    switch (fullLineName) {
      case '우이신설선':
        return 'bg-[#B0CE18]';
      case '신림선':
        return 'bg-[#5E7DBB]';
      case '의정부경전철':
        return 'bg-[#F0831E]';
      case '용인에버라인':
        return 'bg-[#44A436]';
      case '인천2호선':
        return 'bg-[#F4A462]';
      case '김포골드라인':
        return 'bg-[#F4A462]';
      case '경의선':
      case '경의중앙선':
        return 'bg-[#6AC2B3]';
      case '수인분당선':
        return 'bg-[#ECA300]';
      case '신분당선':
        return 'bg-[#B81B30]';
      case '인천1호선':
        return 'bg-[#B4C7E7]';
      case '공항철도':
        return 'bg-[#0079AC]';
      case '경춘선':
        return 'bg-[#007A62]';
      case '경강산':
        return 'bg-[#0B318F]';
      case '서해선':
        return 'bg-[#5EAC41]';
      default:
        return 'bg-gray-400';
    }
  };

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
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center"
                    type="button"
                  >
                    <Image src="/icon/left_chevron.svg" alt="뒤로가기" width={24} height={24} />
                  </button>
                  <div className="text-gray-9 text-[22px] font-semibold tracking-[-1.94%]">
                    최종 위치 결과 Top3
                  </div>
                  <button
                    className="text-blue-5 bg-blue-1 hover:bg-blue-2 flex h-7 cursor-pointer items-center gap-1 rounded px-2.5 text-[11px] font-semibold transition-colors"
                    type="button"
                    onClick={(e) => openModal('SHARE', { meetingId: id }, e)}
                  >
                    <Image src="/icon/share.svg" alt="공유 아이콘" width={12} height={12} />
                    결과 공유하기
                  </button>
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
                        const category = meetingData?.data?.purposes?.[meetingData.data.purposes.length - 1];
                        const categoryText = getCategoryText(category);
                        
                        const handleRecommendClick = (e: React.MouseEvent) => {
                          e.stopPropagation();
                          if (!id || !result.endStation) return;
                          
                          let meetingType = '';
                          let categoryParam = '';
                          
                          if (typeof window !== 'undefined') {
                            meetingType = localStorage.getItem(`meeting_${id}_meetingType`) || '';
                            categoryParam = localStorage.getItem(`meeting_${id}_category`) || '';
                          }
                          
                          if (!meetingType && meetingData?.data?.purposes && meetingData.data.purposes.length > 0) {
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
                          
                          router.push(`/recommend?${params.toString()}`);
                        };
                        
                        return (
                          <div
                            key={result.id}
                            onClick={() => setSelectedResultId(result.id)}
                            className={`flex cursor-pointer flex-col gap-3.75 rounded-[4px] border bg-white p-5 ${
                              selectedResultId === result.id
                                ? 'border-blue-5 border-2'
                                : 'border-gray-2 hover:bg-gray-1'
                            }`}
                          >
                           
                            <div className="flex items-center gap-1.5">
                             <Image src='/icon/stars.svg' alt='stars' width={16} height={16} />
                              <span className="text-blue-5 text-sm font-medium">{categoryText}</span>
                            </div>
                            
                           
                            <div className="flex items-center justify-between">
                              <span className="text-gray-10 text-xl font-bold">
                                {result.endStation}역
                              </span>
                              <div className="flex flex-col items-end ">
                                <span className="text-gray-6 text-[13px] font-regular">
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
                                className="bg-gray-8 hover:bg-gray-9 flex-1 h-10 cursor-pointer rounded-[4px] text-[15px] font-normal text-white transition-colors"
                                type="button"
                              >
                                주변 장소 추천
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(
                                    'TRANSFER',
                                    { meetingId: id,
                                      userRoutes: result.userRoutes,
                                      endStation: result.endStation,
                                    },
                                    e
                                  );
                                }}
                                className="bg-gray-1 hover:bg-gray-2 flex-1 h-10 cursor-pointer rounded-[4px] text-[15px] font-normal text-blue-5 transition-colors"
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
                  onClick={handleModifyStart}
                  className="bg-blue-5 hover:bg-blue-8 absolute right-5 bottom-0 left-5 h-12 rounded text-lg font-semibold text-white transition-transform active:scale-[0.98] md:right-0 md:left-0"
                >
                  내 출발지 수정하기
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

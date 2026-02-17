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
        transferPath: myRoute?.transferPath || [],
        transferPathLines,
        userRoutes: routesWithColor,
      };
    });
  }, [midpointData, myNickname, id]);

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
                  <div className="text-gray-9 text-[22px] font-semibold tracking-[-1.94%]">
                    최종 위치 결과 Top 3
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
                      locationResults.map((result) => (
                        <div
                          key={result.id}
                          onClick={() => setSelectedResultId(result.id)}
                          className={`flex cursor-pointer flex-col gap-3.75 rounded border bg-white p-5 ${
                            selectedResultId === result.id
                              ? 'border-blue-5 border-2'
                              : 'border-gray-2 hover:bg-gray-1'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-gray-10 text-lg font-semibold">
                              {result.endStation}역
                            </span>
                            <span className="text-gray-6 text-[13px] font-normal">
                              이동시간
                              <span className="text-blue-5 ml-1.75 text-lg font-semibold">
                                {result.travelTime}분
                              </span>
                            </span>
                          </div>

                          <div className="text-gray-6 flex items-center gap-3 text-[13px]">
                            <span>내 환승경로</span>
                          </div>
                          <div className="flex items-center">
                            {result.transferPathLines.map(
                              (line: { display: string; text: string }, idx: number) => (
                                <div key={idx} className="flex items-center">
                                  <span
                                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] text-white ${getLineColor(line.text)}`}
                                  >
                                    {line.display}
                                  </span>
                                  <span className="text-gray-10 ml-1 text-sm font-semibold">
                                    {line.text}
                                  </span>
                                  {idx < result.transferPathLines.length - 1 && (
                                    <Image
                                      src="/icon/rightarrow.svg"
                                      alt="화살표"
                                      width={13}
                                      height={22}
                                      className="text-gray-6 mx-1.75 w-auto"
                                    />
                                  )}
                                </div>
                              )
                            )}
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(
                                'TRANSFER',
                                {
                                  userRoutes: result.userRoutes,
                                  endStation: result.endStation,
                                },
                                e
                              );
                            }}
                            className="bg-gray-8 h-8 w-full cursor-pointer rounded py-1 text-[15px] font-normal text-white"
                          >
                            모임원 환승경로 보기
                          </button>
                        </div>
                      ))
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

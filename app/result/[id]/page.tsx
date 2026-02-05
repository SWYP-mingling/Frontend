'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useOpenModal } from '@/hooks/useOpenModal';
import { useParams, useRouter } from 'next/navigation';
import KakaoMapLine from '@/components/map/kakaoMapLine';
import { useMidpoint } from '@/hooks/api/query/useMidpoint';

export default function Page() {
  const openModal = useOpenModal();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  // 현재 사용자 닉네임 가져오기
  const [myNickname] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('userId') || sessionStorage.getItem('userId') || '';
  });

  const { data: midpointData, isLoading, isError } = useMidpoint(id);

  const locationResults = useMemo(() => {
    if (!midpointData?.success || !midpointData.data || !Array.isArray(midpointData.data)) {
      return [];
    }

    return midpointData.data.map((midpoint, index) => {
      const { endStation, endStationLine, userRoutes } = midpoint;

      const myRoute = userRoutes.find((route) => route.nickname === myNickname);
  
      const travelTime = myRoute?.travelTime 

      // 호선 번호 추출 함수 (숫자가 있으면 숫자만, 없으면 앞 글자만)
      const extractLineNumber = (linenumber: string): string => {
        if (!linenumber) return '';
        
        // "호선" 제거
        const cleaned = linenumber.replace('호선', '').trim();
        
        // 숫자가 있는지 확인
        const hasNumber = /\d/.test(cleaned);
        
        if (hasNumber) {
          // 숫자만 추출 (예: "4호선" → "4")
          return cleaned.replace(/\D/g, '');
        } else {
          // 숫자가 없으면 앞 글자만 추출 (예: "수인분당선" → "수")
          return cleaned.charAt(0);
        }
      };

      
      const transferPathLines: Array<{ display: string; text: string }> = [];
      
      if (myRoute?.transferPath && Array.isArray(myRoute.transferPath) && myRoute.transferPath.length > 0) {
        for (const path of myRoute.transferPath) {
          if (path?.linenumber) {
            const lineNumber = extractLineNumber(path.linenumber);
            if (lineNumber) {
              transferPathLines.push({
                display: lineNumber, // 원 안에 표시할 값
                text: path.linenumber, // 텍스트로 표시할 원래 값
              });
            }
          }
        }
      }
      
      
      if (endStationLine) {
        const endLineNumber = extractLineNumber(endStationLine);
        if (endLineNumber) {
          // transferPathLines의 마지막 항목과 비교
          const lastLine = transferPathLines[transferPathLines.length - 1];
          if (lastLine?.display !== endLineNumber) {
            transferPathLines.push({
              display: endLineNumber, // 원 안에 표시할 값
              text: endStationLine, // 텍스트로 표시할 원래 값
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
        userRoutes, 
      };
    });
  }, [midpointData, myNickname]);


  const [selectedResultId, setSelectedResultId] = useState<number>(1);

  const handleModifyStart = () => {
    router.back();
  };

  const getLineColor = (fullLineName: string) => {
    const cleaned = fullLineName.replace('호선', '').trim();
    
    // 숫자 호선 처리 (1~9)
    if (/^\d+$/.test(cleaned)) {
      switch (cleaned) {
        case '1':
          return 'bg-[#004A85]'; // 1호선 파랑
        case '2':
          return 'bg-[#00A23F]'; // 2호선 초록
        case '3':
          return 'bg-[#ED6C00]'; // 3호선 파랑
        case '4':
          return 'bg-[#009BCE]'; // 4호선 파랑
        case '5':
          return 'bg-[#794698]'; // 5호선 보라색
        case '6':
          return 'bg-[#7C4932]'; // 6호선 빨강
        case '7':
          return 'bg-[#6E7E31]'; // 7호선 초록
        case '8':
          return 'bg-[#D11D70]'; // 8호선 빨강
        case '9':
          return 'bg-[#A49D87]'; // 9호선 회색
        default:
          return 'bg-gray-400';
      }
    }
    
    // 전체 호선명으로 처리 (앞 글자가 겹치는 경우 구분)
    switch (fullLineName) {
      // 수도권 도시철도(경전철)
      case '우이신설선':
        return 'bg-[#B0CE18]'; // 우이신설 노랑
      case '신림선':
        return 'bg-[#5E7DBB]'; // 신림선 하늘
      case '의정부경전철':
        return 'bg-[#F0831E]'; // 의정부경전철 주황
      case '용인에버라인':
        return 'bg-[#44A436]'; // 용인에버라인 초록
      case '인천2호선':
        return 'bg-[#F4A462]'; // 인천2호선 살색
      case '김포골드라인':
        return 'bg-[#F4A462]'; // 김포골드라인 금색

      // 수도권 도시철도(중전철)
      case '경의선':
      case '경의중앙선':
        return 'bg-[#6AC2B3]'; // 경의중앙선 민트색
      case '수인분당선':
        return 'bg-[#ECA300]'; // 수인분당선 노란색
      case '신분당선':
        return 'bg-[#B81B30]'; // 신분당선 빨강색
      case '인천1호선':
        return 'bg-[#B4C7E7]'; // 인천1호선 연한 하늘색
      case '공항철도':
        return 'bg-[#0079AC]'; // 공항철도 파랑색

      // 광역철도
      case '경춘선':
        return 'bg-[#007A62]'; // 경춘선 초록
      case '경강산':
        return 'bg-[#0B318F]'; // 경강산 파란
      case '서해선':
        return 'bg-[#5EAC41]'; // 서해선 초록

      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="flex items-center justify-center p-0 md:min-h-[calc(100vh-200px)] md:py-20">
      <div className="flex h-full w-full flex-col bg-white md:h-175 md:w-174 md:flex-row md:gap-4 lg:w-215">
        {/* [LEFT PANEL] 결과 리스트 영역 */}
        <section className="border-gray-1 flex w-full flex-col gap-5 bg-white md:w-77.5 md:gap-3">
          {/* 헤더 섹션 */}
          <div className="px-5 pt-5 md:p-0">
            <div className="flex items-center justify-between">
              <div className="text-gray-9 text-xl font-semibold tracking-[-1.2%]">
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

          {/* 모바일 전용 지도 영역 */}
          <KakaoMapLine className="bg-gray-1 relative block aspect-video h-93.5 md:hidden" />

          {/* 결과 리스트 & 하단 버튼 */}
          <div className="relative mb-10 flex flex-1 flex-col gap-3 px-5 md:mb-0 md:p-0">
            {/* 리스트 스크롤 영역 */}
            <div className="mb-15 flex-1 overflow-auto">
              <div className="flex h-125 min-h-0 flex-col gap-3 pr-1">
                {isLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-gray-6 text-sm">로딩 중...</span>
                  </div>
                ) : isError || locationResults.length === 0 ? (
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
                      {/* 카드 헤더: 역 이름 & 시간 */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-10 text-lg font-semibold">{result.endStation}</span>
                        <span className="text-gray-6 text-[13px] font-normal">
                          이동시간
                          <span className="text-blue-5 ml-1.75 text-lg font-semibold">
                            {result.travelTime}분
                          </span>
                        </span>
                      </div>

                      {/* 환승 경로 (호선 아이콘) */}
                      <div className="text-gray-6 flex items-center gap-3 text-[13px]">
                        <span>내 환승경로</span>
                        </div>
                        <div className="flex items-center">
                          {result.transferPathLines.map((line: { display: string; text: string }, idx: number) => (
                            <div key={idx} className="flex items-center">
                              {/* 호선 원형 아이콘 */}
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
                          ))}
                        </div>
                     

                      {/* 모임원 경로 보기 버튼 (카드 내부) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal('TRANSFER', {
                            userRoutes: result.userRoutes,
                            endStation: result.endStation,
                          }, e);
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

            {/* 하단 버튼: 내 출발지 수정하기 (파란색) */}
            <button
              onClick={handleModifyStart}
              className="bg-blue-5 hover:bg-blue-8 absolute right-5 bottom-0 left-5 h-12 rounded text-lg font-semibold text-white transition-transform active:scale-[0.98] md:right-0 md:left-0"
            >
              내 출발지 수정하기
            </button>
          </div>
        </section>

        {/* [RIGHT PANEL] 데스크탑 지도 영역 */}
        <section className="hidden h-full flex-1 bg-gray-100 md:block">
          {locationResults.length > 0 && (() => {
            const selectedResult = locationResults.find((r) => r.id === selectedResultId) || locationResults[0];
            return (
              <KakaoMapLine
                className="h-full w-full"
                endStation={{
                  name: selectedResult.endStation,
                  latitude: selectedResult.latitude,
                  longitude: selectedResult.longitude,
                }}
                userRoutes={selectedResult.userRoutes}
              />
            );
          })()}
        </section>
      </div>
    </div>
  );
}

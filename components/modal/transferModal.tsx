'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface UserRoute {
  nickname: string;
  startStation: string;
  startStationLine: string;
  latitude: number;
  longitude: number;
  travelTime: number;
  transferPath: Array<{
    linenumber: string;
    station: string;
    latitude: number;
    longitude: number;
  }>;
  stations: Array<{
    linenumber: string;
    station: string;
    latitude: number;
    longitude: number;
  }>;
}

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRoutes?: UserRoute[];
  endStation?: string;
}

export default function TransferModal({
  isOpen,
  onClose,
  userRoutes = [],
  endStation = '',
}: TransferModalProps) {
  // 호선별 색상 반환 함수 (전체 호선명을 받아서 처리)
  const getLineBadgeStyle = (fullLineName: string) => {
    // "호선" 제거
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
        return 'bg-[#6AC2B3]'; // 경의선/경의중앙선 민트색
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

  // stations 배열에서 호선별 경로 추출 함수
  const extractRouteSteps = (route: UserRoute) => {
    const steps: Array<{ linenumber: string; station: string; isLast: boolean }> = [];

    if (!route.stations || route.stations.length === 0) {
      return steps;
    }

    let currentLine = route.stations[0]?.linenumber || '';

    route.stations.forEach((station, index) => {
      if (station.linenumber !== currentLine || index === route.stations.length - 1) {
        if (currentLine) {
          steps.push({
            linenumber: currentLine,
            station: station.station,
            isLast: index === route.stations.length - 1,
          });
        }
        currentLine = station.linenumber;
      }
    });

    if (route.stations.length > 0) {
      const lastStation = route.stations[route.stations.length - 1];
      if (steps.length === 0 || steps[steps.length - 1].station !== lastStation.station) {
        steps.push({
          linenumber: lastStation.linenumber,
          station: lastStation.station,
          isLast: true,
        });
      }
    }

    return steps;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="flex max-h-120 w-80.5 flex-col gap-3 rounded bg-white p-0 py-5 pr-5 pl-6 md:w-89.5"
      >
        {/* 헤더 영역 */}
        <DialogHeader className="gap-6 text-left">
          <DialogTitle className="text-gray-10 text-[22px] font-semibold tracking-[-1.94%]">
            모임원 환승경로 보기
          </DialogTitle>
          <DialogDescription className="text-blue-5 text-[20px] font-semibold tracking-[-1.2%]">
            {endStation ? `${endStation}역 도착` : '도착역'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-[12px] overflow-y-scroll">
          {userRoutes.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-gray-6 text-sm">환승 경로 정보가 없습니다.</span>
            </div>
          ) : (
            userRoutes.map((route, index) => {
              const routeSteps = extractRouteSteps(route);

              return (
                <div
                  key={index}
                  className="border-gray-2 relative flex flex-col rounded-[4px] border bg-white"
                >
                  <div className="border-b-gray-1 mx-5 flex items-center justify-between border-b py-3">
                    <span className="text-gray-7 text-[14px] leading-[1.571] font-semibold tracking-[0.203px]">
                      {route.nickname}
                    </span>
                    <div className="flex items-center gap-[7px]">
                      <span className="text-gray-6 text-[13px] leading-[1.385] font-normal tracking-[0.252px]">
                        이동시간
                      </span>
                      <span className="text-blue-5 text-[18px] leading-[1.445] font-semibold tracking-[-0.0036px]">
                        {route.travelTime}분
                      </span>
                    </div>
                  </div>

                  {/* 하단: 환승 경로 (세로 배치) */}
                  <div className="relative flex gap-4 p-5">
                    <div className="flex flex-col items-center gap-[10px]">
                      {routeSteps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-[10px]">
                          <div
                            className={`flex min-w-[60px] items-center justify-center gap-1 rounded-[5px] px-[7px] py-[2px] text-[13px] leading-[1.385] font-normal tracking-[0.252px] text-white ${getLineBadgeStyle(
                              step.linenumber
                            )}`}
                          >
                            <Image src="/icon/train.svg" alt="train" width={12} height={12} />
                            <span>{step.linenumber}</span>
                          </div>

                          <div className="flex items-center justify-center">
                            <Image src="/icon/down.svg" alt="arrow-down" width={12} height={12} />
                          </div>
                        </div>
                      ))}

                      <div className="bg-gray-8 flex min-w-[60px] items-center justify-center rounded-[5px] px-[7px] py-[2px] text-[13px] leading-[1.385] font-normal tracking-[0.252px] text-white">
                        하차
                      </div>
                    </div>

                    <div className="text-gray-8 flex flex-col gap-[30px] text-[13px] leading-[1.385] font-normal tracking-[0.252px]">
                      {routeSteps.map((step, idx) => (
                        <span key={idx}>{step.station}역</span>
                      ))}

                      <span>{endStation || routeSteps[routeSteps.length - 1]?.station}역</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

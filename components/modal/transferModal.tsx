'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { MOCK_TRANSFER_ROUTES } from '@/mock/mockData';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TransferModal({ isOpen, onClose }: TransferModalProps) {
  // 호선별 뱃지 색상 (필요시 추가)
  const getLineBadgeStyle = (line: string) => {
    switch (line) {
      case '1':
        return 'bg-[#0052A4]'; // 1호선 파랑
      case '2':
        return 'bg-[#3CB44A]'; // 2호선 초록
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="flex max-h-120 w-80.5 flex-col gap-3 rounded bg-white p-0 py-5 pr-5 pl-6 md:w-89.5"
      >
        {/* 헤더 영역 */}
        <DialogHeader className="gap-6 text-left">
          <DialogTitle className="text-gray-10 text-[22px] font-semibold">
            모임원 환승경로 보기
          </DialogTitle>
          <DialogDescription className="text-blue-5 text-xl font-semibold">
            합정역 도착
          </DialogDescription>
        </DialogHeader>

        {/* 리스트 영역 (스크롤) */}
        <div className="flex flex-col gap-3 overflow-y-scroll">
          {MOCK_TRANSFER_ROUTES.map((route, index) => (
            <div
              key={index}
              className="border-gray-2 flex flex-col rounded border bg-white pr-3 pl-5"
            >
              {/* 상단: 이름 및 출발역 */}
              <div className="flex items-center gap-3 py-3">
                <span className="text-gray-7 text-sm font-semibold">{route.name}</span>
                <span className="text-gray-9 rounded bg-gray-100 px-1 py-0.5 text-[11px]">
                  {route.startStation}
                </span>
              </div>

              {/* 구분선 */}
              {/* <div className="bg-gray-1 mt-4 mb-5 h-px w-full"></div> */}

              {/* 하단: 호선 정보 및 시간 */}
              <div className="border-t-gray-1 flex items-center justify-between border-t py-5">
                {/* 호선 뱃지 */}
                <div className="flex items-center gap-1.5">
                  {route.lines.map((line, idx) => (
                    <div key={idx} className="flex items-center">
                      <span
                        className={`flex items-center justify-center rounded-[5px] px-2 py-px text-[13px] text-white ${getLineBadgeStyle(
                          line
                        )}`}
                      >
                        {line}호선
                      </span>
                      {/* 화살표 아이콘 (마지막 요소 제외) */}
                      {idx < route.lines.length - 1 && (
                        <span className="mx-1 text-gray-400">
                          <Image
                            src="/icon/rightarrow.svg"
                            alt="오른쪽 화살표"
                            width={12}
                            height={18}
                          />
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* 이동 시간 */}
                <span className="text-gray-6 text-[13px]">
                  이동시간
                  <span className="text-blue-5 ml-1.75 text-lg font-semibold">{route.time}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

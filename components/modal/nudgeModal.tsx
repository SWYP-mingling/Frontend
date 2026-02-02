'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import Toast from '../ui/toast';
import { useShareMeeting } from '@/hooks/api/query/useShareMeeting';

interface NudgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: string;
}

export default function NudgeModal({ isOpen, onClose, meetingId }: NudgeModalProps) {
  const { shareUrl, isError, isLoading, handleCopyLink, isVisible } = useShareMeeting(meetingId);

  const displayValue = isError
    ? '유효하지 않은 모임입니다.'
    : isLoading
      ? '링크 생성 중...'
      : shareUrl;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="flex w-80 flex-col gap-6 rounded bg-white px-6 py-5 md:w-89.5"
      >
        {/* 헤더 영역 */}
        <DialogHeader className="text-left">
          <DialogTitle className="text-[22px] leading-[1.364] font-semibold text-black">
            아직 입력하지 않은 친구를 <br />
            재촉해 보세요!
          </DialogTitle>
          <DialogDescription className="sr-only">
            아직 출발지를 입력하지 않은 친구들에게 재촉 알림을 보냅니다.
          </DialogDescription>
        </DialogHeader>

        {/* 이미지 영역 */}
        <div className="bg-gray-2 flex h-55.5 w-68 items-center justify-center rounded-2xl md:w-77.5"></div>

        {/* 주소창 복사 영역 */}
        <DialogFooter>
          <div className="relative z-10 flex w-full rounded-sm md:w-90">
            <Toast message="주소가 복사되었습니다" isVisible={isVisible} />

            <input
              type="text"
              name="NudgeLink"
              aria-label="모임 공유 링크"
              value={displayValue}
              readOnly
              disabled={isLoading || isError}
              className="border-gray-1 grow rounded-l-sm border border-r-0 bg-white p-2.5 text-[15px] font-normal text-black focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              disabled={isLoading || isError || !shareUrl}
              className="bg-gray-1 text-gray-6 border-gray-1 hover:bg-gray-2 cursor-pointer rounded-r-sm border px-3.5 py-3 text-sm font-semibold whitespace-nowrap transition-colors"
            >
              복사
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

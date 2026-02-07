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
import Image from 'next/image';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: string;
}

export default function ShareModal({ isOpen, onClose, meetingId }: ShareModalProps) {
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
          <DialogTitle className="pr-4 text-[22px] font-semibold text-black">
            모임 링크를 공유해주세요
          </DialogTitle>
          <DialogDescription className="sr-only">
            현재 모임의 참여 링크를 복사하거나 친구들에게 공유하여 초대할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-gray-2 relative flex w-full items-center justify-center overflow-hidden rounded-2xl">
          <Image
            src="/images/waiting_modal.jpg"
            width={310}
            height={222}
            alt="모임 링크를 공유해주세요"
            className="h-auto w-full object-cover"
            priority
          />
        </div>
        <DialogFooter>
          <div className="relative z-10 flex w-full rounded-sm">
            <Toast message="주소가 복사되었습니다" isVisible={isVisible} />

            <input
              type="text"
              name="shareLink"
              aria-label="모임 공유 링크"
              value={displayValue}
              readOnly
              disabled={isLoading || isError}
              className="border-gray-1 min-w-0 grow rounded-l-sm border border-r-0 bg-white p-2.5 text-[15px] font-normal text-black focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              disabled={isLoading || isError || !shareUrl}
              className="bg-gray-1 text-gray-6 border-gray-1 hover:bg-gray-2 shrink-0 cursor-pointer rounded-r-sm border px-3.5 py-3 text-sm font-semibold whitespace-nowrap transition-colors"
            >
              복사
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

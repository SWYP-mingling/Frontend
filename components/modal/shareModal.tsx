'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import Toast from '../ui/toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [link, setLink] = useState('www.abcabc');
  const { isVisible, show } = useToast();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      show();
    } catch (error) {
      console.error('복사 실패: ', error);
      alert('복사에 실패했습니다. 링크를 직접 복사해주세요.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="flex w-80 flex-col gap-6 rounded bg-white px-6 py-5 md:w-89.5"
      >
        {/* 헤더 영역 */}
        <DialogHeader className="text-left">
          <DialogTitle className="text-[22px] font-semibold text-black">
            모임 링크를 공유해주세요
          </DialogTitle>
          <DialogDescription className="sr-only">
            현재 모임의 참여 링크를 복사하거나 친구들에게 공유하여 초대할 수 있습니다.
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
              name="shareLink"
              aria-label="모임 공유 링크"
              value={link}
              readOnly
              className="border-gray-1 grow rounded-l-sm border border-r-0 bg-white p-2.5 text-[15px] font-normal text-black focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopyLink}
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

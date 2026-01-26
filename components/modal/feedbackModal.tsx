'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SCORES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [score, setScore] = useState<number | null>(null);
  const [reason, setReason] = useState('');

  const isValid = score !== null;

  const handleClose = () => {
    setScore(null);
    setReason('');
    onClose();
  };

  const handleSubmit = () => {
    if (!isValid) return;
    console.log('제출 데이터:', { score, reason });

    // TODO: API 호출
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-81 min-w-81 gap-11 rounded bg-white px-6 py-5 md:w-110"
      >
        {/* 헤더 영역 */}
        <DialogHeader className="gap-1 text-left">
          <DialogTitle className="text-[22px] font-semibold text-black">
            밍글링, 어떠셨나요?
          </DialogTitle>
          <DialogDescription className="text-gray-6 text-[13px]">
            더 나은 밍글링을 위해 ~~
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          {/* 점수 선택 영역 (NPS) */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-9 text-sm leading-[1.57] font-semibold break-keep">
              직접 약속 장소를 정하는 것과 비교했을 때 어떠셨나요?
            </label>

            <div className="flex flex-col gap-2">
              {/* 숫자 버튼 그룹 */}
              <div className="flex w-full justify-between gap-1">
                {SCORES.map((num) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setScore(num)}
                    aria-pressed={score === num}
                    className={`flex h-10 w-full items-center justify-center rounded border text-base font-normal focus:outline-none ${score === num ? 'bg-blue-5 text-white' : 'border-gray-2 text-gray-7 hover:bg-blue-1 bg-white'} `}
                  >
                    {num}
                  </button>
                ))}
              </div>

              {/* 양끝 라벨 */}
              <div className="text-gray-7 flex justify-between text-xs font-medium">
                <span>추천하고 싶지 않다</span>
                <span>추천하고 싶다</span>
              </div>
            </div>
          </div>

          {/* 이유 입력 영역 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="reason" className="text-gray-9 text-sm leading-[1.57] font-semibold">
              그렇게 느낀 가장 큰 이유는 무엇인가요?
            </label>
            <textarea
              id="reason"
              placeholder="플레이스 홀더"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="focus:border-blue-5 placeholder:text-gray-2 h-12 w-full rounded border px-3 py-2 text-[15px] transition-colors focus:outline-none"
            />
          </div>
        </div>

        {/* 푸터 (제출 버튼) */}
        <DialogFooter>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className={`h-12 w-full rounded text-lg font-semibold transition-colors ${isValid ? 'hover:bg-blue-8 bg-blue-5 text-white' : 'text-gray-2 bg-gray-4'}`}
          >
            제출하기
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

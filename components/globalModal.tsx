'use client';

import { useModalStore } from '@/store/useModalStore';
import FeedbackModal from '@/components/modal/feedbackModal';
import ShareModal from '@/components/modal/shareModal';
// import NudgeModal from '@/components/NudgeModal'; // 추후 제작 예정

export default function GlobalModal() {
  const { type, isOpen, onClose } = useModalStore();

  // 닫혀있거나 타입이 없으면 모달 X
  if (!isOpen || !type) return null;

  // 타입에 따라 다른 컴포넌트 렌더링.
  switch (type) {
    case 'FEEDBACK':
      return <FeedbackModal isOpen={isOpen} onClose={onClose} />;
    case 'SHARE':
      return <ShareModal isOpen={isOpen} onClose={onClose} />;
    case 'NUDGE':
      return null;
    //   return <NudgeModal isOpen={isOpen} onClose={onClose} {...props} />;
    default:
      return null;
  }
}

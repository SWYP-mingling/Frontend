import { create } from 'zustand';
import { combine, devtools } from 'zustand/middleware';

// 관리할 모달의 종류 정의 (피드백남기기, 링크 공유하기, 재촉하기, 환승경로 보기)
export type ModalType = 'FEEDBACK' | 'SHARE' | 'NUDGE' | 'TRANSFER';

export const useModalStore = create(
  devtools(
    combine(
      {
        type: null as ModalType | null,
        isOpen: false,
      },
      (set) => ({
        onOpen: (type: ModalType) => {
          set({ isOpen: true, type });
        },
        onClose: () => {
          set({ isOpen: false });
        },
      })
    ),
    { name: 'ModalStore' }
  )
);

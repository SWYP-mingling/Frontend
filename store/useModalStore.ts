import { create } from 'zustand';
import { combine, devtools } from 'zustand/middleware';

// 관리할 모달의 종류 정의
export type ModalType = 'FEEDBACK' | 'SHARE' | 'NUDGE' | 'TRANSFER';

export interface ModalData {
  meetingId?: string; // SHARE, NUDGE 모달에서 사용
}

export const useModalStore = create(
  devtools(
    combine(
      {
        type: null as ModalType | null,
        isOpen: false,
        data: null as ModalData | null,
      },
      (set) => ({
        onOpen: (type: ModalType, data?: ModalData) => {
          set({ isOpen: true, type, data });
        },
        onClose: () => {
          set({ isOpen: false, data: null });
        },
      })
    ),
    { name: 'ModalStore' }
  )
);

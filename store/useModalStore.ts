import { create } from 'zustand';
import { combine, devtools } from 'zustand/middleware';

// 관리할 모달의 종류 정의 (피드백남기기, 링크 공유하기, 재촉하기)
export type ModalType = 'FEEDBACK' | 'SHARE' | 'NUDGE';

export const useModalStore = create(
  devtools(
    combine(
      {
        type: null as ModalType | null,
        isOpen: false,
        props: null as any,
      },
      (set) => ({
        onOpen: (type: ModalType, props: any = null) => {
          set({ isOpen: true, type, props });
        },
        onClose: () => {
          set({ isOpen: false });
        },
      })
    ),
    { name: 'ModalStore' }
  )
);

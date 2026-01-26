import { useModalStore, ModalType } from '@/store/useModalStore';

export const useOpenModal = () => {
  const { onOpen } = useModalStore();

  const openModal = (type: ModalType, e?: React.MouseEvent<HTMLElement>) => {
    // 이벤트가 넘어왔다면 포커스 해제 (에러 방지 핵심 로직)
    if (e) e.currentTarget.blur();

    onOpen(type);
  };

  return openModal;
};

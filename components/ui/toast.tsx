interface ToastProps {
  message: string;
  isVisible: boolean;
}

const Toast = ({ message, isVisible }: ToastProps) => {
  return (
    // isVisible을 통해 toast 컴포넌트 애니메이션 효과 부여
    <div
      className={`absolute bottom-full left-1/2 mb-3 h-8 -translate-x-1/2 whitespace-nowrap transition-all duration-300 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`}
    >
      <div className="bg-gray-8 relative rounded-full px-7 py-2 text-xs font-normal text-white">
        {message}
      </div>
    </div>
  );
};

export default Toast;

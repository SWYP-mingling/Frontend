import { useState, useEffect, useRef } from 'react';

export const useToast = (duration = 2000) => {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const show = () => {
    // 토스트 호출 버튼 연타 방지 코드
    if (isVisible) return;

    setIsVisible(true);

    // 타이머 설정 코드 (2초 후 실행)
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, duration);
  };

  useEffect(() => {
    return () => {
      // 토스트 컴포넌트 언마운트 시, 안전하게 타이머 정리하기
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { isVisible, show };
};

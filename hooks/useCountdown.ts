import { useState, useEffect } from 'react';

// 1. 계산 로직을 훅 내부(useEffect 밖) 또는 파일 최상단으로 분리
const calculateTimeLeft = (targetDateISO: string) => {
  const now = new Date().getTime();
  const target = new Date(targetDateISO).getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isExpired: false,
  };
};

export const useCountdown = (targetDateISO: string) => {
  // 2. [수정] useState 안에서 함수를 호출하여 '초기값'을 바로 세팅합니다.
  // 이렇게 하면 useEffect에서 setTimeLeft를 또 호출할 필요가 없습니다.
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDateISO));

  useEffect(() => {
    // 3. 기한 없음(59일 이상) 체크를 여기서 수행
    // (초기값이 이미 계산되어 있으므로 timeLeft.days를 바로 확인 가능)
    if (timeLeft.days >= 59) {
      return;
    }

    // 만약 초기값 계산 시점과 mount 시점의 차이를 보정하고 싶다면
    // 여기서 한 번 더 계산할 수도 있지만, 위에서 초기화를 했으므로 바로 인터벌을 돌려도 됩니다.

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDateISO));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateISO, timeLeft.days]); // timeLeft.days 의존성 추가

  return timeLeft;
};

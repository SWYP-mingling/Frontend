import { useState, useEffect } from 'react';

export const useCountdown = (targetDateISO: string) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
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

    // 1. 먼저 한 번 계산해서 현재 상태를 업데이트합니다.
    const initialTime = calculateTimeLeft();
    setTimeLeft(initialTime);

    // 2. 기한 없음 상태)면 타이머(setInterval)를 아예 시작하지 않고 여기서 끝냅니다.
    if (initialTime.days >= 59) {
      return;
    }

    // 3. 59일 미만일 때만 1초마다 갱신합니다.
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateISO]);

  return timeLeft;
};

// hooks/useIsLoggedIn.ts
'use client';

import { useState, useEffect } from 'react';
import { getMeetingUserId } from '@/lib/storage';

export const notifyLoginStateChange = () => {
  window.dispatchEvent(new Event('loginStateChange'));
};

export const useIsLoggedIn = (meetingId?: string) => {
  const [isLogin, setIsLogin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkLoginState = () => {
      if (!meetingId) {
        setIsLogin(false);
        setIsChecking(false);
        return;
      }

      // ⭐ 모임별로 분리된 userId 확인
      const userId = getMeetingUserId(meetingId);
      setIsLogin(!!userId);
      setIsChecking(false);
    };

    checkLoginState();

    window.addEventListener('loginStateChange', checkLoginState);
    return () => {
      window.removeEventListener('loginStateChange', checkLoginState);
    };
  }, [meetingId]);

  return { isLogin, isChecking };
};

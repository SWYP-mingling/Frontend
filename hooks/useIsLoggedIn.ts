// hooks/useIsLoggedIn.ts
'use client';

import { useState, useEffect } from 'react';

export const notifyLoginStateChange = () => {
  window.dispatchEvent(new Event('loginStateChange'));
};
export const useIsLoggedIn = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkLoginState = async () => {
      try {
        const pathParts = window.location.pathname.split('/');
        const meetingId = pathParts[pathParts.length - 1];

        if (!meetingId) {
          setIsLogin(false);
          setIsChecking(false);
          return;
        }

        // ⭐ 이 API가 현재 모임에 대한 세션을 확인해야 함
        const response = await fetch(`/api/meeting/${meetingId}/status`, {
          credentials: 'include',
        });

        setIsLogin(response.ok);
      } catch (error) {
        setIsLogin(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkLoginState();

    window.addEventListener('loginStateChange', checkLoginState);
    return () => {
      window.removeEventListener('loginStateChange', checkLoginState);
    };
  }, []);

  return { isLogin, isChecking };
};

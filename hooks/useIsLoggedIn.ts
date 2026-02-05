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
    const checkLoginState = () => {
      // ⭐ 단순히 스토리지에 userId가 있는지만 확인
      const hasUserId = !!(localStorage.getItem('userId') || sessionStorage.getItem('userId'));

      setIsLogin(hasUserId);
      setIsChecking(false);
    };

    checkLoginState();

    window.addEventListener('loginStateChange', checkLoginState);
    return () => {
      window.removeEventListener('loginStateChange', checkLoginState);
    };
  }, []);

  return { isLogin, isChecking };
};

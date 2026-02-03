'use client';

import { useState, useEffect } from 'react';

// 커스텀 이벤트로 로그인 상태 변경 알림
export const notifyLoginStateChange = () => {
  window.dispatchEvent(new Event('loginStateChange'));
};

export const useIsLoggedIn = () => {
  const [isLogin, setIsLogin] = useState(() => {
    // 초기값을 lazy initialization으로 설정
    if (typeof window !== 'undefined') {
      return document.cookie.includes('accessToken');
    }
    return false;
  });

  useEffect(() => {
    const checkLoginState = () => {
      setIsLogin(document.cookie.includes('accessToken'));
    };

    // 커스텀 이벤트 리스너 등록
    window.addEventListener('loginStateChange', checkLoginState);

    return () => {
      window.removeEventListener('loginStateChange', checkLoginState);
    };
  }, []);

  return isLogin;
};

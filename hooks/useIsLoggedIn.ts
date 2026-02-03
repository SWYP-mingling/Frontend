'use client';

import { useState, useEffect } from 'react';

export const useIsLoggedIn = () => {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    // 1. 쿠키에서 확인하는 경우 (가장 추천, 아까 쿠키 세팅 하셨으니까요!)
    // 'accessToken'이나 'JSESSIONID' 등 실제 사용하는 쿠키 이름이 포함되어 있는지 확인
    const hasCookie = document.cookie.includes('accessToken');

    // 2. 혹은 로컬스토리지/세션스토리지에서 확인하는 경우
    // const hasToken = !!localStorage.getItem('accessToken');
    // const hasSession = !!sessionStorage.getItem('accessToken');

    setIsLogin(hasCookie); // 조건에 따라 true/false 설정
  }, []);

  return isLogin;
};

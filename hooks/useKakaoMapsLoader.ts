'use client';

import { preconnect } from 'react-dom';
import { useKakaoLoader } from 'react-kakao-maps-sdk';

export const useKakaoMapsLoader = () => {
  preconnect('https://dapi.kakao.com');

  return useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY ?? '',
    url: 'https://dapi.kakao.com/v2/maps/sdk.js',
  });
};

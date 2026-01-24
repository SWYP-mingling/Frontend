'use client';

import { useEffect, useRef } from 'react';

interface KakaoMapProps {
  className?: string; // Tailwind 클래스를 받기 위해
}

export default function KakaoMap({ className }: KakaoMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. 카카오 스크립트가 로드되지 않았으면 중단
    if (!window.kakao) return;

    // 2. 카카오 맵 로드 (autoload=false라서 명시적으로 load 호출 필요)
    window.kakao.maps.load(() => {
      const container = mapContainer.current;
      if (!container) return;

      const options = {
        center: new window.kakao.maps.LatLng(37.5563, 126.9224), // 홍대입구역 좌표
        level: 3, // 지도 확대 레벨
      };

      // 지도 생성
      const map = new window.kakao.maps.Map(container, options);

      // (선택) 마커 추가 예시
      const markerPosition = new window.kakao.maps.LatLng(37.5563, 126.9224);
      const marker = new window.kakao.maps.Marker({ position: markerPosition });
      marker.setMap(map);
    });
  }, []);

  return <div ref={mapContainer} className={className} />;
}

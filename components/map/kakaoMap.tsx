'use client';

import { useEffect, useRef, useState } from 'react';

interface Participant {
  id: number;
  name: string;
  station: string;
  lat: number;
  lng: number;
  hexColor: string;
}

interface KakaoMapProps {
  className?: string;
  participants?: Participant[];
}

export default function KakaoMap({ className, participants = [] }: KakaoMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  // [NEW] 지도 객체를 저장할 상태 (버튼에서 쓰기 위해)
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    if (!window.kakao) return;

    window.kakao.maps.load(() => {
      const container = mapContainer.current;
      if (!container) return;

      const options = {
        center: new window.kakao.maps.LatLng(37.5563, 126.9224),
        level: 8,
      };

      // 지도 생성
      const kakaoMap = new window.kakao.maps.Map(container, options);

      // [NEW] 생성된 지도를 state에 저장
      setMap(kakaoMap);

      const bounds = new window.kakao.maps.LatLngBounds();

      if (participants.length > 0) {
        participants.forEach((person) => {
          const position = new window.kakao.maps.LatLng(person.lat, person.lng);
          bounds.extend(position);

          const content = `
            <div class="relative flex flex-col items-center group">
               <div class="absolute bottom-9 mb-1 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-md opacity-0 transition-opacity group-hover:opacity-100">
                ${person.station} (${person.name})
              </div>
              <div class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-lg" 
                   style="background-color: ${person.hexColor};">
                <span class="text-sm font-bold text-white">${person.name}</span>
              </div>
            </div>
          `;

          new window.kakao.maps.CustomOverlay({
            position: position,
            content: content,
            yAnchor: 1,
            map: kakaoMap, // 여기선 변수 kakaoMap 사용
          });
        });

        kakaoMap.setBounds(bounds);
      }
    });
  }, [participants]);

  // [NEW] 줌 인/아웃 핸들러
  const zoomIn = () => {
    if (!map) return;
    // 레벨이 낮아질수록 확대됨 (animate: true는 부드러운 애니메이션)
    map.setLevel(map.getLevel() - 1, { animate: true });
  };

  const zoomOut = () => {
    if (!map) return;
    // 레벨이 높아질수록 축소됨
    map.setLevel(map.getLevel() + 1, { animate: true });
  };

  return (
    <div className={`relative ${className}`}>
      {/* 지도 컨테이너 */}
      <div ref={mapContainer} className="h-full w-full" />

      {/* [NEW] 커스텀 줌 컨트롤 버튼 */}
      <div className="absolute right-4 bottom-4 z-10 flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white shadow-md">
        <button
          type="button"
          onClick={zoomIn}
          className="flex h-8 w-8 items-center justify-center border-b border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-blue-500 active:bg-gray-200"
          aria-label="확대"
        >
          {/* 플러스 아이콘 */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button
          type="button"
          onClick={zoomOut}
          className="flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-blue-500 active:bg-gray-200"
          aria-label="축소"
        >
          {/* 마이너스 아이콘 */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}

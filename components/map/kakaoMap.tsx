'use client';

import { useEffect, useRef, useState } from 'react';
import ZoomControl from './zoomControl';

// [1] Participant 인터페이스 수정
interface Participant {
  id: number | string; // 'me'는 string, 나머지는 number이므로 유니온 타입으로 변경
  line: string;
  name: string;
  station: string;
  latitude: number;
  longitude: number;
  hexColor: string;
}

interface KakaoMapProps {
  className?: string;
  participants?: Participant[];
}

export default function KakaoMap({ className, participants = [] }: KakaoMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
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

      const kakaoMap = new window.kakao.maps.Map(container, options);
      setMap(kakaoMap);

      const bounds = new window.kakao.maps.LatLngBounds();

      if (participants.length > 0) {
        participants.forEach((person) => {
          const position = new window.kakao.maps.LatLng(person.latitude, person.longitude);
          bounds.extend(position);

          // [2] '나'일 경우 z-index를 높여서 맨 위에 표시
          const isMe = person.id === 'me';
          const zIndex = isMe ? 2 : 1;

          const content = `
            <div class="relative flex flex-col items-center group" style="z-index: ${zIndex};">
              <div class="absolute bottom-9 mb-1 whitespace-nowrap rounded-md bg-gray-9 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                ${person.station} (${person.name})
              </div>
              <div class="flex h-8 w-8 items-center justify-center rounded-full border border-white" 
                   style="background-color: ${person.hexColor};">
                <span class="text-sm font-semibold text-white">${person.name}</span>
              </div>
            </div>
          `;

          new window.kakao.maps.CustomOverlay({
            position: position,
            content: content,
            yAnchor: 1,
            zIndex: zIndex, // [3] 카카오 오버레이 옵션에도 zIndex 적용
            map: kakaoMap,
          });
        });

        kakaoMap.setBounds(bounds);
      }
    });
  }, [participants]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="h-full w-full" />
      <ZoomControl map={map} />
    </div>
  );
}

'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

// [1] Participant 인터페이스 수정
interface Participant {
  id: number | string; // 'me'는 string, 나머지는 number이므로 유니온 타입으로 변경
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
          const position = new window.kakao.maps.LatLng(person.lat, person.lng);
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

  const zoomIn = () => {
    if (!map) return;
    map.setLevel(map.getLevel() - 1, { animate: true });
  };

  const zoomOut = () => {
    if (!map) return;
    map.setLevel(map.getLevel() + 1, { animate: true });
  };

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="h-full w-full" />

      {/* 줌 컨트롤 */}
      <div className="border-gray-4 text-gray-10 absolute right-4 bottom-4 z-10 flex flex-col overflow-hidden rounded border bg-white">
        <button
          type="button"
          onClick={zoomIn}
          className="hover:bg-gray-2 flex h-8 w-8 items-center justify-center"
          aria-label="확대"
        >
          <Image src="/icon/plus.svg" alt="줌인버튼" width={12} height={12} />
        </button>
        <button
          type="button"
          onClick={zoomOut}
          className="hover:bg-gray-2 flex h-8 w-8 items-center justify-center"
          aria-label="축소"
        >
          <Image src="/icon/minus.svg" alt="줌아웃버튼" width={12} height={12} />
        </button>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Map, CustomOverlayMap } from 'react-kakao-maps-sdk';
import ZoomControl from './zoomControl';

interface Participant {
  id: number | string;
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
  // 지도 객체를 담을 state
  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  // [핵심 로직] 지도 범위(Bounds) 재설정
  useEffect(() => {
    // 1. 지도 객체가 없거나, 참가자가 없거나, 카카오 SDK가 없으면 중단
    if (!map || participants.length === 0 || !window.kakao || !window.kakao.maps) return;

    // 2. [중요] kakao.maps.load() 콜백 안에서 로직 실행
    // 이 함수가 "LatLngBounds is not a constructor" 에러를 막아줍니다.
    window.kakao.maps.load(() => {
      const bounds = new window.kakao.maps.LatLngBounds();

      participants.forEach((person) => {
        bounds.extend(new window.kakao.maps.LatLng(person.latitude, person.longitude));
      });

      // 모든 참가자가 보이도록 지도 범위 조정 (padding 값을 주어 여백 확보 가능)
      // 예: map.setBounds(bounds, 100, 50, 50, 50);
      map.setBounds(bounds);
    });
  }, [map, participants]);

  return (
    <div className={`relative ${className}`}>
      <Map
        center={{ lat: 37.5563, lng: 126.9224 }}
        style={{ width: '100%', height: '100%' }}
        level={8}
        onCreate={setMap}
      >
        {/* 참가자 마커(오버레이) 렌더링 */}
        {participants.map((person) => {
          const isMe = person.id === 'me';
          const zIndex = isMe ? 2 : 1; // '나'는 더 위에 표시

          return (
            <CustomOverlayMap
              key={person.id}
              position={{ lat: person.latitude, lng: person.longitude }}
              yAnchor={1}
              zIndex={zIndex}
            >
              <div className="group relative flex flex-col items-center">
                {/* 호버 시 나오는 말풍선 (역 이름) */}
                <div className="bg-gray-9 absolute bottom-9 mb-1 rounded-md px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {person.station} ({person.name})
                </div>

                {/* 원형 마커 */}
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white"
                  style={{ backgroundColor: person.hexColor }}
                >
                  <span className="text-sm font-semibold text-white">{person.name}</span>
                </div>
              </div>
            </CustomOverlayMap>
          );
        })}
      </Map>
      <ZoomControl map={map} />
    </div>
  );
}

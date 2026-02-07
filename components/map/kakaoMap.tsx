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
  // 지도 객체를 담을 state (범위 재설정용)
  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  // [핵심 로직] 참가자 목록이 변경되면 지도의 범위(Bounds)를 재설정
  useEffect(() => {
    if (!map || participants.length === 0) return;

    const bounds = new kakao.maps.LatLngBounds();
    participants.forEach((person) => {
      bounds.extend(new kakao.maps.LatLng(person.latitude, person.longitude));
    });

    // 모든 참가자가 보이도록 지도 범위 조정 (여백 포함)
    map.setBounds(bounds);
  }, [map, participants]);

  return (
    <div className={`relative w-full max-w-full overflow-hidden ${className}`}>
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

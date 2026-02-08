'use client';

import React, { useState, useEffect } from 'react';
import { Map, Polyline, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { useRouter } from 'next/navigation';
import ZoomControl from './zoomControl';
import { getRandomHexColor } from '@/lib/color';

interface EndStation {
  name: string;
  latitude: number;
  longitude: number;
}

interface UserRoute {
  nickname: string;
  startStation: string;
  startStationLine: string;
  latitude: number;
  longitude: number;
  travelTime: number;
  transferPath: Array<{
    linenumber: string;
    station: string;
    latitude: number;
    longitude: number;
  }>;
  // ⭐ 여기에 모든 경유 역 정보가 들어있습니다
  stations: Array<{
    linenumber: string;
    station: string;
    latitude: number;
    longitude: number;
  }>;
}

interface KakaoMapLineProps {
  className?: string;
  endStation?: EndStation;
  userRoutes?: UserRoute[];
  meetingId?: string;
}

const LINE_OFFSET_GAP = 0.00015;
export default function KakaoMapLine({
  className,
  endStation,
  userRoutes = [],
  meetingId,
}: KakaoMapLineProps) {
  const router = useRouter();
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!map || !endStation || userRoutes.length === 0) return;
    if (typeof window === 'undefined' || !window.kakao || !window.kakao.maps) return;

    const bounds = new window.kakao.maps.LatLngBounds();
    bounds.extend(new window.kakao.maps.LatLng(endStation.latitude, endStation.longitude));

    userRoutes.forEach((userRoute) => {
      // Bounds 계산에는 오프셋 없는 원본 좌표를 사용하여 정확한 범위를 잡습니다.
      if (userRoute.stations && userRoute.stations.length > 0) {
        userRoute.stations.forEach((station) => {
          bounds.extend(new window.kakao.maps.LatLng(station.latitude, station.longitude));
        });
      } else {
        bounds.extend(new window.kakao.maps.LatLng(userRoute.latitude, userRoute.longitude));
      }
    });

    map.setBounds(bounds);
  }, [map, endStation, userRoutes]);

  if (!endStation || userRoutes.length === 0) {
    return (
      <div className={`relative h-full w-full bg-gray-100 ${className}`}>
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-gray-6 text-sm">지도 정보가 없습니다.</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full max-w-full overflow-hidden ${className}`}>
      <Map
        center={{ lat: endStation.latitude, lng: endStation.longitude }}
        style={{ width: '100%', height: '100%' }}
        level={8}
        onCreate={setMap}
      >
        <CustomOverlayMap
          position={{ lat: endStation.latitude, lng: endStation.longitude }}
          yAnchor={1.2}
          zIndex={20}
        >
          <div className="flex items-center justify-center rounded-full border border-white bg-[#A95623] px-4 py-1.5 shadow-md">
            <span className="text-sm font-semibold text-white">{endStation.name}</span>
          </div>
        </CustomOverlayMap>

        {userRoutes.map((userRoute, index) => {
          const isHovered = hoveredUserId === userRoute.nickname;
          const userColor = getRandomHexColor(userRoute.nickname);

          // ⭐ [핵심 로직] 오프셋 계산
          // 총 인원 중 현재 인덱스의 위치를 계산하여 중앙 정렬 (-1.5, -0.5, 0.5, 1.5 ...)
          // (index - (전체길이 - 1) / 2) 공식을 쓰면 0을 기준으로 대칭이 됩니다.
          const offsetMultiplier = index - (userRoutes.length - 1) / 2;
          const offsetVal = offsetMultiplier * LINE_OFFSET_GAP;

          // 1. 경로 좌표에 오프셋 적용
          const pathCoordinates =
            userRoute.stations && userRoute.stations.length > 0
              ? userRoute.stations.map((station) => ({
                  lat: station.latitude + offsetVal, // 위도 이동
                  lng: station.longitude + offsetVal, // 경도 이동
                }))
              : [
                  { lat: userRoute.latitude + offsetVal, lng: userRoute.longitude + offsetVal },
                  { lat: endStation.latitude, lng: endStation.longitude },
                ];

          // 2. 출발 마커 좌표에도 오프셋 적용
          const markerPosition = {
            lat: userRoute.latitude + offsetVal,
            lng: userRoute.longitude + offsetVal,
          };

          return (
            <React.Fragment key={`user-route-${index}`}>
              {pathCoordinates.length > 1 && (
                <Polyline
                  path={pathCoordinates}
                  strokeWeight={4}
                  strokeColor={userColor}
                  // 겹침 방지를 위해 평소에는 불투명하게,
                  // 그래도 겹친다면 구분되도록 0.8 정도로 설정
                  strokeOpacity={1}
                  strokeStyle={'solid'}
                />
              )}

              <CustomOverlayMap
                position={markerPosition} // 오프셋 적용된 위치
                yAnchor={1}
                zIndex={isHovered ? 60 : 15}
              >
                <div
                  className="group relative flex cursor-pointer flex-col items-center"
                  onMouseEnter={() => setHoveredUserId(userRoute.nickname)}
                  onMouseLeave={() => setHoveredUserId(null)}
                >
                  <div
                    className={`absolute bottom-full mb-2 flex flex-col items-center rounded bg-gray-900 px-3 py-1 shadow-lg transition-all duration-200 ${
                      isHovered
                        ? 'translate-y-0 opacity-100'
                        : 'pointer-events-none translate-y-2 opacity-0'
                    }`}
                  >
                    <span className="text-xs whitespace-nowrap text-white">
                      {userRoute.startStation} ({userRoute.travelTime}분)
                    </span>
                    <div className="absolute -bottom-1 h-2 w-2 rotate-45 bg-gray-900"></div>
                  </div>

                  <div
                    className={`flex items-center justify-center rounded-full border-2 border-white shadow-sm transition-transform duration-200 ${
                      isHovered ? 'z-50 scale-125' : 'scale-100'
                    }`}
                    style={{
                      backgroundColor: userColor,
                      width: '32px',
                      height: '32px',
                    }}
                  >
                    <span className="text-xs font-bold text-white">
                      {userRoute.nickname.charAt(0)}
                    </span>
                  </div>
                </div>
              </CustomOverlayMap>
            </React.Fragment>
          );
        })}
      </Map>

      <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2 transform">
        <button
          className="bg-blue-5 hover:bg-blue-8 flex h-10 items-center rounded-full px-5 text-sm font-bold text-white shadow-lg transition-colors"
          onClick={() => {
            if (meetingId && endStation) {
              router.push(
                `/recommend?meetingId=${meetingId}&midPlace=${encodeURIComponent(endStation.name)}&lat=${endStation.latitude}&lng=${endStation.longitude}`
              );
            } else {
              router.push('/recommend');
            }
          }}
        >
          {endStation.name}역 주변 장소 추천
        </button>
      </div>

      <ZoomControl map={map} />
    </div>
  );
}

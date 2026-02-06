'use client';

import { useState, useEffect } from 'react';
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

export default function KakaoMapLine({ className, endStation, userRoutes = [], meetingId }: KakaoMapLineProps) {
  const router = useRouter();
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);

  // 지도가 생성되고 Kakao Maps SDK가 로드된 후 범위 설정
  useEffect(() => {
    if (!endStation || userRoutes.length === 0) return;
    if (!map || typeof kakao === 'undefined' || !kakao.maps || !kakao.maps.LatLngBounds) return;

    const bounds = new kakao.maps.LatLngBounds();

    // 도착지 추가
    bounds.extend(new kakao.maps.LatLng(endStation.latitude, endStation.longitude));

    // 사용자 경로 기준으로 범위 설정
    userRoutes.forEach((userRoute) => {
      // 출발역 추가
      bounds.extend(new kakao.maps.LatLng(userRoute.latitude, userRoute.longitude));
      
      // transferPath의 모든 역 추가
      if (userRoute.transferPath && userRoute.transferPath.length > 0) {
        userRoute.transferPath.forEach((path) => {
          bounds.extend(new kakao.maps.LatLng(path.latitude, path.longitude));
        });
      }
      
      // stations의 모든 역 추가
      if (userRoute.stations && userRoute.stations.length > 0) {
        userRoute.stations.forEach((station) => {
          bounds.extend(new kakao.maps.LatLng(station.latitude, station.longitude));
        });
      }
    });

    map.setBounds(bounds);
  }, [map, endStation, userRoutes]);

  // endStation이나 userRoutes가 없으면 빈 화면 표시
  if (!endStation || userRoutes.length === 0) {
    return (
      <div className={`relative ${className}`}>
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
          <span className="text-gray-6 text-sm">지도 정보가 없습니다.</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Map
        center={{ lat: endStation.latitude, lng: endStation.longitude }}
        style={{ width: '100%', height: '100%' }}
        level={8}
        onCreate={setMap}
      >
        {/* 도착지 마커 */}
        <CustomOverlayMap
          position={{ lat: endStation.latitude, lng: endStation.longitude }}
          yAnchor={0.5}
          zIndex={20}
        >
          <div className="flex items-center justify-center rounded-full border border-white bg-[#A95623] px-4 py-1.5">
            <span className="text-sm font-semibold text-white">{endStation.name}</span>
          </div>
        </CustomOverlayMap>

        {/* 사용자 경로 표시 */}
        {userRoutes.map((userRoute, index) => {
          const isHovered = hoveredUserId === userRoute.nickname;
          const userColor = getRandomHexColor(userRoute.nickname);
          
          // 경로 좌표 생성 (출발역 -> transferPath -> 도착지)
          const pathCoordinates: Array<{ lat: number; lng: number }> = [];
          
          // 출발역 추가
          pathCoordinates.push({ lat: userRoute.latitude, lng: userRoute.longitude });
          
          // transferPath 추가
          if (userRoute.transferPath && userRoute.transferPath.length > 0) {
            userRoute.transferPath.forEach((path) => {
              pathCoordinates.push({ lat: path.latitude, lng: path.longitude });
            });
          }
          
          // 도착지 추가
          pathCoordinates.push({ lat: endStation.latitude, lng: endStation.longitude });

          return (
            <div key={`user-${index}`}>
              {/* 경로 선 */}
              {pathCoordinates.length > 1 && (
                <Polyline
                  path={pathCoordinates}
                  strokeWeight={3}
                  strokeColor={userColor}
                  strokeStyle={'solid'}
                  strokeOpacity={isHovered ? 0.8 : 0.5}
                  zIndex={isHovered ? 50 : 1}
                />
              )}

              {/* 출발지 마커 & 인터랙션 영역 */}
              <CustomOverlayMap
                position={{ lat: userRoute.latitude, lng: userRoute.longitude }}
                yAnchor={0.5}
                zIndex={isHovered ? 60 : 15}
              >
                <div
                  className="group flex cursor-pointer flex-col items-center"
                  style={{ transform: 'translateY(-30px)' }}
                  onMouseEnter={() => setHoveredUserId(userRoute.nickname)}
                  onMouseLeave={() => setHoveredUserId(null)}
                >
                  {/* 말풍선 */}
                  <div className="bg-gray-9 relative mb-1 flex flex-col items-center rounded px-4.5 py-1.25 shadow-lg transition-transform group-hover:-translate-y-1">
                    <span className="mb-1 text-[11px] whitespace-nowrap text-white">
                      {userRoute.startStation}에서
                    </span>
                    <span className="text-blue-2 text-sm font-semibold whitespace-nowrap">
                      {userRoute.travelTime}분
                    </span>
                    <div className="bg-gray-9 absolute -bottom-1 h-2 w-2 rotate-45 transform"></div>
                  </div>

                  {/* 원형 아이콘 (닉네임 앞글자) */}
                  <div
                    className={`z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white transition-transform md:h-10 md:w-10 ${isHovered ? 'scale-110' : ''}`}
                    style={{ backgroundColor: userColor }}
                  >
                    <span className="text-sm font-semibold text-white md:text-lg">
                      {userRoute.nickname.charAt(0)}
                    </span>
                  </div>

                  {/* 클릭/호버 감지 범위 확장용 투명 원 */}
                  <div className="absolute top-1/2 left-1/2 z-0 h-25 w-25 -translate-x-1/2 -translate-y-1/2 rounded-full" />
                </div>
              </CustomOverlayMap>
            </div>
          );
        })}
      </Map>

      {/* 상단 고정 버튼 (지도 밖) */}
      <div className="absolute top-6 left-1/2 z-20 -translate-x-1/2 transform">
        <button
          className="bg-blue-5 hover:bg-blue-8 relative flex h-9 cursor-pointer items-center rounded-full px-4 py-1.75 text-sm font-semibold text-white transition-colors"
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
          {endStation.name} 주변 장소 추천
        </button>
      </div>

      <ZoomControl map={map} />
    </div>
  );
}

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
  purposes?: string[];
}

const LINE_OFFSET_GAP = 0.00015;

export default function KakaoMapLine({
  className,
  endStation,
  userRoutes = [],
  meetingId,
  purposes = [],
}: KakaoMapLineProps) {
  const router = useRouter();
  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  useEffect(() => {
    if (!map || !endStation || userRoutes.length === 0) return;
    if (typeof window === 'undefined' || !window.kakao || !window.kakao.maps) return;

    const bounds = new window.kakao.maps.LatLngBounds();
    bounds.extend(new window.kakao.maps.LatLng(endStation.latitude, endStation.longitude));

    userRoutes.forEach((userRoute) => {
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

  const handleRecommendClick = () => {
    if (!meetingId || !endStation) {
      router.push('/recommend');
      return;
    }

    let meetingType = '';
    let category = '';

    if (typeof window !== 'undefined') {
      meetingType = localStorage.getItem(`meeting_${meetingId}_meetingType`) || '';
      category = localStorage.getItem(`meeting_${meetingId}_category`) || '';
    }

    if (!meetingType && purposes && purposes.length > 0) {
      meetingType = purposes[0];
    }
    if (!category && purposes && purposes.length > 1) {
      category = purposes[purposes.length - 1];
    }

    const params = new URLSearchParams({
      meetingId,
      midPlace: endStation.name,
      lat: endStation.latitude.toString(),
      lng: endStation.longitude.toString(),
    });

    if (meetingType) params.append('meetingType', meetingType);
    if (category) params.append('category', category);

    router.push(`/recommend?${params.toString()}`);
  };

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
        {/* 도착지 마커 */}
        <CustomOverlayMap
          position={{ lat: endStation.latitude, lng: endStation.longitude }}
          yAnchor={0.5}
          zIndex={100}
        >
          <div className="flex items-center justify-center rounded-full border border-white bg-[#A95623] px-4 py-1.5 shadow-md">
            <span className="text-sm font-semibold text-white">{endStation.name}</span>
          </div>
        </CustomOverlayMap>

        {userRoutes.map((userRoute, index) => {
          const userColor = getRandomHexColor(userRoute.nickname);

          const offsetMultiplier = index - (userRoutes.length - 1) / 2;
          const offsetVal = offsetMultiplier * LINE_OFFSET_GAP;

          const pathCoordinates =
            userRoute.stations && userRoute.stations.length > 0
              ? userRoute.stations.map((station) => ({
                  lat: station.latitude + offsetVal,
                  lng: station.longitude + offsetVal,
                }))
              : [
                  { lat: userRoute.latitude + offsetVal, lng: userRoute.longitude + offsetVal },
                  { lat: endStation.latitude, lng: endStation.longitude },
                ];

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
                  strokeOpacity={1}
                  strokeStyle={'solid'}
                />
              )}

              {/* 출발지 마커 & 정보창 (항상 표시) */}
              <CustomOverlayMap
                position={markerPosition}
                yAnchor={1}
                zIndex={30} // 마커가 선보다 위에 오도록
              >
                <div className="flex flex-col items-center">
                  {/* 1. 상단 정보 말풍선 (검은색 박스) */}
                  <div className="relative mb-2 flex min-w-[80px] flex-col items-center justify-center rounded bg-[#2C2F36] px-3 py-2 shadow-lg">
                    <span className="text-[11px] leading-tight whitespace-nowrap text-white">
                      {userRoute.startStation}역에서
                    </span>
                    <span className="text-blue-2 mt-0.5 text-[14px] leading-tight font-semibold whitespace-nowrap">
                      {userRoute.travelTime}분
                    </span>

                    {/* 말풍선 꼬리 (아래쪽 화살표) */}
                    <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 transform bg-[#2C2F36]"></div>
                  </div>

                  {/* 2. 하단 원형 프로필 아이콘 */}
                  <div
                    className="z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: userColor }}
                  >
                    <span className="text-lg font-bold text-white">
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
          onClick={handleRecommendClick}
        >
          {endStation.name}역 주변 장소 추천
        </button>
      </div>

      <ZoomControl map={map} />
    </div>
  );
}

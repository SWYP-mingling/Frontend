'use client';

import { useState, useMemo } from 'react';
import { Map, Polyline, CustomOverlayMap, Circle } from 'react-kakao-maps-sdk';
import { REAL_SUBWAY_PATHS, HAPJUNG_STATION } from '@/mock/mockData';
import { useRouter } from 'next/navigation';
import ZoomControl from './zoomControl';

export default function KakaoMapLine({ className }: { className?: string }) {
  const router = useRouter();
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [hoveredRouteId, setHoveredRouteId] = useState<number | null>(null);
  const [tooltipStation, setTooltipStation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);

  // 데이터가 로드되면 지도의 범위를 모든 경로가 보이도록 조정
  const initBounds = useMemo(() => {
    if (typeof kakao === 'undefined') return null;
    const bounds = new kakao.maps.LatLngBounds();

    // 도착지 추가
    bounds.extend(new kakao.maps.LatLng(HAPJUNG_STATION.latitude, HAPJUNG_STATION.longitude));

    // 모든 경로의 정차역 추가
    REAL_SUBWAY_PATHS.forEach((route) => {
      route.stations.forEach((station) => {
        bounds.extend(new kakao.maps.LatLng(station.latitude, station.longitude));
      });
    });
    return bounds;
  }, []);

  // 특정 경로 클릭 시 해당 경로로 줌인
  const handleRouteClick = (route: (typeof REAL_SUBWAY_PATHS)[0]) => {
    if (!map) return;
    const bounds = new kakao.maps.LatLngBounds();
    route.stations.forEach((s) => bounds.extend(new kakao.maps.LatLng(s.latitude, s.longitude)));
    map.setBounds(bounds, 100); // padding 100
  };

  return (
    <div className={`relative ${className}`}>
      <Map
        center={{ lat: HAPJUNG_STATION.latitude, lng: HAPJUNG_STATION.longitude }}
        style={{ width: '100%', height: '100%' }}
        level={8}
        onCreate={(mapInstance) => {
          setMap(mapInstance);
          if (initBounds) mapInstance.setBounds(initBounds);
        }}
      >
        {/* 도착지(합정역) 마커 */}
        <CustomOverlayMap
          position={{ lat: HAPJUNG_STATION.latitude, lng: HAPJUNG_STATION.longitude }}
          yAnchor={0.5}
          zIndex={20}
        >
          <div className="flex items-center justify-center rounded-full border border-white bg-[#A95623] px-4 py-1.5">
            <span className="text-sm font-semibold text-white">{HAPJUNG_STATION.name}</span>
          </div>
        </CustomOverlayMap>

        {/* 경로 루프 */}
        {REAL_SUBWAY_PATHS.map((route) => {
          const isHovered = hoveredRouteId === route.id;

          return (
            <div key={route.id}>
              {/*지하철 경로 선 */}
              <Polyline
                path={route.stations.map((s) => ({ lat: s.latitude, lng: s.longitude }))}
                strokeWeight={4}
                strokeColor={route.color}
                strokeStyle={'solid'}
                zIndex={isHovered ? 50 : 1}
              />

              {/* 정차역 점 (Circle) & 툴팁 이벤트 */}
              {route.stations.slice(1, -1).map((station, idx) => (
                <Circle
                  key={`${route.id}-station-${idx}`}
                  center={{ lat: station.latitude, lng: station.longitude }}
                  radius={40}
                  strokeWeight={1}
                  strokeColor={route.color}
                  fillColor={'#FFFFFF'}
                  fillOpacity={1}
                  zIndex={5}
                  onMouseover={() =>
                    setTooltipStation({
                      lat: station.latitude,
                      lng: station.longitude,
                      name: station.name,
                    })
                  }
                  onMouseout={() => setTooltipStation(null)}
                />
              ))}

              {/* 출발지 마커 & 인터랙션 영역 */}
              <CustomOverlayMap
                position={{ lat: route.stations[0].latitude, lng: route.stations[0].longitude }}
                yAnchor={0.5}
                zIndex={isHovered ? 60 : 15}
              >
                {/* 마우스 이벤트 감지용 그룹 */}
                <div
                  className="group flex cursor-pointer flex-col items-center"
                  style={{ transform: 'translateY(-30px)' }}
                  onMouseEnter={() => setHoveredRouteId(route.id)}
                  onMouseLeave={() => setHoveredRouteId(null)}
                  onClick={() => handleRouteClick(route)}
                >
                  {/* 말풍선 */}
                  <div className="bg-gray-9 relative mb-1 flex flex-col items-center rounded px-4.5 py-1.25 shadow-lg transition-transform group-hover:-translate-y-1">
                    <span className="mb-1 text-[11px] whitespace-nowrap text-white">
                      {route.originName}에서
                    </span>
                    <span className="text-blue-2 text-sm font-semibold whitespace-nowrap">
                      {route.time}
                    </span>
                    <div className="bg-gray-9 absolute -bottom-1 h-2 w-2 rotate-45 transform"></div>
                  </div>

                  {/* 원형 아이콘 */}
                  <div
                    className={`z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white transition-transform md:h-10 md:w-10 ${isHovered ? 'scale-110' : ''}`}
                    style={{ backgroundColor: route.color }}
                  >
                    <span className="text-sm font-semibold text-white md:text-lg">
                      {route.name}
                    </span>
                  </div>

                  {/* 클릭/호버 감지 범위 확장용 투명 원 (Click Hit Area) */}
                  <div className="absolute top-1/2 left-1/2 z-0 h-25 w-25 -translate-x-1/2 -translate-y-1/2 rounded-full" />
                </div>
              </CustomOverlayMap>
            </div>
          );
        })}

        {/* 툴팁 오버레이 (조건부 렌더링) */}
        {tooltipStation && (
          <CustomOverlayMap
            position={{ lat: tooltipStation.lat, lng: tooltipStation.lng }}
            yAnchor={1}
            zIndex={30}
          >
            <div className="bg-gray-8 -translate-y-2 transform rounded px-2 py-1 text-xs whitespace-nowrap text-white shadow-sm">
              {tooltipStation.name}
            </div>
          </CustomOverlayMap>
        )}
      </Map>

      {/* 상단 고정 버튼 (지도 밖) */}
      <div className="absolute top-6 left-1/2 z-20 -translate-x-1/2 transform">
        <button
          className="bg-blue-5 hover:bg-blue-8 relative flex h-9 cursor-pointer items-center rounded-full px-4 py-1.75 text-sm font-semibold text-white transition-colors"
          onClick={() => router.push('/recommend')}
        >
          {HAPJUNG_STATION.name} 주변 장소 추천
        </button>
      </div>

      <ZoomControl map={map} />
    </div>
  );
}

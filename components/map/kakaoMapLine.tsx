'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface KakaoMapProps {
  className?: string;
}

// [데이터]
const SEOUL_STATION = { name: '서울역', lat: 37.554678, lng: 126.970606 };

const REAL_SUBWAY_PATHS = [
  {
    id: 1,
    name: '안',
    originName: '길동역',
    time: '42분',
    color: '#8B5CF6',
    stations: [
      { name: '길동역', lat: 37.5378, lng: 127.14 },
      { name: '강동역', lat: 37.5358, lng: 127.1324 },
      { name: '천호역', lat: 37.5385, lng: 127.1239 },
      { name: '광나루역', lat: 37.5453, lng: 127.1035 },
      { name: '아차산역', lat: 37.552, lng: 127.0895 },
      { name: '군자역', lat: 37.5571, lng: 127.0794 },
      { name: '장한평역', lat: 37.5614, lng: 127.0646 },
      { name: '답십리역', lat: 37.5669, lng: 127.0527 },
      { name: '마장역', lat: 37.5661, lng: 127.0429 },
      { name: '왕십리역', lat: 37.5612, lng: 127.0374 },
      { name: '행당역', lat: 37.5574, lng: 127.0296 },
      { name: '신금호역', lat: 37.5545, lng: 127.0207 },
      { name: '청구역', lat: 37.5602, lng: 127.0138 },
      { name: '동대문역사문화공원역', lat: 37.5651, lng: 127.0078 },
      { name: '충무로역', lat: 37.5612, lng: 126.9942 },
      { name: '명동역', lat: 37.5609, lng: 126.9864 },
      { name: '회현역', lat: 37.5585, lng: 126.9782 },
      { name: '서울역', lat: 37.554678, lng: 126.970606 },
    ],
  },
  {
    id: 2,
    name: '김',
    originName: '월드컵경기장역',
    time: '25분',
    color: '#059669',
    stations: [
      { name: '월드컵경기장역', lat: 37.5699, lng: 126.899 },
      { name: '디지털미디어시티역', lat: 37.5772, lng: 126.9012 },
      { name: '홍대입구역', lat: 37.5574, lng: 126.927 },
      { name: '공덕역', lat: 37.5432, lng: 126.9516 },
      { name: '서울역', lat: 37.554678, lng: 126.970606 },
    ],
  },
  {
    id: 3,
    name: '이',
    originName: '사당역',
    time: '18분',
    color: '#3B82F6',
    stations: [
      { name: '사당역', lat: 37.4765, lng: 126.9816 },
      { name: '이수역', lat: 37.4868, lng: 126.9819 },
      { name: '동작역', lat: 37.5028, lng: 126.9803 },
      { name: '이촌역', lat: 37.5226, lng: 126.9734 },
      { name: '신용산역', lat: 37.5292, lng: 126.9678 },
      { name: '삼각지역', lat: 37.5348, lng: 126.9735 },
      { name: '숙대입구역', lat: 37.5447, lng: 126.9721 },
      { name: '서울역', lat: 37.554678, lng: 126.970606 },
    ],
  },
];

export default function KakaoMap({ className }: KakaoMapProps) {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const polylinesRef = useRef<{ id: number; lines: any[] }[]>([]);
  const tooltipOverlayRef = useRef<any>(null);

  const handleLink = () => {
    console.log(`${SEOUL_STATION.name} 맛집으로 이동`);
    router.push('/recommend');
  };

  useEffect(() => {
    if (!window.kakao) return;

    window.kakao.maps.load(() => {
      const container = mapContainer.current;
      if (!container) return;

      const options = {
        center: new window.kakao.maps.LatLng(SEOUL_STATION.lat, SEOUL_STATION.lng),
        level: 8,
      };

      const map = new window.kakao.maps.Map(container, options);
      mapRef.current = map;

      const bounds = new window.kakao.maps.LatLngBounds();
      const endPosition = new window.kakao.maps.LatLng(SEOUL_STATION.lat, SEOUL_STATION.lng);
      bounds.extend(endPosition);

      // 1. [도착지 마커] 서울역 - 주황색 알약
      const destContent = `
        <div class="flex items-center justify-center px-4 py-1.5 bg-[#F97316] border-2 border-white rounded-full shadow-md">
          <span class="text-sm font-semibold text-white">${SEOUL_STATION.name}</span>
        </div>
      `;
      new window.kakao.maps.CustomOverlay({
        position: endPosition,
        content: destContent,
        yAnchor: 0.5,
        map: map,
        zIndex: 10,
      });

      // 2. [기능 유지] 툴팁 오버레이
      const tooltipContent = `
        <div class="px-2 py-1 bg-gray-8 text-white text-xs rounded whitespace-nowrap transform -translate-y-2">
          <span id="tooltip-text"></span>
        </div>
      `;
      tooltipOverlayRef.current = new window.kakao.maps.CustomOverlay({
        content: tooltipContent,
        position: endPosition,
        yAnchor: 1,
        zIndex: 10,
        map: null,
      });

      // 3. 경로 그리기
      REAL_SUBWAY_PATHS.forEach((route) => {
        const linePath = route.stations.map((station) => {
          const latlng = new window.kakao.maps.LatLng(station.lat, station.lng);
          bounds.extend(latlng);
          return latlng;
        });

        const mainLine = new window.kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 4,
          strokeColor: route.color,
          strokeOpacity: 1,
          strokeStyle: 'solid',
        });
        mainLine.setMap(map);

        polylinesRef.current.push({ id: route.id, lines: [mainLine] });

        // 정차역 점
        route.stations.forEach((station, index) => {
          if (index !== 0 && index !== route.stations.length - 1) {
            const circle = new window.kakao.maps.Circle({
              center: new window.kakao.maps.LatLng(station.lat, station.lng),
              radius: 40,
              strokeWeight: 1,
              strokeColor: route.color,
              strokeOpacity: 1,
              fillColor: '#FFFFFF',
              fillOpacity: 1,
              map: map,
              zIndex: 5,
            });

            window.kakao.maps.event.addListener(circle, 'mouseover', () => {
              const overlay = tooltipOverlayRef.current;
              overlay.setPosition(new window.kakao.maps.LatLng(station.lat, station.lng));
              const el = document.createElement('div');
              el.innerHTML = tooltipContent;
              const textSpan = el.querySelector('#tooltip-text');
              if (textSpan) textSpan.textContent = station.name;
              overlay.setContent(
                el.innerHTML.replace('<span id="tooltip-text"></span>', station.name)
              );
              overlay.setMap(map);
            });

            window.kakao.maps.event.addListener(circle, 'mouseout', () => {
              tooltipOverlayRef.current.setMap(null);
            });
          }
        });

        // 4. 출발지 마커 (말풍선 + 원형)
        const startStation = route.stations[0];
        const startPos = new window.kakao.maps.LatLng(startStation.lat, startStation.lng);

        // 이벤트 영역
        const hitArea = new window.kakao.maps.Circle({
          center: startPos,
          radius: 200,
          strokeWeight: 0,
          fillColor: '#000000',
          fillOpacity: 0,
          map: map,
          zIndex: 30,
        });

        // 인터랙션
        const highlightRoute = (isHover: boolean) => {
          polylinesRef.current.forEach((p) => {
            const opacity = isHover ? (p.id === route.id ? 1 : 0.2) : 1;
            const zIndex = isHover && p.id === route.id ? 10 : 1;
            p.lines.forEach((line) => line.setOptions({ strokeOpacity: opacity, zIndex: zIndex }));
          });
        };
        window.kakao.maps.event.addListener(hitArea, 'mouseover', () => highlightRoute(true));
        window.kakao.maps.event.addListener(hitArea, 'mouseout', () => highlightRoute(false));
        window.kakao.maps.event.addListener(hitArea, 'click', () => {
          const routeBounds = new window.kakao.maps.LatLngBounds();
          linePath.forEach((p) => routeBounds.extend(p));
          map.setBounds(routeBounds, 100);
        });

        // 디자인된 마커
        const markerContent = `
          <div class="flex flex-col items-center group" style="transform: translateY(-30px); pointer-events: none;">
            <div class="relative bg-gray-9 px-4.5 py-1.25 rounded mb-1 flex flex-col items-center">
              <span class="text-[11px] text-white mb-1 whitespace-nowrap">${route.originName}에서</span>
              <span class="text-sm font-semibold text-blue-2 whitespace-nowrap">${route.time}</span>
              <div class="absolute -bottom-1 w-2 h-2 bg-gray-9 transform rotate-45"></div>
            </div>
            <div class="flex items-center justify-center w-6 h-6 md:w-10 md:h-10 rounded-full border-2 border-white z-10"
                 style="background-color: ${route.color};">
              <span class="text-white font-semibold text-sm md:text-lg">${route.name}</span>
            </div>
          </div>
        `;

        new window.kakao.maps.CustomOverlay({
          position: startPos,
          content: markerContent,
          map: map,
          yAnchor: 0.5,
          zIndex: 15,
        });
      });

      map.setBounds(bounds);
    });
  }, []);

  return (
    // [수정] relative 부모 컨테이너
    <div className={`relative ${className}`}>
      {/* 지도 영역 */}
      <div ref={mapContainer} className="h-full w-full" />

      {/* [NEW] 화면 상단 중앙 고정 버튼 (지도가 움직여도 고정됨) */}
      <div className="absolute top-6 left-1/2 z-20 -translate-x-1/2 transform">
        <button
          className="bg-blue-5 hover:bg-blue-8 relative flex h-9 cursor-pointer items-center rounded-full px-4 py-1.75 text-sm font-semibold text-white"
          onClick={handleLink}
        >
          {SEOUL_STATION.name} 주변 장소 추천
        </button>
      </div>
    </div>
  );
}

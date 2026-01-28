'use client';

import { useEffect, useRef } from 'react';

interface KakaoMapProps {
  className?: string;
}

// 1. [데이터] 서울역 및 각 출발지별 "실제 정차역" 리스트 (좌표 포함)
const SEOUL_STATION = { lat: 37.554678, lng: 126.970606 };

const REAL_SUBWAY_PATHS = [
  {
    id: 1,
    name: '길동역 출발',
    time: '42분',
    color: '#8B5CF6', // 5호선 보라색
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
    name: '월드컵경기장역 출발',
    time: '25분',
    color: '#059669', // 공항철도/6호선
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
    name: '사당역 출발',
    time: '18분',
    color: '#3B82F6', // 4호선 파란색
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
  const mapContainer = useRef<HTMLDivElement>(null);

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
      const bounds = new window.kakao.maps.LatLngBounds();

      // 도착지(서울역) 핀 마커 표시
      const endPosition = new window.kakao.maps.LatLng(SEOUL_STATION.lat, SEOUL_STATION.lng);
      bounds.extend(endPosition);
      new window.kakao.maps.Marker({ position: endPosition, map: map });

      // 경로 그리기 루프
      REAL_SUBWAY_PATHS.forEach((route) => {
        // 1. 경로의 모든 역 좌표 변환
        const linePath = route.stations.map((station) => {
          const latlng = new window.kakao.maps.LatLng(station.lat, station.lng);
          bounds.extend(latlng);
          return latlng;
        });

        // ==================[수정된 부분 시작]==================
        // 2. 실제 경로 선 그리기 (테두리 효과 적용)

        // 2-1. [배경 선] 하얗고 두꺼운 선 (테두리 역할)
        const borderLine = new window.kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 11, // 메인 선보다 3~4px 더 두껍게
          strokeColor: '#FFFFFF', // 흰색 테두리
          strokeOpacity: 1,
          strokeStyle: 'solid',
        });
        borderLine.setMap(map);

        // 2-2. [메인 선] 테두리 위에 색상 선 그리기
        const mainLine = new window.kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 7, // 테두리보다 얇게
          strokeColor: route.color, // 원래 노선 색상
          strokeOpacity: 1, // 불투명하게 (테두리 위에 올라가므로)
          strokeStyle: 'solid',
        });
        mainLine.setMap(map);
        // ==================[수정된 부분 끝]==================

        // 3. 중간 정차역: 작은 원(Circle)으로 표시
        route.stations.forEach((station, index) => {
          if (index !== 0 && index !== route.stations.length - 1) {
            new window.kakao.maps.Circle({
              center: new window.kakao.maps.LatLng(station.lat, station.lng),
              radius: 40, // 점 크기
              strokeWeight: 1,
              strokeColor: route.color,
              strokeOpacity: 1,
              fillColor: '#FFFFFF',
              fillOpacity: 1,
              map: map,
            });
          }
        });

        // 4. 출발지 커스텀 오버레이 (말풍선 + 번호)
        const startStation = route.stations[0];
        const startPos = new window.kakao.maps.LatLng(startStation.lat, startStation.lng);

        const markerContent = `
          <div class="relative flex flex-col items-center group cursor-pointer" style="bottom: 5px;">
             <div class="mb-1 whitespace-nowrap rounded-full bg-gray-900 px-3 py-1.5 text-xs font-bold text-white shadow-md transition-transform group-hover:scale-110">
              ${startStation.name} (${route.time})
            </div>
            <div class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-sm font-bold text-white shadow-lg" 
                 style="background-color: ${route.color}">
              ${route.id}
            </div>
          </div>
        `;

        new window.kakao.maps.CustomOverlay({
          position: startPos,
          content: markerContent,
          map: map,
          yAnchor: 1,
          zIndex: 3,
        });
      });

      map.setBounds(bounds);
    });
  }, []);

  return <div ref={mapContainer} className={className} />;
}

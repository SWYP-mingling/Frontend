'use client';

import { HAPJUNG_STATION, MOCK_RECOMMEND_PLACES } from '@/mock/mockData';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface KakaoMapRecommendProps {
  className?: string;
  onSelectPlace?: (placeId: number) => void; // 장소 클릭 시 부모에게 알림 (선택사항)
}

const CATEGORIES = [
  { id: '식당', label: '식당', icon: '/icon/place/restaurant' },
  { id: '놀거리', label: '놀거리', icon: '/icon/place/play' },
  { id: '카페', label: '카페', icon: '/icon/place/cafe' },
  { id: '스터디카페', label: '스터디카페', icon: '/icon/place/studycafe' },
];

export default function KakaoMapRecommend({ className, onSelectPlace }: KakaoMapRecommendProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [activeCategory, setActiveCategory] = useState('식당'); // 기본 카테고리

  // 줌 인/아웃 핸들러
  const zoomIn = () => {
    const map = mapRef.current;
    if (map) map.setLevel(map.getLevel() - 1, { animate: true });
  };

  const zoomOut = () => {
    const map = mapRef.current;
    if (map) map.setLevel(map.getLevel() + 1, { animate: true });
  };

  useEffect(() => {
    if (!window.kakao) return;

    window.kakao.maps.load(() => {
      const container = mapContainer.current;
      if (!container) return;

      const options = {
        center: new window.kakao.maps.LatLng(HAPJUNG_STATION.latitude, HAPJUNG_STATION.longitude),
        level: 4,
      };

      const map = new window.kakao.maps.Map(container, options);
      mapRef.current = map;

      // 1. [중심지 마커] 합정역
      const centerPosition = new window.kakao.maps.LatLng(
        HAPJUNG_STATION.latitude,
        HAPJUNG_STATION.longitude
      );
      const centerContent = `
        <div class="flex items-center justify-center px-4 py-1.5 bg-[#A95623] border border-white rounded-full ">
          <span class="text-sm font-semibold text-white">${HAPJUNG_STATION.name}</span>
        </div>
      `;
      new window.kakao.maps.CustomOverlay({
        position: centerPosition,
        content: centerContent,
        yAnchor: 0.5,
        map: map,
        zIndex: 10,
      });

      // 2. [장소 마커] 파란색 핀 (이미지 참고)
      const filteredPlaces = MOCK_RECOMMEND_PLACES.filter(
        (place) => place.category === activeCategory
      );
      filteredPlaces.forEach((place) => {
        const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);
        // [수정] 서비스 로고를 활용한 커스텀 핀 디자인
        const pinContent = `
            <div class="group cursor-pointer relative flex flex-col items-center">
            <div class=" w-15 h-15 rounded-full flex items-center justify-center z-10 overflow-hidden">
            <img src="/icon/location.svg" alt="${place.name}" class="w-15 h-15 object-contain" />
            </div>
            
            <div class="absolute -top-10 px-2 py-1 bg-gray-900 text-white text-[11px] rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                ${place.name}
            </div>
            </div>
        `;
        new window.kakao.maps.CustomOverlay({
          position: position,
          content: pinContent,
          yAnchor: 1,
          map: map,
          zIndex: 5,
        });
      });
    });
  }, [activeCategory]); // 카테고리 변경 시 재렌더링 (데이터 연동 시 필요)

  return (
    <div className={`relative ${className}`}>
      {/* 지도 영역 */}
      <div ref={mapContainer} className="h-full w-full" />

      {/* [UI 1] 상단 카테고리 필터 (Floating) */}
      <div className="scrollbar-hide absolute top-4 right-0 left-0 z-20 flex justify-start gap-2 px-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium whitespace-nowrap shadow-md transition-all ${
              activeCategory === cat.id
                ? 'bg-blue-5 text-white'
                : 'text-gray-7 bg-white hover:bg-gray-50'
            }`}
          >
            <Image src={`${cat.icon}.svg`} alt={`${cat.label}`} width={20} height={20} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* [UI 2] 우측 하단 줌 컨트롤 */}
      <div className="absolute right-4 bottom-6 z-20 flex flex-col overflow-hidden rounded border border-gray-200 shadow-lg">
        <button
          onClick={zoomIn}
          className="flex h-10 w-10 items-center justify-center border-b border-gray-200 bg-white text-gray-600 hover:bg-gray-50 active:bg-gray-100"
          aria-label="확대"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button
          onClick={zoomOut}
          className="flex h-10 w-10 items-center justify-center bg-white text-gray-600 hover:bg-gray-50 active:bg-gray-100"
          aria-label="축소"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}

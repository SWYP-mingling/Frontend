'use client';

import { Map, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { HAPJUNG_STATION, MOCK_RECOMMEND_PLACES } from '@/mock/mockData';
import Image from 'next/image';
import { useState, useMemo } from 'react';

interface KakaoMapRecommendProps {
  className?: string;
  onSelectPlace?: (placeId: number) => void;
}

const CATEGORIES = [
  { id: '식당', label: '식당', icon: '/icon/place/restaurant' },
  { id: '놀거리', label: '놀거리', icon: '/icon/place/play' },
  { id: '카페', label: '카페', icon: '/icon/place/cafe' },
  { id: '스터디카페', label: '스터디카페', icon: '/icon/place/studycafe' },
];

export default function KakaoMapRecommend({ className, onSelectPlace }: KakaoMapRecommendProps) {
  // 1. 지도 객체를 state로 관리 (줌 컨트롤 제어용)
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [activeCategory, setActiveCategory] = useState('식당');

  // 2. 카테고리에 맞는 장소 필터링 (useMemo로 최적화)
  const filteredPlaces = useMemo(
    () => MOCK_RECOMMEND_PLACES.filter((place) => place.category === activeCategory),
    [activeCategory]
  );

  // 3. 줌 핸들러 (map 객체 사용)
  const zoomIn = () => map?.setLevel(map.getLevel() - 1, { animate: true });
  const zoomOut = () => map?.setLevel(map.getLevel() + 1, { animate: true });

  return (
    <div className={`relative ${className}`}>
      <Map
        center={{ lat: HAPJUNG_STATION.latitude, lng: HAPJUNG_STATION.longitude }}
        style={{ width: '100%', height: '100%' }}
        level={4}
        onCreate={setMap} // 지도가 생성되면 객체를 state에 저장
      >
        {/* [중심지 마커] 합정역 */}
        <CustomOverlayMap
          position={{ lat: HAPJUNG_STATION.latitude, lng: HAPJUNG_STATION.longitude }}
          yAnchor={0.5}
          zIndex={10}
        >
          <div className="flex items-center justify-center rounded-full border border-white bg-[#A95623] px-4 py-1.5 shadow-sm">
            <span className="text-sm font-semibold text-white">{HAPJUNG_STATION.name}</span>
          </div>
        </CustomOverlayMap>

        {/* [장소 마커] 필터링된 장소들 */}
        {filteredPlaces.map((place) => (
          <CustomOverlayMap
            key={place.id}
            position={{ lat: place.latitude, lng: place.longitude }}
            yAnchor={1}
            zIndex={5}
          >
            {/* 마커 디자인 (기존 HTML 문자열 -> JSX 변환) */}
            <div
              className="group relative flex cursor-pointer flex-col items-center"
              onClick={() => onSelectPlace?.(place.id)} // 클릭 시 부모에게 알림
            >
              {/* 핀 아이콘 */}
              <div className="z-10 flex h-15 w-15 items-center justify-center overflow-hidden rounded-full transition-transform group-hover:scale-110">
                {/* 지도 위에서는 next/image보다 일반 img 태그가 레이아웃 잡기 편할 때가 많습니다 */}
                <img
                  src="/icon/location.svg"
                  alt={place.name}
                  className="h-15 w-15 object-contain"
                />
              </div>

              {/* 호버 시 나오는 툴팁 */}
              <div className="pointer-events-none absolute -top-8 z-20 rounded bg-gray-900 px-2 py-1 text-[11px] whitespace-nowrap text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                {place.name}
              </div>
            </div>
          </CustomOverlayMap>
        ))}
      </Map>

      {/* [UI 1] 상단 카테고리 필터 (Floating) */}
      <div className="scrollbar-hide absolute top-4 right-0 left-0 z-20 flex justify-start gap-2 overflow-x-auto px-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium whitespace-nowrap shadow-md transition-all ${
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

      {/* [UI 2] 우측 하단 커스텀 줌 컨트롤 */}
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

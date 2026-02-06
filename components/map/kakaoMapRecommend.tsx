'use client';

import { useState } from 'react';
import { Map, CustomOverlayMap } from 'react-kakao-maps-sdk';
import Image from 'next/image';
import ZoomControl from './zoomControl';

interface KakaoMapRecommendProps {
  className?: string;
  midPlace?: string;
  midPlaceLatitude?: number;
  midPlaceLongitude?: number;
}

const CATEGORIES = [
  { id: '식당', label: '식당', icon: '/icon/place/restaurant' },
  { id: '놀거리', label: '놀거리', icon: '/icon/place/play' },
  { id: '카페', label: '카페', icon: '/icon/place/cafe' },
  { id: '스터디카페', label: '스터디카페', icon: '/icon/place/studycafe' },
];

export default function KakaoMapRecommend({
  className,
  midPlace,
  midPlaceLatitude,
  midPlaceLongitude,
}: KakaoMapRecommendProps) {
  // 1. 지도 객체를 state로 관리 (줌 컨트롤 제어용)
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [activeCategory, setActiveCategory] = useState('식당');


  // 유효한 좌표 확인
  const validLatitude = midPlaceLatitude ?? 37.5496;
  const validLongitude = midPlaceLongitude ?? 126.9139;

  return (
    <div className={`relative ${className}`}>
      <Map
        center={{ lat: validLatitude, lng: validLongitude }}
        style={{ width: '100%', height: '100%' }}
        level={4}
        onCreate={setMap} // 지도가 생성되면 객체를 state에 저장
      >
        {/* [중심지 마커] */}
        {midPlace && (
          <CustomOverlayMap
            position={{ lat: validLatitude, lng: validLongitude }}
            yAnchor={0.5}
            zIndex={10}
          >
            <div className="flex items-center justify-center rounded-full border border-white bg-[#A95623] px-4 py-1.5 shadow-sm">
              <span className="text-sm font-semibold text-white">{midPlace}</span>
            </div>
          </CustomOverlayMap>
        )}

      </Map>

      {/* 상단 카테고리 필터 (Floating) */}
      <div className="scrollbar-hide absolute top-4 right-0 left-0 z-20 flex justify-start gap-2 overflow-x-hidden px-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium whitespace-nowrap transition-all ${
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
      <ZoomControl map={map} />
    </div>
  );
}

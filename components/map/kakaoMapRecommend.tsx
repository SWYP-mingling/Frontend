'use client';

import { useState, useMemo, useEffect } from 'react';
import { Map, CustomOverlayMap } from 'react-kakao-maps-sdk';
import Image from 'next/image';
import ZoomControl from './zoomControl';

interface Place {
  id: number;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
}

interface KakaoMapRecommendProps {
  className?: string;
  midPlace?: string;
  midPlaceLatitude?: number;
  midPlaceLongitude?: number;
  places?: Place[];
  selectedPlaceId?: number;
  onSelectPlace?: (placeId: number) => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  meetingType?: '회의' | '친목' | null;
}

// 전체 카테고리 목록
const ALL_CATEGORIES = [
  { id: '식당', label: '식당', icon: '/icon/place/restaurant' },
  { id: '술집', label: '술집', icon: '/icon/place/bar' },
  { id: '카페', label: '카페', icon: '/icon/place/cafe' },
  { id: '놀거리', label: '놀거리', icon: '/icon/place/play' },
  { id: '스터디 카페', label: '스터디 카페', icon: '/icon/place/studycafe' },
  { id: '장소 대여', label: '장소 대여', icon: '/icon/place/rent' },
];

export default function KakaoMapRecommend({
  className,
  midPlace,
  midPlaceLatitude,
  midPlaceLongitude,
  places = [],
  selectedPlaceId,
  selectedCategory = '',
  onCategoryChange,
  meetingType,
}: KakaoMapRecommendProps) {
  // 1. 지도 객체를 state로 관리 (줌 컨트롤 제어용)
  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  // 상위 카테고리에 따라 하위 카테고리 필터링
  const categories = useMemo(() => {
    if (meetingType === '회의') {
      // 회의: 스터디카페, 장소 대여
      return ALL_CATEGORIES.filter((cat) => cat.id === '스터디 카페' || cat.id === '장소 대여');
    } else if (meetingType === '친목') {
      // 친목: 식당, 술집, 카페, 놀거리
      return ALL_CATEGORIES.filter(
        (cat) => cat.id === '식당' || cat.id === '술집' || cat.id === '카페' || cat.id === '놀거리'
      );
    }
    // meetingType이 없으면 전체 카테고리 표시
    return ALL_CATEGORIES;
  }, [meetingType]);

  // 선택된 장소 찾기
  const selectedPlace = useMemo(() => {
    if (!selectedPlaceId || places.length === 0) return null;
    return places.find((place) => place.id === selectedPlaceId) || null;
  }, [selectedPlaceId, places]);

  // 선택된 장소로 지도 중심 이동
  useEffect(() => {
    if (map && selectedPlace && typeof kakao !== 'undefined' && kakao.maps) {
      const moveLatLon = new kakao.maps.LatLng(selectedPlace.latitude, selectedPlace.longitude);
      map.panTo(moveLatLon);
    }
  }, [map, selectedPlace]);

  // 유효한 좌표 확인
  const validLatitude = midPlaceLatitude ?? 37.5496;
  const validLongitude = midPlaceLongitude ?? 126.9139;

  return (
    <div className={`relative w-full max-w-full overflow-hidden ${className}`}>
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

        {/* [선택된 장소 마커만 표시] */}
        {selectedPlace && (
          <CustomOverlayMap
            position={{ lat: selectedPlace.latitude, lng: selectedPlace.longitude }}
            yAnchor={1}
            zIndex={20}
          >
            <div className="group relative flex cursor-pointer flex-col items-center">
              <div className="z-10 flex h-15 w-15 items-center justify-center overflow-hidden rounded-full transition-transform group-hover:scale-110">
                <Image
                  src="/icon/location.svg"
                  alt={selectedPlace.name}
                  className="object-contain"
                  width={50}
                  height={50}
                />
              </div>

              {/* 호버 시 나오는 툴팁 */}
              <div className="pointer-events-none absolute -top-8 z-20 rounded bg-gray-900 px-2 py-1 text-[11px] whitespace-nowrap text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                {selectedPlace.name}
              </div>
            </div>
          </CustomOverlayMap>
        )}
      </Map>

      {/* 상단 카테고리 필터 (Floating) */}
      <div className="scrollbar-hide absolute top-4 right-0 left-0 z-20 flex justify-start gap-2 overflow-x-hidden px-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange?.(cat.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat.id
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

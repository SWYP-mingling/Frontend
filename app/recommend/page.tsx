'use client';

import { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import KakaoMapRecommend from '@/components/map/kakaoMapRecommend';
import { useRecommend } from '@/hooks/api/query/useRecommend';
import { useCheckMeeting } from '@/hooks/api/query/useCheckMeeting';

function RecommendContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const meetingId = searchParams.get(`meetingId`) || '';
  const midPlace = searchParams.get('midPlace') || '';
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  // 🔥 쿼리스트링에서 카테고리 정보 읽기
  const categoryFromUrl = searchParams.get('category') || '';
  const meetingTypeFromUrl = searchParams.get('meetingType') as '회의' | '친목' | null;

  // 좌표 파싱 (쿼리 파라미터에서 가져오기)
  const midPlaceLatitude = lat ? parseFloat(lat) : undefined;
  const midPlaceLongitude = lng ? parseFloat(lng) : undefined;

  // 현재 선택된 장소 ID (기본값: 첫 번째)
  const [selectedPlaceId, setSelectedPlaceId] = useState<number>(1);

  // 모임 정보 조회 (purposes 정보를 가져오기 위해)
  const { data: meetingData } = useCheckMeeting(meetingId);

  // 상위 카테고리 추출 (우선순위: URL > API > localStorage)
  const meetingType = useMemo(() => {
    if (typeof window === 'undefined') return null;

    // 1. URL 쿼리스트링에서 가져오기
    if (meetingTypeFromUrl === '회의' || meetingTypeFromUrl === '친목') {
      localStorage.setItem(`meeting_${meetingId}_meetingType`, meetingTypeFromUrl);
      return meetingTypeFromUrl;
    }

    // 2. API에서 purposes 가져오기
    if (meetingData?.data?.purposes && meetingData.data.purposes.length > 0) {
      const firstPurpose = meetingData.data.purposes[0];
      if (firstPurpose === '회의' || firstPurpose === '친목') {
        localStorage.setItem(`meeting_${meetingId}_meetingType`, firstPurpose);
        return firstPurpose as '회의' | '친목';
      }
    }

    // 3. localStorage에서 가져오기
    const cachedType = localStorage.getItem(`meeting_${meetingId}_meetingType`);
    if (cachedType === '회의' || cachedType === '친목') {
      return cachedType as '회의' | '친목';
    }

    return null;
  }, [meetingId, meetingData, meetingTypeFromUrl]);

  // 하위 카테고리 추출 (우선순위: URL > API > localStorage)
  const defaultCategory = useMemo(() => {
    if (typeof window === 'undefined') return '';

    // 1. URL 쿼리스트링에서 가져오기
    if (categoryFromUrl) {
      localStorage.setItem(`meeting_${meetingId}_category`, categoryFromUrl);
      return categoryFromUrl;
    }

    // 2. API에서 가져온 purposes의 마지막 값 사용
    if (meetingData?.data?.purposes && meetingData.data.purposes.length > 1) {
      const subCategory = meetingData.data.purposes[meetingData.data.purposes.length - 1];
      if (subCategory) {
        // localStorage에도 저장
        localStorage.setItem(`meeting_${meetingId}_category`, subCategory);
        return subCategory;
      }
    }

    // 3. localStorage에서 가져오기
    const cachedCategory = localStorage.getItem(`meeting_${meetingId}_category`);
    return cachedCategory || '';
  }, [meetingId, meetingData, categoryFromUrl]);

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const cachedCategory = localStorage.getItem(`meeting_${meetingId}_category`);
      if (cachedCategory) return cachedCategory;
    }
    return '';
  });

  const currentCategory = selectedCategory || defaultCategory;

  const effectiveCategory = currentCategory;

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedPlaceId(1); // 카테고리 변경 시 첫 번째 장소 선택
    if (typeof window !== 'undefined') {
      localStorage.setItem(`meeting_${meetingId}_category`, category);
    }
  };

  // 장소 추천 API 호출 (effectiveCategory 사용 - selectedCategory가 우선)
  const {
    data: recommendData,
    isLoading,
    isError,
  } = useRecommend({
    meetingId,
    midPlace,
    category: effectiveCategory,
    page: 1,
    size: 15,
  });

  // API 응답 데이터 변환
  const places = useMemo(() => {
    if (!recommendData?.success || !recommendData.data?.placeInfos) {
      return [];
    }
    return recommendData.data.placeInfos.map((place, index) => ({
      id: index + 1,
      name: place.placeName,
      category: place.categoryGroupName,
      description: place.categoryName,
      phone: place.phone || '전화번호 없음',
      address: place.addressName,
      roadAddress: place.roadAddressName,
      latitude: place.y || place.latitude, // y가 위도
      longitude: place.x || place.longitude, // x가 경도
      placeUrl: place.placeUrl,
    }));
  }, [recommendData]);

  const handleBack = () => {
    router.back();
  };

  const handleOpenKakaoMap = (
    e: React.MouseEvent,
    placeUrl?: string,
    place?: (typeof places)[0]
  ) => {
    e.stopPropagation();

    // ⭐️ 카카오맵에서 보기 클릭 시 GA 전송 (GTM 친화적 dataLayer 직접 Push)
    if (typeof window !== 'undefined' && meetingId && place) {
      const browserId = localStorage.getItem('browser_id');
      const isHost = localStorage.getItem(`is_host_${meetingId}`) === 'true';
      const userRole = isHost ? 'host' : 'participant';
      const candidateId = `place_${String(place.id).padStart(2, '0')}`;

      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({
        event: 'external_map_opened',
        meeting_url_id: meetingId,
        user_cookie_id: browserId,
        role: userRole,
        candidate_id: candidateId,
      });
    }

    if (placeUrl) {
      window.open(placeUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.open('https://map.kakao.com', '_blank', 'noopener,noreferrer');
    }
  };

  // ⭐️ 장소 리스트 중 하나 클릭 시 GA 전송 (GTM 친화적 dataLayer 직접 Push)
  const handlePlaceClick = (place: (typeof places)[0]) => {
    setSelectedPlaceId(place.id);
    if (typeof window !== 'undefined' && meetingId) {
      const candidateId = `place_${String(place.id).padStart(2, '0')}`;

      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({
        event: 'place_list_viewed',
        meeting_url_id: meetingId,
        candidate_id: candidateId,
        place_category: place.category,
        rank_order: place.id,
      });
    }
  };

  return (
    <div className="flex items-center justify-center p-0 md:min-h-[calc(100vh-200px)] md:py-25">
      <div className="flex h-full w-full flex-col bg-white md:h-175 md:w-174 md:flex-row md:gap-2 lg:w-215">
        {/* [LEFT PANEL] 장소 리스트 영역 */}
        <section className="border-gray-1 flex w-full flex-col bg-white md:w-81 md:gap-0">
          {/* 헤더 (뒤로가기 + 타이틀) */}
          <div className="flex items-center gap-3 p-5 md:p-0">
            <button onClick={handleBack} className="flex h-6 w-6 items-center justify-center">
              <Image src="/icon/left_chevron.svg" alt="왼쪽 꺾쇠 기호" width={24} height={24} />
            </button>
            <h2 className="text-gray-9 text-[22px] font-semibold">{midPlace}역 주변 장소 추천</h2>
          </div>

          {/* 모바일 전용 지도 (작게 표시) */}
          <div className="bg-gray-1 relative block h-93.5 md:hidden">
            <KakaoMapRecommend
              className="h-full w-full"
              midPlace={midPlace}
              midPlaceLatitude={midPlaceLatitude}
              midPlaceLongitude={midPlaceLongitude}
              places={places}
              selectedPlaceId={selectedPlaceId}
              onSelectPlace={setSelectedPlaceId}
              selectedCategory={effectiveCategory}
              onCategoryChange={handleCategoryChange}
              meetingType={meetingType}
            />
          </div>

          {/* 리스트 스크롤 영역 */}
          <div className="scrollbar-hide flex-1 overflow-y-auto px-5 pt-5 pb-10 md:px-0 md:pb-0">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <span className="text-gray-6 text-sm">로딩 중...</span>
              </div>
            ) : isError || places.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <span className="text-gray-6 text-sm">
                  {isError ? '데이터를 불러오는데 실패했습니다.' : '추천 장소가 없습니다.'}
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-4 md:gap-5">
                {places.map((place) => (
                  <div
                    key={place.id}
                    onClick={() => handlePlaceClick(place)}
                    className={`flex cursor-pointer flex-col gap-2 rounded border p-4 ${
                      selectedPlaceId === place.id
                        ? 'border-blue-5 border-2'
                        : 'border-gray-2 hover:bg-gray-1 bg-white'
                    }`}
                  >
                    {/* 상단: 이름 및 카테고리 */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 px-0.5">
                        <span className="text-gray-8 text-xl font-semibold break-words">
                          {place.name}
                        </span>
                        <span className="bg-gray-2 text-gray-7 shrink-0 rounded px-2 py-px text-sm font-semibold">
                          {place.category}
                        </span>
                      </div>
                      {/* 공유 아이콘 (이미지에 살짝 보임) */}
                      <button className="text-gray-5 shrink-0 cursor-pointer">
                        <Image src="/icon/gray_share.svg" alt="공유" width={24} height={24} />
                      </button>
                    </div>

                    {/* 설명 */}
                    <p className="text-gray-6 text-[16px]">{place.description}</p>

                    {/* 전화번호 */}
                    <div className="text-gray-8 flex items-center gap-2 text-[16px]">
                      <Image src="/icon/phone.svg" alt="전화" width={20} height={20} />
                      {place.phone}
                    </div>

                    {/* 주소 정보 */}
                    <div className="flex flex-col gap-2 text-[12px]">
                      <div className="flex items-start gap-2.5">
                        <span className="text-gray-5 border-gray-1 m-0.5 shrink-0 rounded border px-2 py-px">
                          지번
                        </span>
                        <span className="text-gray-8 text-[16px] break-words">{place.address}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-5 border-gray-1 shrink-0 rounded border px-2 py-px">
                          도로명
                        </span>
                        <span className="text-gray-8 text-[16px] break-words">
                          {place.roadAddress}
                        </span>
                      </div>
                    </div>

                    {/* 하단 버튼은 조건부 렌더링 */}
                    {selectedPlaceId === place.id ? (
                      <button
                        onClick={(e) => handleOpenKakaoMap(e, place.placeUrl, place)}
                        className="bg-gray-8 w-full rounded py-2 text-[15px] text-white"
                      >
                        카카오맵에서 보기
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* [RIGHT PANEL] 데스크탑 지도 영역 */}
        <section className="bg-gray-1 hidden h-full flex-1 md:block">
          <KakaoMapRecommend
            className="h-full w-full"
            midPlace={midPlace}
            midPlaceLatitude={midPlaceLatitude}
            midPlaceLongitude={midPlaceLongitude}
            places={places}
            selectedPlaceId={selectedPlaceId}
            onSelectPlace={setSelectedPlaceId}
            selectedCategory={effectiveCategory}
            onCategoryChange={handleCategoryChange}
            meetingType={meetingType}
          />
        </section>
      </div>
    </div>
  );
}

export default function RecommendPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <span className="text-gray-6 text-sm">로딩 중...</span>
        </div>
      }
    >
      <RecommendContent />
    </Suspense>
  );
}

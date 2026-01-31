'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import KakaoMapRecommend from '@/components/map/kakaoMapRecommend';
import { MOCK_RECOMMEND_PLACES } from '@/mock/mockData';

export default function RecommendPage() {
  const router = useRouter();

  // 현재 선택된 장소 ID (기본값: 첫 번째)
  const [selectedPlaceId, setSelectedPlaceId] = useState<number>(1);

  const handleBack = () => {
    router.back();
  };

  const handleOpenKakaoMap = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 버블링 방지
    window.open('https://map.kakao.com', '_blank', 'noopener,noreferrer');
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
            <h2 className="text-gray-9 text-xl font-semibold">합정역 주변 장소 추천</h2>
          </div>

          {/* 모바일 전용 지도 (작게 표시) */}
          <div className="bg-gray-1 relative block aspect-video h-93.5 md:hidden">
            <KakaoMapRecommend className="h-full w-full" />
          </div>

          {/* 리스트 스크롤 영역 */}
          <div className="scrollbar-hide flex-1 overflow-y-auto px-5 pt-5 pb-10 md:px-0 md:pb-0">
            <div className="flex flex-col gap-4 md:gap-5">
              {MOCK_RECOMMEND_PLACES.map((place) => (
                <div
                  key={place.id}
                  onClick={() => setSelectedPlaceId(place.id)}
                  className={`flex cursor-pointer flex-col gap-2 rounded border p-4 ${
                    selectedPlaceId === place.id
                      ? 'border-blue-5 border-2' // 선택 시 파란 테두리
                      : 'border-gray-2 hover:bg-gray-1 bg-white'
                  }`}
                >
                  {/* 상단: 이름 및 카테고리 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 px-0.5">
                      <span className="text-gray-8 text-xl font-semibold">{place.name}</span>
                      <span className="bg-gray-2 text-gray-7 rounded px-2 py-px text-sm font-semibold">
                        {place.category}
                      </span>
                    </div>
                    {/* 공유 아이콘 (이미지에 살짝 보임) */}
                    <button className="text-gray-5 cursor-pointer">
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
                      <span className="text-gray-8 text-[16px]">{place.address}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-5 border-gray-1 shrink-0 rounded border px-2 py-px">
                        도로명
                      </span>
                      <span className="text-gray-8 text-[16px]">{place.roadAddress}</span>
                    </div>
                  </div>

                  {/* 하단 버튼은 조건부 렌더링 */}
                  {selectedPlaceId === place.id ? (
                    <button
                      onClick={handleOpenKakaoMap}
                      className="bg-gray-8 w-full rounded py-1 text-[15px] text-white"
                    >
                      카카오맵에서 보기
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* [RIGHT PANEL] 데스크탑 지도 영역 (새로운 컴포넌트 적용) */}
        <section className="bg-gray-1 hidden h-full flex-1 md:block">
          <KakaoMapRecommend className="h-full w-full" />
        </section>
      </div>
    </div>
  );
}

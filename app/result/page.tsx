'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useOpenModal } from '@/hooks/useOpenModal';
import { useRouter } from 'next/navigation';
import KakaoMapLine from '@/components/map/kakaoMapLine';
import { MOCK_LOCATION_RESULTS } from '@/mock/mockData';

export default function Page() {
  const openModal = useOpenModal();
  const router = useRouter();

  // 현재 선택된 결과 카드 관리 (기본값: 첫 번째)
  const [selectedResultId, setSelectedResultId] = useState<number>(1);

  const handleModifyStart = () => {
    // 출발지 수정 로직 (이전 페이지로 이동 등)
    router.back();
  };

  // 호선별 색상 반환 함수 (예시)
  const getLineColor = (line: string) => {
    switch (line) {
      case '1':
        return 'bg-[#0052A4]'; // 1호선 파랑
      case '2':
        return 'bg-[#3CB44A]'; // 2호선 초록
      case '6':
        return 'bg-[#CD7C2F]'; // 6호선 갈색
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="flex items-center justify-center p-0 md:min-h-[calc(100vh-200px)] md:py-20">
      <div className="flex h-full w-full flex-col bg-white md:h-175 md:w-174 md:flex-row md:gap-4 lg:w-215">
        {/* [LEFT PANEL] 결과 리스트 영역 */}
        <section className="border-gray-1 flex w-full flex-col gap-5 bg-white md:w-77.5 md:gap-3">
          {/* 헤더 섹션 */}
          <div className="px-5 pt-5 md:p-0">
            <div className="flex items-center justify-between">
              <div className="text-gray-9 text-xl font-semibold tracking-[-1.2%]">
                최종 위치 결과 Top 3
              </div>
              <button
                className="text-blue-5 bg-blue-1 hover:bg-blue-2 flex h-7 cursor-pointer items-center gap-1 rounded px-2.5 text-[11px] font-semibold transition-colors"
                type="button"
                onClick={(e) => openModal('SHARE', e)}
              >
                <Image src="/icon/share.svg" alt="공유 아이콘" width={12} height={12} />
                결과 공유하기
              </button>
            </div>
          </div>

          {/* 모바일 전용 지도 영역 */}
          <KakaoMapLine className="bg-gray-1 relative block aspect-video h-93.5 md:hidden" />

          {/* 결과 리스트 & 하단 버튼 */}
          <div className="relative mb-10 flex flex-1 flex-col gap-3 px-5 md:mb-0 md:p-0">
            {/* 리스트 스크롤 영역 */}
            <div className="mb-15 flex-1 overflow-auto">
              <div className="flex h-125 min-h-0 flex-col gap-3 pr-1">
                {MOCK_LOCATION_RESULTS.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => setSelectedResultId(result.id)}
                    className={`flex cursor-pointer flex-col gap-3.75 rounded border bg-white p-5 ${
                      selectedResultId === result.id
                        ? 'border-blue-5 border-2'
                        : 'border-gray-2 hover:bg-gray-1'
                    }`}
                  >
                    {/* 카드 헤더: 역 이름 & 시간 */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-10 text-lg font-semibold">{result.station}</span>
                      <span className="text-gray-6 text-[13px] font-normal">
                        이동시간
                        <span className="text-blue-5 ml-1.75 text-lg font-semibold">
                          {result.time}
                        </span>
                      </span>
                    </div>

                    {/* 환승 경로 (호선 아이콘) */}
                    <div className="text-gray-6 flex items-center gap-3 text-[13px]">
                      <span>내 환승경로</span>
                      <div className="flex items-center">
                        {result.lines.map((line, idx) => (
                          <div key={idx} className="flex items-center">
                            {/* 호선 원형 아이콘 */}
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] text-white ${getLineColor(line)}`}
                            >
                              {line}
                            </span>
                            <span className="text-gray-10 ml-1 text-sm font-semibold">
                              {line}호선
                            </span>
                            {idx < result.lines.length - 1 && (
                              <Image
                                src="/icon/rightarrow.svg"
                                alt="화살표"
                                width={13}
                                height={22}
                                className="text-gray-6 mx-1.75 w-auto"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 모임원 경로 보기 버튼 (카드 내부) */}
                    <button
                      onClick={(e) => openModal('TRANSFER', e)}
                      className="bg-gray-8 h-8 w-full cursor-pointer rounded py-1 text-[15px] font-normal text-white"
                    >
                      모임원 환승경로 보기
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* [수정됨] 하단 버튼: 내 출발지 수정하기 (파란색) */}
            <button
              onClick={handleModifyStart}
              className="bg-blue-5 hover:bg-blue-8 absolute right-5 bottom-0 left-5 h-12 rounded text-lg font-semibold text-white transition-transform active:scale-[0.98] md:right-0 md:left-0"
            >
              내 출발지 수정하기
            </button>
          </div>
        </section>

        {/* [RIGHT PANEL] 데스크탑 지도 영역 */}
        <section className="hidden h-full flex-1 bg-gray-100 md:block">
          <KakaoMapLine className="h-full w-full" />
        </section>
      </div>
    </div>
  );
}

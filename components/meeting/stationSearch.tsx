'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getChoseong, disassemble } from 'es-hangul';

// [NEW] Props 타입 정의
interface StationSearchProps {
  stations: string[]; // 역 이름 배열
  selectedStation: string | null; // 선택된 역 (없으면 null)
  onSelect: (station: string | null) => void; // 선택/해제 시 실행할 함수
}

export default function StationSearch({
  stations = [],
  selectedStation,
  onSelect,
}: StationSearchProps) {
  const [searchValue, setSearchValue] = useState<string>('');

  // 3단 콤보 필터링 로직
  const filteredStations = searchValue
    ? stations.filter(
        (station) =>
          station.includes(searchValue) ||
          getChoseong(station).includes(searchValue) ||
          disassemble(station).includes(disassemble(searchValue))
      )
    : [];

  const handleSelect = (station: string) => {
    onSelect(station);
    setSearchValue('');
  };

  const handleRemove = () => {
    onSelect(null);
  };

  return (
    <div className="relative z-20 px-5 md:p-0">
      <h3 className="text-gray-9 mb-3 text-xl font-semibold">내 출발지</h3>
      <div className="relative w-full">
        {selectedStation ? (
          // [CASE 1] 선택 완료 상태
          <div className="border-gray-2 text-gray-8 flex h-14 w-full items-center justify-between rounded border bg-white p-5 text-[17px] font-semibold">
            <span>{selectedStation}</span>
            <button
              onClick={handleRemove}
              className="text-gray-4 p-1 hover:text-gray-600"
              type="button"
            >
              <Image
                className="text-gray-6 absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer p-1.25"
                src="/icon/x.svg"
                alt="취소 아이콘"
                width={20}
                height={20}
              />
            </button>
          </div>
        ) : (
          // [CASE 2] 검색 입력 상태
          <>
            <div className="relative">
              <input
                type="text"
                placeholder="출발역을 검색해주세요"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="bg-gray-1 placeholder:text-gray-4 border-gray-2 focus:border-blue-5 h-10 w-full rounded border py-2 pl-3 text-[15px] text-gray-900 transition-all outline-none"
              />
              <Image
                className="text-gray-6 pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2"
                src="/icon/search.svg"
                alt="돋보기 아이콘"
                width={20}
                height={20}
              />
            </div>

            {/* 자동완성 드롭다운 */}
            {searchValue && filteredStations.length > 0 && (
              <ul className="border-gray-2 absolute top-full left-0 z-50 mt-2 max-h-50 w-full overflow-y-auto rounded border bg-white p-2">
                {filteredStations.map((station) => (
                  <li
                    key={station}
                    onClick={() => handleSelect(station)}
                    className="text-gray-9 hover:bg-gray-2 cursor-pointer rounded px-3 py-2.5 text-[15px] transition-colors"
                  >
                    {station}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}

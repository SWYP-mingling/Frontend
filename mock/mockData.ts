import { getRandomHexColor } from '@/lib/color';

// 기존 데이터 리스트 (색상 정보 제외)
const RAW_PARTICIPANTS = [
  { id: 1, name: '안', station: '홍대입구역', lat: 37.557527, lng: 126.924466, status: 'pending' },
  { id: 2, name: '손', station: '성수역', lat: 37.544581, lng: 127.056002, status: 'pending' },
  { id: 3, name: '김', station: '강남역', lat: 37.498095, lng: 127.02761, status: 'done' },
  { id: 4, name: '이', station: '건대입구역', lat: 37.540417, lng: 127.069177, status: 'done' },
  { id: 5, name: '최', station: '여의도역', lat: 37.521571, lng: 126.924292, status: 'pending' },
  { id: 6, name: '박', station: '잠실역', lat: 37.513261, lng: 127.100159, status: 'done' },
  { id: 7, name: '정', station: '혜화역', lat: 37.582236, lng: 127.001851, status: 'pending' },
  { id: 8, name: '조', station: '용산역', lat: 37.529849, lng: 126.964561, status: 'done' },
];

// 랜덤 색상을 주입하여 export
export const MOCK_PARTICIPANTS = RAW_PARTICIPANTS.map((p, idx) => ({
  ...p,
  // 요청하신 S:65, B:100 고정 랜덤 색상 생성
  hexColor: getRandomHexColor(idx),
}));

// [2] 목업 데이터: 검색 가능한 역 목록 (위도, 경도 포함)
export const MOCK_SEARCH_STATIONS = [
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
  { name: '강남역', lat: 37.498095, lng: 127.02761 },
  { name: '홍대입구역', lat: 37.557527, lng: 126.924466 },
  { name: '서울역', lat: 37.555946, lng: 126.972317 },
  { name: '성수역', lat: 37.544581, lng: 127.056002 },
  { name: '건대입구역', lat: 37.540417, lng: 127.069177 },
  { name: '여의도역', lat: 37.521571, lng: 126.924292 },
  { name: '잠실역', lat: 37.513261, lng: 127.100159 },
  { name: '혜화역', lat: 37.582236, lng: 127.001851 },
  { name: '용산역', lat: 37.529849, lng: 126.964561 },
  { name: '구의역', lat: 37.537077, lng: 127.085916 },
  { name: '굽은다리역', lat: 37.54547, lng: 127.142838 },
  { name: '금정역', lat: 37.372224, lng: 126.943431 },
  { name: '광교(경기대)역', lat: 37.30211, lng: 127.045615 },
  { name: '검단오류역', lat: 37.592582, lng: 126.627685 },
  { name: '월드컵경기장역', lat: 37.5699, lng: 126.899 },
  { name: '디지털미디어시티역', lat: 37.5772, lng: 126.9012 },
  { name: '공덕역', lat: 37.5432, lng: 126.9516 },
  { name: '이수역', lat: 37.4868, lng: 126.9819 },
  { name: '동작역', lat: 37.5028, lng: 126.9803 },
  { name: '이촌역', lat: 37.5226, lng: 126.9734 },
  { name: '신용산역', lat: 37.5292, lng: 126.9678 },
  { name: '삼각지역', lat: 37.5348, lng: 126.9735 },
  { name: '숙대입구역', lat: 37.5447, lng: 126.9721 },
];

// [3] 목업 데이터: 최종 위치 결과
export const MOCK_LOCATION_RESULTS = [
  {
    id: 1,
    station: '합정역',
    time: '30분',
    lines: ['1', '2'], // 1호선, 2호선
    isSelected: true, // 현재 선택된 상태 시뮬레이션
  },
  {
    id: 2,
    station: '합정역',
    time: '30분',
    lines: ['1', '2'], // 1호선, 2호선
    isSelected: false, // 현재 선택된 상태 시뮬레이션
  },
  {
    id: 3,
    station: '합정역',
    time: '30분',
    lines: ['1', '2'], // 1호선, 2호선
    isSelected: false, // 현재 선택된 상태 시뮬레이션
  },
];

// [4]: 목업 데이터: 환승 경로 데이터 (시안 기반)
export const MOCK_TRANSFER_ROUTES = [
  {
    id: 1,
    name: '안가연',
    startStation: '홍대입구역',
    lines: ['1', '2'], // 1호선 -> 2호선
    time: '30분',
  },
  {
    id: 2,
    name: '안가연',
    startStation: '홍대입구역',
    lines: ['1', '2'],
    time: '30분',
  },
  {
    id: 3,
    name: '안가연',
    startStation: '홍대입구역',
    lines: ['1', '2'],
    time: '30분',
  },
  {
    id: 4,
    name: '안가연',
    startStation: '홍대입구역',
    lines: ['1', '2'],
    time: '30분',
  },
];

// [5]: 목업 데이터: 합정역 데이터와 실제 3개의 역(길동역, 월드컵경기장역, 사당역)에서 서울역을 가는 실제 지하철 경로

export const HAPJUNG_STATION = { name: '합정역', lat: 37.548927, lng: 126.91353 };

export const REAL_SUBWAY_PATHS = [
  {
    id: 1,
    name: '안',
    originName: '길동역',
    time: '48분',
    color: '#8B5CF6', // 5호선 보라색 계열 유지
    // 경로: 길동(5) -> 왕십리 -> 공덕(6호선 환승) -> 합정
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
      { name: '을지로4가역', lat: 37.5666, lng: 126.998 },
      { name: '을지로3가역', lat: 37.5663, lng: 126.9916 },
      { name: '광화문역', lat: 37.571, lng: 126.9768 },
      { name: '서대문역', lat: 37.5657, lng: 126.9666 },
      { name: '충정로역', lat: 37.5599, lng: 126.9637 },
      { name: '애오개역', lat: 37.5535, lng: 126.9566 },
      { name: '공덕역', lat: 37.5432, lng: 126.9516 }, // 6호선 환승 가정
      { name: '대흥역', lat: 37.5477, lng: 126.9424 },
      { name: '광흥창역', lat: 37.5475, lng: 126.9319 },
      { name: '상수역', lat: 37.5477, lng: 126.9229 },
      { name: '합정역', lat: 37.548927, lng: 126.91353 },
    ],
  },
  {
    id: 2,
    name: '김',
    originName: '월드컵경기장역',
    time: '7분',
    color: '#059669', // 6호선 라인이나 구분을 위한 초록색 유지
    // 경로: 월드컵경기장(6) -> 합정 (직통)
    stations: [
      { name: '월드컵경기장역', lat: 37.5695, lng: 126.8993 },
      { name: '마포구청역', lat: 37.5635, lng: 126.9033 },
      { name: '망원역', lat: 37.556, lng: 126.91 },
      { name: '합정역', lat: 37.548927, lng: 126.91353 },
    ],
  },
  {
    id: 3,
    name: '이',
    originName: '사당역',
    time: '22분',
    color: '#3B82F6', // 2호선이지만 구분을 위한 파란색 유지
    // 경로: 사당(2) -> 대림 -> 신도림 -> 합정 (2호선 내선순환)
    stations: [
      { name: '사당역', lat: 37.4765, lng: 126.9816 },
      { name: '낙성대역', lat: 37.4769, lng: 126.9637 },
      { name: '서울대입구역', lat: 37.4812, lng: 126.9527 },
      { name: '봉천역', lat: 37.4824, lng: 126.9417 },
      { name: '신림역', lat: 37.4842, lng: 126.9296 },
      { name: '신대방역', lat: 37.4875, lng: 126.9131 },
      { name: '구로디지털단지역', lat: 37.4852, lng: 126.9016 },
      { name: '대림역', lat: 37.4925, lng: 126.895 },
      { name: '신도림역', lat: 37.5087, lng: 126.8913 },
      { name: '문래역', lat: 37.5175, lng: 126.8948 },
      { name: '영등포구청역', lat: 37.5257, lng: 126.8966 },
      { name: '당산역', lat: 37.5349, lng: 126.9025 },
      { name: '합정역', lat: 37.548927, lng: 126.91353 },
    ],
  },
];

// [6] 목업 데이터: 추천 장소 리스트 데이터 (이미지 기반)
export const MOCK_RECOMMEND_PLACES = [
  {
    id: 1,
    name: '조선옥',
    category: '식당',
    description: '연탄불 한우갈비 전문점',
    phone: '0507-1327-3659',
    address: '서울특별시 중구 을지로 3가 229-1',
    roadAddress: '서울특별시 중구 을지로15길 6-5',
    lat: 37.5552,
    lng: 126.9715,
  },
  {
    id: 2,
    name: '스타벅스',
    category: '카페',
    description: '분위기 좋은 넓은 카페',
    phone: '1522-3232',
    address: '서울특별시 마포구 양화로 100',
    roadAddress: '서울특별시 마포구 양화로 100',
    lat: 37.5538,
    lng: 126.9725,
  },
  {
    id: 3,
    name: '문화역서울284',
    category: '놀거리',
    description: '복합문화예술공간',
    phone: '02-3407-3500',
    address: '서울특별시 중구 통일로 1',
    roadAddress: '서울특별시 중구 통일로 1',
    lat: 37.5565,
    lng: 126.971,
  },
];

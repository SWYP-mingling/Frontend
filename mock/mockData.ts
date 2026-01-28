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
];

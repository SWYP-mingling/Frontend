// 목 데이터 (참여자 목록)
export const MOCK_PARTICIPANTS = [
  {
    id: 1,
    name: '안',
    station: '홍대입구역',
    lat: 37.557527,
    lng: 126.924466,
    status: 'pending',
    color: 'bg-blue-500',
    hexColor: '#3B82F6', // Tailwind Blue-500
  },
  {
    id: 2,
    name: '손',
    station: '성수역',
    lat: 37.544581,
    lng: 127.056002,
    status: 'pending',
    color: 'bg-orange-400',
    hexColor: '#FB923C', // Tailwind Orange-400
  },
  {
    id: 3,
    name: '김',
    station: '강남역',
    lat: 37.498095,
    lng: 127.02761,
    status: 'done',
    color: 'bg-red-500',
    hexColor: '#EF4444', // Tailwind Red-500
  },
  {
    id: 4,
    name: '이',
    station: '건대입구역',
    lat: 37.540417,
    lng: 127.069177,
    status: 'done',
    color: 'bg-purple-600',
    hexColor: '#9333EA', // Tailwind Purple-600
  },
];

// [NEW] 목 데이터 (검색용 역 리스트) - 실제로는 API 등에서 가져올 데이터
export const MOCK_SEARCH_STATIONS = [
  '검단오류(검단산업단지)',
  '광교(경기대)',
  '구의(광진구청)',
  '굽은다리(강동구민회관앞)',
  '금정역',
  '강남역',
  '홍대입구역',
  '서울역',
];

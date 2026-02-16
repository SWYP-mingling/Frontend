const PALETTE = [
  '#FF6B6B',
  '#54A0FF',
  '#1DD1A1',
  '#FF9F43',
  '#5F27CD',
  '#48DBFB',
  '#FF9FF3',
  '#00D2D3',
  '#222F3E',
  '#8395A7',
  '#C4E538',
  '#FDA7DF',
  '#D980FA',
  '#1289A7',
  '#B53471',
  '#EE5A24',
  '#009432',
  '#0652DD',
  '#9980FA',
  '#1B1464',
];

export const getRandomHexColor = (name: string, meetingId: string = '') => {
  // 이름 + 모임ID를 합쳐서 고유 키 생성
  const key = name + meetingId;

  // DJB2 해시 알고리즘 (문자열을 아주 무작위한 숫자로 변환)
  let hash = 5381;
  for (let i = 0; i < key.length; i++) {
    // hash * 33 + c
    hash = (hash << 5) + hash + key.charCodeAt(i);
  }

  // 해시값을 양수로 바꾸고 팔레트 개수(20)로 나눈 나머지 사용
  // 결과는 무조건 0 ~ 19 사이의 정수
  const index = Math.abs(hash) % PALETTE.length;

  return PALETTE[index];
};

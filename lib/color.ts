// lib/color.ts

// HSB -> HEX 변환 함수 (기존과 동일)
const hsvToHex = (h: number, s: number, v: number) => {
  s /= 100;
  v /= 100;
  let r = 0,
    g = 0,
    b = 0;
  let i = Math.floor(h / 60);
  let f = h / 60 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * [핵심] 입력받은 seed(숫자 또는 문자열)를 기반으로 고정된 랜덤 색상을 반환
 * 같은 seed를 넣으면 항상 같은 색이 나옵니다.
 */
export const getRandomHexColor = (seed: number | string) => {
  const strSeed = String(seed);
  let hash = 0;

  // 해시 생성 (문자열을 숫자로)
  for (let i = 0; i < strSeed.length; i++) {
    hash = strSeed.charCodeAt(i) + ((hash << 5) - hash);
  }

  // [수정된 부분]
  // 해시값에 137(서로 겹치지 않게 하는 마법의 숫자)을 곱해서 각도를 크게 벌립니다.
  const h = Math.abs((hash * 137) % 360);

  return hsvToHex(h, 65, 100);
};

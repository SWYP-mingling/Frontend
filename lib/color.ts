// lib/color.ts

// HSB -> HEX 변환 함수 (기존과 동일)
const hsvToHex = (h: number, s: number, v: number) => {
  s /= 100;
  v /= 100;
  let r = 0,
    g = 0,
    b = 0;
  const i = Math.floor(h / 60);
  const f = h / 60 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

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

export const getRandomHexColor = (seed: number | string) => {
  const strSeed = String(seed);
  let hash = 0;

  // 해시 생성 (문자열을 숫자로)
  for (let i = 0; i < strSeed.length; i++) {
    hash = strSeed.charCodeAt(i) + ((hash << 5) - hash);
  }

  // 해시값에 137(겹치지 않게 하는 숫자)을 곱해서 각도를 크게 벌립니다.
  const h = Math.abs((hash * 50) % 360);

  return hsvToHex(h, 65, 100);
};

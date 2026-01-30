import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      // 1️⃣ [예외 처리] 백엔드에 실제로 '/api'가 붙어있는 친구들 (예: status)
      // 이 규칙이 위에 있어야 먼저 적용됩니다.
      {
        source: '/api/status',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/status`,
      },

      // 2️⃣ [일반 처리] 나머지 모든 요청은 '/api'를 떼고 보냄
      // 프론트 '/api/sample/post' -> 백엔드 '/sample/post'
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`, // ✨ 여기서 '/api' 제거!
      },
    ];
  },
};

export default nextConfig;

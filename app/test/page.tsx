'use client';

import { useState, useEffect } from 'react';

interface StatusData {
  server_time: string;
  database: string;
  redis: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function TestPage() {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 페이지 새로고침 방지 (필수!)
    setLoading(true);

    try {
      // --------------------------------------------------------
      // 1단계: POST 요청 (데이터 보내기)
      // --------------------------------------------------------
      // ※ 주의: 백엔드 개발자분께 'POST 주소'와 '보낼 JSON 형태'를 꼭 물어봐야 합니다.
      // 예시: 주소는 /api/sample/create, 보낼 키값은 "content"라고 가정
      const postResponse = await fetch('/api/sample/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1,
          name: '홍길동',
          createdAt: new Date().toISOString(),
        }),
      });

      if (!postResponse.ok) {
        throw new Error(`POST 실패: ${postResponse.status}`);
      }

      console.log('POST 성공! 이제 GET으로 확인합니다.');

      // --------------------------------------------------------
      // 2단계: GET 요청 (데이터 확인하기)
      // --------------------------------------------------------
      // 아까 테스트했던 GET 주소 사용
      const getResponse = await fetch('/sample/get?userId=1');

      if (!getResponse.ok) {
        throw new Error(`GET 실패: ${getResponse.status}`);
      }

      const data = await getResponse.json();
      setResult(data); // 화면에 뿌리기 위해 상태 저장
      alert('테스트 성공! 데이터를 확인하세요.');
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch(`/api/status`)
      .then((response) => {
        if (!response.ok) throw new Error('서버 응답 에러');
        return response.json();
      })
      .then((data) => {
        setStatus(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [API_URL]);

  // 로딩 상태 디자인
  if (loading) {
    return (
      <div className="flex min-h-50 items-center justify-center text-lg font-medium text-gray-500">
        서버 상태 확인 중...
      </div>
    );
  }

  // 에러 상태 디자인
  if (error) {
    return (
      <div className="mx-auto mt-10 max-w-lg rounded-lg border border-red-200 bg-red-50 p-5 text-center text-red-600">
        <p className="font-bold">에러 발생</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!status) return null;

  return (
    <div className="mx-auto my-10 max-w-150 px-4">
      {/* 카드 컨테이너 */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* 헤더 */}
        <h2 className="mb-4 text-2xl font-bold text-gray-900">시스템 상태 모니터링</h2>

        <hr className="my-5 border-gray-100" />

        {/* 컨텐츠 영역 */}
        <div className="flex flex-col gap-3 text-lg">
          {/* 서버 시간 */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-gray-700">
              📅 <strong>서버 시간</strong>
            </span>
            <span className="text-gray-900">{new Date(status.server_time).toLocaleString()}</span>
          </div>

          {/* Database 상태 */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-gray-700">
              🗄️ <strong>Database</strong>
            </span>
            <span
              className={`font-bold ${
                status.database.includes('Connected') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {status.database}
            </span>
          </div>

          {/* Redis 상태 */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-gray-700">
              🚀 <strong>Redis</strong>
            </span>
            <span
              className={`font-bold ${
                status.redis.includes('Connected') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {status.redis}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-gray-900">API 연동 테스트 (POST + GET)</h2>

              {/* 폼 영역 */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 font-bold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? '통신 중...' : '전송하고 결과 보기'}
                </button>
              </form>

              {/* 결과 표시 영역 */}
              {result && (
                <div className="mt-6 rounded-lg bg-gray-100 p-4">
                  <h3 className="mb-2 font-bold text-gray-800">✅ 서버 응답 결과:</h3>
                  <pre className="overflow-auto text-sm text-gray-600">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';

export default function EnvCheckPage() {
  const [envData, setEnvData] = useState<any>({
    loading: true,
    data: null,
    error: null
  });

  useEffect(() => {
    const checkEnv = async () => {
      try {
        const res = await fetch('/api/env-check');
        const data = await res.json();
        setEnvData({
          loading: false,
          data,
          error: null
        });
      } catch (error: any) {
        setEnvData({
          loading: false,
          data: null,
          error: error.message
        });
      }
    };

    checkEnv();
  }, []);

  // 클라이언트 측에서 직접 환경 변수에 접근
  const clientEnvVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '설정되지 않음',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
      ? '(값이 설정됨)' 
      : '설정되지 않음'
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">환경 변수 확인</h1>
      
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-3">클라이언트 측 환경 변수</h2>
        <pre className="bg-gray-100 p-3 rounded text-sm">
          {JSON.stringify(clientEnvVars, null, 2)}
        </pre>
      </div>

      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-3">서버 측 환경 변수</h2>
        {envData.loading ? (
          <p>로딩 중...</p>
        ) : envData.error ? (
          <div className="bg-red-50 p-3 rounded text-red-600">
            <p>오류: {envData.error}</p>
          </div>
        ) : (
          <pre className="bg-gray-100 p-3 rounded text-sm">
            {JSON.stringify(envData.data, null, 2)}
          </pre>
        )}
      </div>

      <div className="p-4 border rounded bg-blue-50">
        <h2 className="text-lg font-semibold mb-3">문제 해결 방법</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>환경 변수는 <code>.env.local</code> 파일에 정확한 형식으로 저장되어야 합니다.</li>
          <li>각 변수는 <code>KEY=VALUE</code> 형식이어야 하며, 따옴표나 공백이 없어야 합니다.</li>
          <li>환경 변수 이름과 값 사이, 또는 줄 끝에 공백이 없어야 합니다.</li>
          <li>환경 변수를 변경한 후에는 서버를 재시작해야 합니다.</li>
          <li>다른 프로세스가 <code>.env.local</code> 파일을 잠그지 않았는지 확인하세요.</li>
        </ol>
      </div>
    </div>
  );
} 
'use client';

import React, { useState, useEffect } from 'react';

export default function CheckConnection() {
  const [status, setStatus] = useState({
    loading: true,
    connected: undefined,
    message: undefined,
    error: undefined,
    data: undefined
  });

  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    setStatus({ loading: true });
    try {
      // API 호출로 연결 상태 확인
      const response = await fetch('/api/check-db');
      const data = await response.json();
      
      if (response.ok) {
        setStatus({
          loading: false,
          connected: true,
          message: data.message,
          data: data.data
        });
      } else {
        setStatus({
          loading: false,
          connected: false,
          message: data.message,
          error: data.error
        });
      }
    } catch (error: any) {
      setStatus({
        loading: false,
        connected: false,
        error: error.message || '알 수 없는 오류가 발생했습니다.'
      });
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">데이터베이스 연결 확인</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        {status.loading ? (
          <div className="text-center py-4">
            <p>연결 확인 중...</p>
          </div>
        ) : status.connected ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <h2 className="text-green-700 font-semibold text-lg mb-2">✅ 연결됨</h2>
            <p className="text-green-600 mb-2">{status.message}</p>
            <pre className="bg-gray-100 p-3 rounded overflow-auto text-sm">
              {JSON.stringify(status.data, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h2 className="text-red-700 font-semibold text-lg mb-2">❌ 연결 실패</h2>
            <p className="text-red-600 mb-2">{status.message}</p>
            {status.error && (
              <div className="mt-2">
                <p className="font-medium">오류 메시지:</p>
                <pre className="bg-gray-100 p-3 rounded overflow-auto text-sm text-red-500">
                  {status.error}
                </pre>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-6">
          <button
            onClick={checkConnection}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            다시 확인
          </button>
        </div>
      </div>
      
      <div className="mt-8 p-6 bg-white shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-4">환경 변수 설정 방법</h2>
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <p className="text-sm mb-2">1. 프로젝트 루트에 <code>.env.local</code> 파일을 생성하세요.</p>
          <pre className="bg-gray-800 text-white p-3 rounded text-sm">
{`# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key`}
          </pre>
        </div>
        <p className="text-sm text-gray-700">
          2. Supabase 프로젝트 설정에서 URL과 anon key를 복사하여 위 파일에 넣으세요.<br />
          3. 개발 서버를 재시작한 후 이 페이지를 다시 확인하세요.
        </p>
      </div>
    </div>
  );
} 
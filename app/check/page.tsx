'use client';

import React, { useState } from 'react';

interface ConnectionStatus {
  loading: boolean;
  connected: boolean | null;
  message: string;
  error: string | null;
  data: any | null;
}

export default function CheckConnection() {
  const [status, setStatus] = useState<ConnectionStatus>({
    loading: false,
    connected: null,
    message: '',
    error: null,
    data: null
  });

  async function checkConnection() {
    setStatus(prev => ({ ...prev, loading: true }));
    try {
      // API 호출로 연결 상태 확인
      const response = await fetch('/api/check-db');
      const data = await response.json();

      setStatus({
        loading: false,
        connected: data.connected,
        message: data.message,
        error: null,
        data: data
      });
    } catch (error) {
      setStatus({
        loading: false,
        connected: false,
        message: '연결 확인 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        data: null
      });
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">데이터베이스 연결 상태 확인</h1>
      
      <button
        onClick={checkConnection}
        disabled={status.loading}
        className={`px-4 py-2 rounded ${
          status.loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white`}
      >
        {status.loading ? '확인 중...' : '연결 확인'}
      </button>

      {status.message && (
        <div className={`mt-4 p-4 rounded ${
          status.connected
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          <p>{status.message}</p>
          {status.error && (
            <p className="mt-2 text-sm text-red-600">{status.error}</p>
          )}
        </div>
      )}

      {status.data && (
        <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
          {JSON.stringify(status.data, null, 2)}
        </pre>
      )}
    </div>
  );
} 
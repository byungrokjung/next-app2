'use client';

import React, { useState, useEffect } from 'react';

export default function SetupPage() {
  const [status, setStatus] = useState({
    loading: true,
    tableExists: false,
    connection: { url: '', hasKey: false },
    error: null,
    createAttempted: false,
    createResult: null
  });

  useEffect(() => {
    checkStatus();
  }, []);

  async function checkStatus() {
    setStatus(prev => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/debug');
      const data = await res.json();
      
      setStatus(prev => ({
        ...prev,
        loading: false,
        tableExists: data.tableExists,
        connection: data.connection,
        error: null
      }));
    } catch (error: any) {
      setStatus(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  }

  async function createTable() {
    setStatus(prev => ({ ...prev, loading: true, createAttempted: true }));
    try {
      const res = await fetch('/api/debug', {
        method: 'POST'
      });
      const data = await res.json();
      
      setStatus(prev => ({
        ...prev,
        loading: false,
        createResult: data,
        error: data.error || null
      }));
      
      // 성공하면 상태 다시 확인
      if (data.success) {
        setTimeout(checkStatus, 1000);
      }
    } catch (error: any) {
      setStatus(prev => ({
        ...prev,
        loading: false,
        createResult: { success: false, error: error.message },
        error: error.message
      }));
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API 키 관리 시스템 설정</h1>

      {/* 상태 정보 */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">시스템 상태</h2>
        
        {status.loading ? (
          <div className="flex justify-center my-4">
            <div className="animate-pulse text-blue-500">
              상태 확인 중...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Supabase 연결</h3>
              <div className={`text-sm rounded-full px-2 py-1 text-white inline-block ${status.connection.hasKey ? 'bg-green-500' : 'bg-red-500'}`}>
                {status.connection.hasKey ? '연결됨' : '연결 안됨'}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                URL: {status.connection.url.substring(0, 15)}...
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">API 키 테이블</h3>
              <div className={`text-sm rounded-full px-2 py-1 text-white inline-block ${status.tableExists ? 'bg-green-500' : 'bg-yellow-500'}`}>
                {status.tableExists ? '존재함' : '존재하지 않음'}
              </div>
              {!status.tableExists && (
                <p className="text-xs text-gray-500 mt-2">
                  API 키를 저장할 테이블을 생성해야 합니다.
                </p>
              )}
            </div>
          </div>
        )}
        
        {status.error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
            <p className="font-medium">오류 발생:</p>
            <p className="text-sm">{status.error}</p>
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <button 
            onClick={checkStatus}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            상태 다시 확인
          </button>
        </div>
      </div>

      {/* 테이블 생성 패널 */}
      {!status.tableExists && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API 키 테이블 생성</h2>
          
          <div className="mb-4 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              API 키를 관리하기 위해서는 Supabase 데이터베이스에 테이블이 필요합니다.
              아래 버튼을 클릭하여 자동으로 테이블을 생성하거나, Supabase 대시보드에서 직접 생성할 수 있습니다.
            </p>
          </div>
          
          {status.createAttempted && status.createResult && !status.createResult.success && (
            <div className="mb-4 p-4 bg-yellow-50 rounded-md text-sm">
              <p className="font-medium text-yellow-800 mb-2">
                자동 생성이 실패했습니다. Supabase 대시보드에서 직접 테이블을 생성해 주세요.
              </p>
              <div className="bg-gray-800 text-white p-3 rounded font-mono text-xs overflow-auto">
                {status.createResult.tableDDL || `
CREATE TABLE api_keys (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  type TEXT DEFAULT 'development',
  limit_enabled BOOLEAN DEFAULT FALSE,
  limit INTEGER
);`}
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              onClick={createTable}
              disabled={status.loading}
              className={`px-4 py-2 rounded-md text-white ${status.loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
            >
              {status.loading ? '처리 중...' : '테이블 자동 생성'}
            </button>
          </div>
        </div>
      )}

      {/* 설정 완료 패널 */}
      {status.tableExists && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-800">설정 완료!</h2>
          <p className="text-green-700 mb-4">
            API 키 관리 시스템을 사용할 준비가 되었습니다.
          </p>
          <div className="flex justify-center mt-4">
            <a 
              href="/api-keys" 
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              API 키 관리 대시보드로 이동
            </a>
          </div>
        </div>
      )}

      {/* 트러블슈팅 가이드 */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">트러블슈팅 가이드</h2>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-md">
            <h3 className="font-medium mb-2">Supabase 연결 문제</h3>
            <ol className="list-decimal pl-5 text-sm space-y-2">
              <li>프로젝트 루트의 <code>.env.local</code> 파일에 Supabase URL과 Anon Key가 정확히 설정되어 있는지 확인하세요.</li>
              <li>서버를 재시작한 후 다시 시도하세요.</li>
              <li>Supabase 프로젝트가 활성 상태인지 확인하세요.</li>
            </ol>
          </div>
          
          <div className="p-4 border rounded-md">
            <h3 className="font-medium mb-2">테이블 생성 문제</h3>
            <ol className="list-decimal pl-5 text-sm space-y-2">
              <li>Supabase 계정에 충분한 권한이 있는지 확인하세요.</li>
              <li>Supabase 대시보드의 "Table Editor"에서 직접 테이블을 생성할 수 있습니다.</li>
              <li>RLS(Row Level Security) 설정이 API 키 테이블에 대한 접근을 허용하는지 확인하세요.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 
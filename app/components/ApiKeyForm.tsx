'use client';

import { useState } from 'react';
import Notification from './Notification';

type ApiKeyFormProps = {
  onSuccess?: () => void;
};

export default function ApiKeyForm({ onSuccess }: ApiKeyFormProps) {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const validateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setNotification({
        message: 'API 키를 입력해주세요',
        type: 'error'
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/protected', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      if (response.ok) {
        setNotification({
          message: 'valid api key, /protected can be accessed',
          type: 'success'
        });
        if (onSuccess) onSuccess();
      } else {
        setNotification({
          message: 'invalid api key',
          type: 'error'
        });
      }
    } catch (error) {
      setNotification({
        message: '요청 중 오류가 발생했습니다',
        type: 'error'
      });
      console.error('API 키 검증 중 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">API 키 검증</h2>
        
        <form onSubmit={validateApiKey}>
          <div className="mb-4">
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
              API 키를 입력하세요
            </label>
            <input
              id="apiKey"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="tvly-dev-xxxxxxxxx"
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                검증 중...
              </>
            ) : '검증하기'}
          </button>
        </form>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>API 키를 입력하고 검증 버튼을 클릭하면 키의 유효성을 확인합니다.</p>
        </div>
      </div>
    </div>
  );
} 
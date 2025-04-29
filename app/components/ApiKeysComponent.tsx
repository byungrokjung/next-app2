'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, EyeIcon, ClipboardIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { fetchApiKeys, createApiKey, deleteApiKey, ApiKey } from '../../lib/apiService';

export default function ApiKeysComponent() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadApiKeys() {
      try {
        setIsLoading(true);
        const keys = await fetchApiKeys();
        setApiKeys(keys);
        setError(null);
      } catch (err) {
        setError('API 키를 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadApiKeys();
  }, []);

  const handleCreateKey = async () => {
    try {
      const newKey = await createApiKey('default');
      if (newKey) {
        setApiKeys(prev => [newKey, ...prev]);
      }
    } catch (err) {
      setError('API 키 생성 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      const success = await deleteApiKey(id);
      if (success) {
        setApiKeys(prev => prev.filter(key => key.id !== id));
      }
    } catch (err) {
      setError('API 키 삭제 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    // 복사 성공 알림 표시 (여기서는 간단하게 생략)
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">API Keys</h2>
        <button 
          className="border border-gray-300 rounded-md p-1"
          onClick={handleCreateKey}
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
      
      <p className="text-gray-600 mb-6">The key is used to authenticate your requests to the <a href="#" className="text-blue-600 hover:underline">Research API</a>. To learn more, see the <a href="#" className="text-blue-600 hover:underline">documentation</a> page.</p>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin h-8 w-8 border-2 border-gray-500 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">NAME</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">TYPE</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">USAGE</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">KEY</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">OPTIONS</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    API 키가 없습니다. 새 키를 만들어보세요.
                  </td>
                </tr>
              ) : (
                apiKeys.map(key => (
                  <tr key={key.id} className="border-b border-gray-200">
                    <td className="py-4 px-4">{key.name}</td>
                    <td className="py-4 px-4">{key.type}</td>
                    <td className="py-4 px-4">{key.usage}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <code className="text-gray-600 bg-gray-100 px-2 py-1 rounded font-mono">
                          {key.key.substring(0, 10)}***********************
                        </code>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-3">
                        <button 
                          className="text-gray-500 hover:text-gray-700"
                          title="보기"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button 
                          className="text-gray-500 hover:text-gray-700" 
                          onClick={() => handleCopyKey(key.key)}
                          title="복사"
                        >
                          <ClipboardIcon className="h-5 w-5" />
                        </button>
                        <button 
                          className="text-gray-500 hover:text-gray-700"
                          title="편집"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button 
                          className="text-gray-500 hover:text-gray-700" 
                          onClick={() => handleDeleteKey(key.id)}
                          title="삭제"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 
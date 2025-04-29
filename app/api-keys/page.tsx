'use client';
import React, { useState, useEffect } from 'react';
import { ClipboardDocumentIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, PlusIcon, EyeIcon, ClipboardIcon } from "@heroicons/react/24/outline";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at?: string;
  createdAt?: string;
  type: 'production' | 'development';
  limit_enabled?: boolean;
  limitEnabled?: boolean;
  limit: number;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedType, setSelectedType] = useState<'production'|'development'>('development');
  const [limitEnabled, setLimitEnabled] = useState(false);
  const [limit, setLimit] = useState(100);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<'production'|'development'>('development');
  const [editLimitEnabled, setEditLimitEnabled] = useState(false);
  const [editLimit, setEditLimit] = useState(100);

  // API 키 목록을 가져오는 함수
  async function fetchKeys() {
    try {
      const res = await fetch('/api/api-keys');
      if (!res.ok) throw new Error('API 응답 오류');
      const data: ApiKey[] = await res.json();
      setKeys(data);
    } catch (error) {
      console.error(error);
      alert('API 키 목록을 가져오지 못했습니다.');
    }
  }

  useEffect(() => {
    fetchKeys();
  }, []);

  // 기존 createKey 삭제 및 대신 handleCreateKey 추가
  async function handleCreateKey() {
    if (!newName.trim()) {
      alert('키 이름을 입력해주세요.');
      return;
    }
    try {
      const res = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) throw new Error('생성 실패');
      setShowModal(false);
      setNewName('');
      setSelectedType('development');
      setLimitEnabled(false);
      setLimit(100);
      fetchKeys();
    } catch (error) {
      console.error(error);
      alert('API 키 생성 중 오류가 발생했습니다.');
    }
  }

  // API 키 삭제
  async function deleteKey(id: string) {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/api-keys/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('삭제 실패');
      fetchKeys();
    } catch (error) {
      console.error(error);
      alert('API 키 삭제 중 오류가 발생했습니다.');
    }
  }

  function openEditModal(key: ApiKey) {
    setEditingKey(key);
    setEditName(key.name);
    setEditType(key.type);
    setEditLimitEnabled(!!(key.limit_enabled || key.limitEnabled));
    setEditLimit(key.limit || 100);
    setShowEditModal(true);
  }

  async function handleUpdateKey() {
    if (!editingKey) return;
    if (!editName.trim()) { alert('키 이름을 입력해주세요.'); return; }
    try {
      const res = await fetch(`/api/api-keys/${editingKey.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, type: editType, limit_enabled: editLimitEnabled, limit: editLimit }),
      });
      if (!res.ok) throw new Error('수정 실패');
      setShowEditModal(false);
      fetchKeys();
    } catch (error) {
      console.error(error);
      alert('API 키 수정 중 오류가 발생했습니다.');
    }
  }

  // 클립보드에 API 키 복사 기능
  function copyKey(key: string) {
    navigator.clipboard.writeText(key);
    alert('클립보드에 복사되었습니다.');
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-2">
          API / 키 관리
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">API 키 관리</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>새 API 키 생성</span>
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-6 mb-8 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">API 키 목록</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left pb-3 pr-4 font-medium text-gray-600">이름</th>
                <th className="text-left pb-3 pr-4 font-medium text-gray-600">키</th>
                <th className="text-left pb-3 pr-4 font-medium text-gray-600">생성일</th>
                <th className="text-left pb-3 font-medium text-gray-600">액션</th>
              </tr>
            </thead>
            <tbody>
              {keys.length > 0 ? (
                keys.map((key) => (
                  <tr key={key.id} className="border-b border-gray-200">
                    <td className="py-4 pr-4">{key.name}</td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center">
                        <span className="text-gray-600 font-mono">{key.key}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      {new Date(key.created_at || key.createdAt || '').toLocaleString()}
                    </td>
                    <td className="py-4">
                      <div className="flex gap-3">
                        <button onClick={() => copyKey(key.key)} className="text-gray-500 hover:text-blue-600" title="복사">
                          <ClipboardIcon className="h-5 w-5" />
                        </button>
                        <button onClick={() => openEditModal(key)} className="text-gray-500 hover:text-blue-600" title="수정">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button onClick={() => deleteKey(key.id)} className="text-gray-500 hover:text-red-600" title="삭제">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-gray-200">
                  <td className="py-4 pr-4">454545</td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center">
                      <span className="text-gray-600">23ad1446e83d487c9297b08a1aa72de</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4">2025. 4. 28. 오전 11:06:10</td>
                  <td className="py-4">
                    <div className="flex gap-3">
                      <button className="text-gray-500 hover:text-blue-600" title="보기">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button className="text-gray-500 hover:text-blue-600" title="복사">
                        <ClipboardIcon className="h-5 w-5" />
                      </button>
                      <button className="text-gray-500 hover:text-blue-600" title="수정">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button className="text-gray-500 hover:text-red-600" title="삭제">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-2">새로운 API 키 생성</h2>
            <p className="text-sm text-gray-600 mb-4">새 API 키의 이름과 한도를 입력하세요.</p>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">키 이름</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">키 유형</label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  disabled
                  className={`flex-1 p-4 border rounded ${selectedType === 'production' ? 'border-blue-500' : 'border-gray-300'} bg-gray-50 text-gray-400 cursor-not-allowed`}
                >
                  <p className="font-medium">생산</p>
                  <p className="text-xs">요청 속도는 분당 1,000개로 제한됩니다.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType('development')}
                  className={`flex-1 p-4 border rounded ${selectedType === 'development' ? 'border-blue-500' : 'border-gray-300'} bg-white`}
                >
                  <p className="font-medium">개발</p>
                  <p className="text-xs text-gray-600">요청 속도는 분당 100개로 제한됩니다.</p>
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={limitEnabled}
                  onChange={() => setLimitEnabled(!limitEnabled)}
                  className="form-checkbox"
                />
                <span className="ml-2">월별 사용량 제한*</span>
              </label>
              {limitEnabled && (
                <input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(+e.target.value)}
                  className="mt-2 w-full border p-2 rounded"
                />
              )}
            </div>
            <p className="text-xs text-gray-500 mb-4">* 모든 키의 총 사용량이 플랜의 한도를 초과하는 경우 모든 요청이 거부됩니다.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200"
              >
                취소
              </button>
              <button
                onClick={handleCreateKey}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                생성
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 수정 모달 */}
      {showEditModal && editingKey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-2">API 키 수정</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">키 이름</label>
              <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full border p-2 rounded" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">키 유형</label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  disabled
                  className={`flex-1 p-4 border rounded ${editType === 'production' ? 'border-blue-500' : 'border-gray-300'} bg-gray-50 text-gray-400 cursor-not-allowed`}
                >
                  <p className="font-medium">생산</p>
                  <p className="text-xs">요청 속도는 분당 1,000개로 제한됩니다.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setEditType('development')}
                  className={`flex-1 p-4 border rounded ${editType === 'development' ? 'border-blue-500' : 'border-gray-300'} bg-white`}
                >
                  <p className="font-medium">개발</p>
                  <p className="text-xs text-gray-600">요청 속도는 분당 100개로 제한됩니다.</p>
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input type="checkbox" checked={editLimitEnabled} onChange={() => setEditLimitEnabled(!editLimitEnabled)} className="form-checkbox" />
                <span className="ml-2">월별 사용량 제한*</span>
              </label>
              {editLimitEnabled && (
                <input type="number" value={editLimit} onChange={e => setEditLimit(+e.target.value)} className="mt-2 w-full border p-2 rounded" />
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-200 rounded">취소</button>
              <button onClick={handleUpdateKey} className="px-4 py-2 bg-blue-600 text-white rounded">수정</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
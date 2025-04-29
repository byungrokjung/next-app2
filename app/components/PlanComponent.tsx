'use client';

import { useState, useEffect } from 'react';
import { fetchUserPlan, Plan } from '../../lib/apiService';

export default function PlanComponent() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payAsYouGo, setPayAsYouGo] = useState(false);

  useEffect(() => {
    async function loadPlan() {
      try {
        setIsLoading(true);
        const planData = await fetchUserPlan();
        setPlan(planData);
        setError(null);
      } catch (err) {
        setError('플랜 정보를 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadPlan();
  }, []);

  const togglePayAsYouGo = () => {
    setPayAsYouGo(!payAsYouGo);
    // 여기서 실제로 API 호출이 필요할 수 있음
  };

  // 사용량 퍼센트 계산
  const getUsagePercent = () => {
    if (!plan) return 0;
    const percent = (plan.used_credits / plan.credits) * 100;
    return Math.min(percent, 100); // 최대 100%로 제한
  };

  if (isLoading) {
    return (
      <div className="mb-8 rounded-xl overflow-hidden bg-gradient-to-r from-rose-300 via-purple-300 to-blue-300 p-8 shadow-md">
        <div className="flex justify-center py-10">
          <div className="animate-spin h-8 w-8 border-2 border-white rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8 rounded-xl overflow-hidden bg-red-100 p-8 shadow-md">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-xl overflow-hidden bg-gradient-to-r from-rose-300 via-purple-300 to-blue-300 p-8 shadow-md">
      <div className="flex justify-between mb-4">
        <div className="bg-white/20 text-white px-3 py-1 rounded-md text-sm">
          CURRENT PLAN
        </div>
        <button className="bg-white/20 text-white px-3 py-1 rounded-md text-sm flex items-center gap-2">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
          </svg>
          Manage Plan
        </button>
      </div>

      <h2 className="text-4xl font-bold text-white mb-8">
        {plan ? plan.name : 'Free Plan'}
      </h2>
      
      <div className="text-white mb-2 flex items-center gap-2">
        <span>API Usage</span>
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z" />
        </svg>
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-white mb-2">
          <span>Plan</span>
          <span>
            {plan ? `${plan.used_credits} / ${plan.credits} Credits` : '0 / 0 Credits'}
          </span>
        </div>
        <div className="w-full h-2 bg-white/20 rounded-full">
          <div 
            className="h-full bg-white rounded-full" 
            style={{ width: `${getUsagePercent()}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-white">
        <div 
          className="relative inline-block h-6 w-10 cursor-pointer"
          onClick={togglePayAsYouGo}
        >
          <input 
            type="checkbox" 
            className="opacity-0 w-0 h-0" 
            checked={payAsYouGo}
            onChange={togglePayAsYouGo}
          />
          <span className={`absolute top-0 left-0 right-0 bottom-0 ${payAsYouGo ? 'bg-blue-400' : 'bg-white/20'} rounded-full transition-colors`}></span>
          <span 
            className={`absolute h-4 w-4 top-1 bg-white rounded-full transition-all ${payAsYouGo ? 'left-5' : 'left-1'}`}
          ></span>
        </div>
        <span>Pay as you go</span>
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z" />
        </svg>
      </div>
    </div>
  );
} 
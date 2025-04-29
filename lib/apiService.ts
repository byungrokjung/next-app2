import { supabase } from './supabaseClient';

// API 키 타입 정의
export type ApiKey = {
  id: string;
  name: string;
  type: string;
  key: string;
  usage: number;
  created_at: string;
  user_id: string;
}

// 사용 계획 타입 정의
export type Plan = {
  id: string;
  name: string;
  credits: number;
  used_credits: number;
  user_id: string;
}

// API 키 목록 가져오기
export async function fetchApiKeys() {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data as ApiKey[];
  } catch (error) {
    console.error('API 키를 가져오는 중 오류 발생:', error);
    return [];
  }
}

// API 키 생성
export async function createApiKey(name: string, type: string = 'dev') {
  try {
    // 실제 환경에서는 서버 측에서 안전하게 API 키를 생성해야 함
    const { data, error } = await supabase
      .from('api_keys')
      .insert([
        { name, type, key: `tvly-${type}-${generateRandomString(15)}`, usage: 0 }
      ])
      .select();
    
    if (error) {
      throw error;
    }
    
    return data?.[0] as ApiKey;
  } catch (error) {
    console.error('API 키 생성 중 오류 발생:', error);
    return null;
  }
}

// API 키 삭제
export async function deleteApiKey(id: string) {
  try {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('API 키 삭제 중 오류 발생:', error);
    return false;
  }
}

// 사용자 플랜 정보 가져오기
export async function fetchUserPlan() {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as Plan;
  } catch (error) {
    console.error('사용자 플랜 정보를 가져오는 중 오류 발생:', error);
    return null;
  }
}

// 랜덤 문자열 생성 도우미 함수
function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
} 
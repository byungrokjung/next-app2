import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '../../../lib/supabaseClient';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  type: 'production' | 'development';
  limit_enabled: boolean;
  limit: number | null;
}

/** GET: 전체 API 키 목록 조회 */
export async function GET() {
  try {
    console.log('GET /api/api-keys - Supabase 요청 시작');
    
    // 테이블 존재 여부 확인
    const { error: tableError } = await supabase
      .from('api_keys')
      .select('id')
      .limit(1);
      
    if (tableError) {
      console.error('테이블 확인 오류:', tableError.message);
      return NextResponse.json({ 
        error: '테이블 접근 오류', 
        details: tableError.message,
        hint: 'Supabase에 api_keys 테이블이 생성되었는지 확인하세요.'
      }, { status: 500 });
    }
    
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('GET 데이터 조회 오류:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    console.log(`GET 성공: ${data?.length || 0}개 항목 조회됨`);
    
    // 프론트엔드에 대한 필드명 변환
    const transformedData = data?.map(item => ({
      ...item,
      createdAt: item.created_at,
      limitEnabled: item.limit_enabled
    })) || [];
    
    return NextResponse.json(transformedData);
  } catch (err: any) {
    console.error('GET 처리 중 예외 발생:', err);
    return NextResponse.json({ 
      error: '서버 오류', 
      message: err.message 
    }, { status: 500 });
  }
}

/** POST: 새로운 API 키 생성 */
export async function POST(request: Request) {
  try {
    console.log('POST /api/api-keys - 요청 처리 시작');
    
    const body = await request.json();
    console.log('요청 본문:', JSON.stringify(body));
    
    const { name, type, limitEnabled, limit }: Partial<ApiKey> = body;
    
    if (!name) {
      return NextResponse.json({ 
        error: '유효하지 않은 요청', 
        message: 'name 필드는 필수입니다.' 
      }, { status: 400 });
    }
    
    const newKey = {
      id: crypto.randomUUID(),
      name: name as string,
      key: crypto.randomBytes(16).toString('hex'),
      created_at: new Date().toISOString(),
      type: (type as ApiKey['type']) || 'development',
      limit_enabled: !!limitEnabled,
      limit: limitEnabled ? (limit as number) : null,
    };
    
    console.log('생성할 키:', { ...newKey, key: `${newKey.key.substring(0, 3)}...` });
    
    const { data, error } = await supabase
      .from('api_keys')
      .insert([newKey])
      .select()
      .single();
      
    if (error) {
      console.error('키 생성 오류:', error);
      
      // PostgreSQL 오류 코드에 따른 상세 메시지
      let errorMessage = error.message;
      let hint = '';
      
      if (error.code === '42P01') {
        hint = 'api_keys 테이블이 존재하지 않습니다. Supabase에서 테이블을 생성하세요.';
      } else if (error.code === '23505') {
        hint = '이미 존재하는 키 이름입니다. 다른 이름을 사용하세요.';
      } else if (error.code === '42703') {
        hint = `테이블 구조가, 필요한 열이 누락되었습니다: ${error.details || ''}`;
      } else if (error.code?.startsWith('2')) {
        hint = '데이터 유효성 검사 오류입니다.';
      } else if (error.code?.startsWith('28')) {
        hint = '권한 부족 문제입니다. Supabase 권한 설정을 확인하세요.';
      }
      
      return NextResponse.json({ 
        error: errorMessage, 
        hint,
        code: error.code,
        details: error.details
      }, { status: 500 });
    }
    
    console.log('키 생성 성공:', data?.id);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('POST 처리 중 예외 발생:', err);
    return NextResponse.json({ 
      error: '서버 오류', 
      message: err.message 
    }, { status: 500 });
  }
} 
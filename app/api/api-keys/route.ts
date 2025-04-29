import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '../../../lib/supabaseClient';
import { generateApiKey } from '../../../lib/apiKeyGenerator';
import { ApiKey, ApiKeyUpdateData } from './[id]/route';

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
    
    const { name, type, limit_enabled, limit }: ApiKeyUpdateData = body;
    
    if (!name) {
      return NextResponse.json({
        error: '이름은 필수 항목입니다.',
      }, { status: 400 });
    }
    
    if (!type || !['production', 'development'].includes(type)) {
      return NextResponse.json({
        error: '유효한 타입(production 또는 development)을 지정해주세요.',
      }, { status: 400 });
    }
    
    const key = generateApiKey();
    
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        name,
        key,
        type,
        limit_enabled: limit_enabled ?? false,
        limit: limit_enabled ? limit : null,
      })
      .select()
      .single();
      
    if (error) {
      console.error('Supabase 에러:', error);
      return NextResponse.json({
        error: '데이터베이스 오류가 발생했습니다.',
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
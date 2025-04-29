import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function GET() {
  try {
    console.log('디버그 API 실행...');
    
    // 1. Supabase 연결 확인
    const connectionInfo = {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || '설정되지 않음',
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    };
    
    console.log('Supabase 연결 정보:', connectionInfo);
    
    // 2. 테이블 존재 여부 확인
    let tableExists = false;
    try {
      const { error } = await supabase
        .from('api_keys')
        .select('id')
        .limit(1);
      
      tableExists = !error;
      console.log('테이블 확인 결과:', tableExists ? '존재함' : '존재하지 않음', error ? error.message : '');
    } catch (err) {
      console.error('테이블 확인 중 오류:', err);
    }
    
    // 3. 결과 반환
    return NextResponse.json({
      connection: connectionInfo,
      tableExists,
      timestamp: new Date().toISOString(),
      supabaseStatus: 'connected'
    });
  } catch (err: any) {
    console.error('디버그 API 오류:', err);
    return NextResponse.json({
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// 테이블 생성 엔드포인트
export async function POST() {
  try {
    // 1. Supabase RPC 호출을 통한 테이블 생성 시도
    // 참고: 실제로는 Supabase Studio에서 직접 테이블 생성을 권장합니다
    
    console.log('테이블 생성 시도 중...');
    
    const { error } = await supabase.rpc('create_api_keys_table_if_not_exists', {});
    
    if (error) {
      console.error('테이블 생성 RPC 오류:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        tip: 'Supabase Studio에서 테이블을 직접 생성하세요. 다음 DDL을 사용할 수 있습니다.'
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'api_keys 테이블이 성공적으로 생성되었습니다.'
    });
  } catch (err: any) {
    console.error('테이블 생성 시도 중 오류:', err);
    return NextResponse.json({
      success: false,
      error: err.message,
      tableDDL: `
CREATE TABLE api_keys (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  type TEXT DEFAULT 'development',
  limit_enabled BOOLEAN DEFAULT FALSE,
  limit INTEGER
);
      `
    }, { status: 500 });
  }
} 
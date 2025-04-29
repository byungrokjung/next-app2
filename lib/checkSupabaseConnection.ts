import { supabase } from './supabaseClient';

export async function checkSupabaseConnection() {
  try {
    // 0. 환경 변수 확인
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key || url === 'https://example.supabase.co' || key === 'example-key') {
      return {
        connected: false,
        error: '유효한 Supabase URL과 Key가 설정되지 않았습니다.',
        details: {
          url: url || '설정되지 않음',
          key: key ? '(설정됨)' : '설정되지 않음',
          hint: '.env.local 파일에 올바른 값을 설정하세요.'
        }
      };
    }

    // 1. 간단한 Ping 테스트
    console.log('Supabase 연결 테스트 시작...');
    console.log(`URL: ${url.substring(0, 15)}...`);

    // 2. 실제 데이터 조회 시도
    const { data, error } = await supabase
      .from('api_keys')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase 연결 오류:', error.message);
      return {
        connected: false,
        error: error.message,
        details: error
      };
    }
    
    return {
      connected: true,
      message: '데이터베이스 연결 성공',
      data
    };
  } catch (error: any) {
    console.error('예외 발생:', error);
    return {
      connected: false,
      error: error.message || '알 수 없는 오류',
      details: error
    };
  }
} 
import { NextResponse } from 'next/server';

export async function GET() {
  // 환경 변수 확인
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return NextResponse.json({
    supabaseUrl: supabaseUrl || '설정되지 않음',
    // 키는 보안을 위해 일부만 표시
    supabaseKey: supabaseKey 
      ? `${supabaseKey.substring(0, 3)}...${supabaseKey.substring(supabaseKey.length - 3)}` 
      : '설정되지 않음',
    envLoaded: !!supabaseUrl && !!supabaseKey,
    allEnv: Object.keys(process.env)
      .filter(key => key.startsWith('NEXT_'))
      .map(key => key)
  });
} 
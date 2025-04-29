import * as supabaseJs from '@supabase/supabase-js';

// URL이 없으면 임시 값 사용
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-key';

// 컴파일 오류 방지를 위해 클라이언트 생성
export const supabase = supabaseJs.createClient(supabaseUrl, supabaseKey); 
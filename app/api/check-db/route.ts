import { NextResponse } from 'next/server';
import { checkSupabaseConnection } from '../../../lib/checkSupabaseConnection';

export async function GET() {
  const connectionStatus = await checkSupabaseConnection();
  
  if (!connectionStatus.connected) {
    return NextResponse.json({
      status: 'error',
      message: '데이터베이스 연결 실패',
      error: connectionStatus.error
    }, { status: 500 });
  }
  
  return NextResponse.json({
    status: 'success',
    message: connectionStatus.message,
    data: connectionStatus.data
  });
} 
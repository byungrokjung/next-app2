import { NextRequest, NextResponse } from 'next/server';

// 유효한 API 키 목록 (실제 앱에서는 DB나 환경 변수에서 관리)
// 예시 키: tvly-dev-123456789 and tvly-prod-987654321
const VALID_API_KEYS = ['tvly-dev-123456789', 'tvly-prod-987654321'];

export async function POST(request: NextRequest) {
  try {
    // Authorization 헤더에서 API 키 추출
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header missing or invalid format' },
        { status: 401 }
      );
    }
    
    const apiKey = authHeader.split('Bearer ')[1].trim();
    
    // API 키 검증
    if (VALID_API_KEYS.includes(apiKey)) {
      return NextResponse.json(
        { 
          message: 'valid api key, /protected can be accessed',
          status: 'success',
          data: {
            timestamp: new Date().toISOString(),
            accessGranted: true
          }
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'invalid api key' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('API 키 검증 중 오류:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// OPTIONS 요청 처리 (CORS 지원)
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
} 
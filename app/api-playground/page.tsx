import ApiKeyForm from '../components/ApiKeyForm';

export const metadata = {
  title: 'API Playground - Tavily API',
  description: 'Test and validate your Tavily API key',
};

export default function ApiPlaygroundPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-2">
          Pages / API Playground
        </div>
        <h1 className="text-3xl font-bold mb-2">API Playground</h1>
        <p className="text-gray-600">
          API 키를 테스트하고 보호된 엔드포인트에 액세스할 수 있는지 확인하세요.
        </p>
      </div>

      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">API 키 테스트</h2>
          <p className="text-gray-600 text-sm">
            아래 폼에 API 키를 입력하여 유효성을 검사합니다. 유효한 키는 보호된 엔드포인트에 액세스할 수 있습니다.
          </p>
        </div>
        
        <ApiKeyForm />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">API 사용 방법</h2>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">1. API 키 헤더 추가</h3>
          <p className="text-gray-600 text-sm mb-2">요청 헤더에 API 키를 포함시킵니다:</p>
          <div className="bg-gray-50 p-3 rounded font-mono text-sm overflow-x-auto">
            <pre>{'Authorization: Bearer YOUR_API_KEY'}</pre>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">2. 요청 보내기</h3>
          <p className="text-gray-600 text-sm mb-2">API 키를 사용하여 보호된 엔드포인트에 액세스:</p>
          <div className="bg-gray-50 p-3 rounded font-mono text-sm overflow-x-auto">
            <pre>{`fetch('/api/protected', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({ query: 'your search query' })
})`}</pre>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">3. 응답 처리</h3>
          <p className="text-gray-600 text-sm mb-2">응답을 받아 데이터 처리:</p>
          <div className="bg-gray-50 p-3 rounded font-mono text-sm overflow-x-auto">
            <pre>{`.then(response => response.json())
.then(data => {
  console.log(data);
})`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
} 
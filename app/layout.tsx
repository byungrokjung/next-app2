import './globals.css';
import Sidebar from './components/Sidebar';

export const metadata = {
  title: 'Tavily API',
  description: 'Tavily AI Search API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="flex">
          <aside className="fixed inset-y-0 left-0 z-10">
            <Sidebar />
          </aside>
          <main className="flex-1 ml-64 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

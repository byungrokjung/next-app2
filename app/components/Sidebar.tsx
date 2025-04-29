'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  CodeBracketIcon,
  UserIcon, 
  CogIcon, 
  CreditCardIcon, 
  DocumentTextIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Overview', href: '/', icon: HomeIcon },
    { name: 'API Playground', href: '/api-playground', icon: CodeBracketIcon },
    { name: 'Use Cases', href: '/use-cases', icon: DocumentTextIcon },
    { name: 'Billing', href: '/billing', icon: CreditCardIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
    { name: 'Documentation', href: '/docs', icon: DocumentTextIcon, external: true },
  ];
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <img src="/tavily-logo.svg" alt="Tavily" className="h-8" onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkw2IDYgMiAxMmw0IDYgNiA0IDYtNCA0LTYtNC02LTYtNHoiIGZpbGw9IiMzQjgyRjYiLz48cGF0aCBkPSJNMTIgMkw2IDEybDYgMTAgNi0xMC02LTEweiIgZmlsbD0iI0Y1OUUwQiIvPjwvc3ZnPg==';
          }} />
          <span className="text-lg font-bold">tavily</span>
        </div>
      </div>
      
      <div className="mx-4 my-6">
        <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 w-full text-left hover:bg-gray-200">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">P</span>
          </div>
          <span className="font-medium">Personal</span>
          <ChevronDownIcon className="h-4 w-4 ml-auto" />
        </button>
      </div>
      
      <nav className="mt-2 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                  {item.external && (
                    <svg className="h-3 w-3 ml-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
} 
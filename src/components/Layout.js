// Layout.js - 스크롤 문제가 해결된 레이아웃 컴포넌트
import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  FolderOpen, 
  Calendar, 
  Book, 
  Menu, 
  ChevronRight,
  ChevronsLeft
} from 'lucide-react';
import FloatingCalendar from './FloatingCalender';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    {
      id: 'dashboard',
      title: '대시보드',
      icon: Home,
      path: '/dashboard',
      exact: true
    },
    {
      id: 'study',
      title: '학습 관리',
      icon: BookOpen,
      path: '/study',
      subPaths: ['/study/:id']
    },
    {
      id: 'project',
      title: '프로젝트 관리',
      icon: FolderOpen,
      path: '/project',
      subPaths: ['/project/:id']
    },
    {
      id: 'textbook',
      title: '원서 관리',
      icon: Book,
      path: '/textbook',
      subPaths: ['/textbook/:id']
    },
    {
      id: 'calendar',
      title: '캘린더',
      icon: Calendar,
      path: '/calendar'
    }
  ];

  const isActiveRoute = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    
    if (location.pathname === item.path) return true;
    
    if (item.subPaths) {
      return item.subPaths.some(subPath => {
        const regex = new RegExp(subPath.replace(':id', '[^/]+'));
        return regex.test(location.pathname);
      });
    }
    
    return location.pathname.startsWith(item.path);
  };

  return (
    // 전체 컨테이너: 고정 높이, 오버플로우 숨김
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* 사이드바 */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col flex-shrink-0`}>
        {/* 헤더 */}
        <div className="p-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-gray-800">학습 관리</h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <ChevronsLeft size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* 메뉴 - 스크롤 가능 영역 */}
        <nav className="flex-1 p-2 space-y-2 overflow-y">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item);
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && (
                  <>
                    <span className="font-medium">{item.title}</span>
                    {isActive && location.pathname !== item.path && (
                      <ChevronRight size={16} className="ml-auto" />
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
        
        <FloatingCalendar />
        
        {/* 하단 정보 */}
        {sidebarOpen && (
          <div className="p-4 border-t flex-shrink-0">
            <div className="text-xs text-gray-500 text-center">
              <p>학습 관리 시스템 v1.0</p>
            </div>
          </div>
        )}
      </div>

      {/* 메인 콘텐츠 - 스크롤 가능 영역 */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto">
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
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
  ChevronsLeft,
  PenTool,
  Lightbulb,
  Zap,
  GraduationCap,
  BarChart3,
  BookMarked,
  NotebookPen,
  BookmarkIcon,
  X
} from 'lucide-react';
import FloatingCalender from './FloatingCalender';

const studyNavItems = [
  { id: 'content', label: '원서 본문', icon: BookOpen, path: 'content' },
  { id: 'notes', label: '노트', icon: NotebookPen, path: 'notes' },
  { id: 'progress', label: '학습 현황', icon: BarChart3, path: 'progress' },
];

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // 일반 nav용
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // 학습 nav용
  const [activeView, setActiveView] = useState('content'); // 학습 nav용
  const location = useLocation();
  // /textbook/:id/study(및 하위) 경로 감지
  const isStudyPage = /^\/textbook\/[^/]+\/study/.test(location.pathname);
  // id 추출 (학습 nav 링크용)
  let id = null;
  if (isStudyPage) {
    const match = location.pathname.match(/^\/textbook\/(\w+)\/study/);
    id = match ? match[1] : null;
  }

  // 기존 메뉴
  const mainMenuItems = [
    {
      id: 'dashboard',
      title: '대시보드',
      icon: Home,
      path: '/dashboard',
      exact: true,
      color: 'blue'
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
    },
    {
      id: 'textbook',
      title: '원서 관리',
      icon: Book,
      path: '/textbook',
    },
    {
      id: 'calendar',
      title: '학습 캘린더',
      icon: Calendar,
      path: '/calendar',
    },
  ];

  // 학습 nav 클릭 시 activeView 변경
  const handleStudyNavClick = (item) => {
    setActiveView(item.id);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* 사이드바 */}
      <div className={`bg-white shadow-xl border-r border-gray-100 transition-all duration-300 flex flex-col flex-shrink-0
        ${isStudyPage ? (sidebarCollapsed ? 'w-16' : 'w-72') : (sidebarOpen ? 'w-72' : 'w-16')}`}>
        {/* 헤더 */}
        <div className="p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            {((isStudyPage && !sidebarCollapsed) || (!isStudyPage && sidebarOpen)) && (
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {isStudyPage ? '학습 집중 모드' : 'Slacko'}
                </h1>
              </div>
            )}
            {isStudyPage ? (
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100 hover:border-gray-200 shadow-sm"
              >
                {sidebarCollapsed ? <Menu size={20} /> : <ChevronsLeft size={20} />}
              </button>
            ) : (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100 hover:border-gray-200 shadow-sm"
              >
                {sidebarOpen ? <ChevronsLeft size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>
        {/* nav 영역 */}
        <nav className="flex-1 p-2 space-y-2 overflow-y">
          {isStudyPage && id ? (
            <ul className="space-y-2">
              {studyNavItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleStudyNavClick(item)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-blue-50 transition-colors w-full text-left
                      ${activeView === item.id ? 'bg-blue-100 text-blue-700 font-bold' : ''}`}
                  >
                    <item.icon className="w-5 h-5" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-2">
              {mainMenuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-blue-50 transition-colors
                      ${location.pathname.startsWith(item.path) ? 'bg-blue-100 text-blue-700 font-bold' : ''}`}
                  >
                    <item.icon className="w-5 h-5" />
                    {sidebarOpen && <span>{item.title}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </nav>
        {/* 캘린더 등 부가 영역 */}
        <div className="px-2 pb-4">
          {!isStudyPage && <FloatingCalender />}
        </div>
      </div>
      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Outlet context={{ activeView }} />
        </div>
      </div>
    </div>
  );
};

export default Layout;
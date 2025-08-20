import { useState, useMemo } from 'react';
import React from 'react';
import { 
  Plus, Search, Briefcase, Filter, X,
  TrendingUp, CheckCircle, DollarSign,
  Clock, BarChart3, List, Calendar, PieChart, Menu
} from 'lucide-react';

import ProjectModal from '../../components/project/ProjectModal';
import BoardView from '../../components/project/BoardView';
import ListView from '../../components/project/ListView';
import TimelineView from '../../components/project/TimelineView';
import AnalyticsView from '../../components/project/AnalyticsView';
import ProjectDetailModal from '../../components/project/ProjectDetailModal';
import TaskModal from '../../components/project/TaskModal';
import { useProjectContext } from '../../context/ProjectContext';
import { useOutletContext } from 'react-router-dom';

export default function AdvancedProjectManagement() {
  const { projects, addProject, updateTask, addTask } = useProjectContext();
  const { sidebarOpen } = useOutletContext();
  
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeView, setActiveView] = useState('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    assignee: 'all',
    tags: []
  });
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Analytics & Metrics
  const analytics = useMemo(() => {
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const inProgressProjects = projects.filter(p => p.status === 'in-progress').length;
    const notStartedProjects = projects.filter(p => p.status === 'not-started').length;
    const overallProgress = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;
    
    const totalTasks = projects.reduce((acc, p) => acc + (p.tasks?.length || 0), 0);
    const completedTasks = projects.reduce((acc, p) => 
      acc + (p.tasks?.filter(t => t.status === 'completed').length || 0), 0);
    const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
    const totalSpent = projects.reduce((acc, p) => acc + (p.spent || 0), 0);
    const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return {
      totalProjects,
      completedProjects,
      inProgressProjects,
      notStartedProjects,
      overallProgress,
      totalTasks,
      completedTasks,
      taskCompletionRate,
      totalBudget,
      totalSpent,
      budgetUtilization
    };
  }, [projects]);

  // Filter and search logic
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      if (searchQuery && !project.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !project.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (filters.status !== 'all' && project.status !== filters.status) return false;
      if (filters.priority !== 'all' && project.priority !== filters.priority) return false;
      if (filters.assignee !== 'all' && !project.team.some(member => member.id.toString() === filters.assignee)) return false;
      if (filters.tags.length > 0 && !filters.tags.some(tag => project.tags.includes(tag))) return false;
      
      return true;
    });
  }, [projects, searchQuery, filters]);

  const handleCreateProject = (newProject) => {
    addProject(newProject);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const viewItems = [
    { id: 'board', name: '보드뷰', icon: BarChart3 },
    { id: 'list', name: '리스트뷰', icon: List },
    { id: 'timeline', name: '타임라인', icon: Calendar },
    { id: 'analytics', name: '분석', icon: PieChart }
  ];

  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden">
      {/* 상단 헤더 바 - 컨테이너 크기 제한 */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 w-full">
        <div className="max-w-full px-4 sm:px-6 py-4">
          <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 sm:gap-0">
            {/* 페이지 제목 */}
            <div className="flex-shrink-0">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">프로젝트 관리</h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">팀 협업과 프로젝트 진행을 관리하세요</p>
            </div>

            {/* 우측 액션 버튼들 */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-1 sm:gap-2 bg-slate-50/80 backdrop-blur px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-slate-200/50">
                  <TrendingUp size={14} className="text-blue-500 flex-shrink-0" />
                  <span className="text-xs text-slate-600 whitespace-nowrap">{Math.round(analytics.overallProgress)}% 완료</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-slate-50/80 backdrop-blur px-3 py-2 rounded-lg border border-slate-200/50">
                  <Clock size={16} className="text-emerald-500" />
                  <span className="text-xs text-slate-600">{analytics.inProgressProjects}개 진행중</span>
                </div>
              </div>
              
              <button 
                onClick={() => setShowProjectModal(true)}
                className="bg-slate-900 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">새 프로젝트</span>
                <span className="sm:hidden">추가</span>
              </button>
            </div>
          </div>

          {/* 통계 카드들 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
            <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-slate-100 rounded-lg flex-shrink-0">
                  <Briefcase size={16} className="text-slate-600 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg sm:text-2xl font-bold text-slate-900">{analytics.totalProjects}</div>
                  <div className="text-xs sm:text-sm text-slate-500 truncate">전체 프로젝트</div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <TrendingUp size={16} className="text-blue-600 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg sm:text-2xl font-bold text-blue-900">{analytics.inProgressProjects}</div>
                  <div className="text-xs sm:text-sm text-blue-600 truncate">진행 중</div>
                </div>
              </div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                  <CheckCircle size={16} className="text-emerald-600 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg sm:text-2xl font-bold text-emerald-900">{analytics.completedProjects}</div>
                  <div className="text-xs sm:text-sm text-emerald-600 truncate">완료</div>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0">
                  <DollarSign size={16} className="text-purple-600 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-base sm:text-2xl font-bold text-purple-900 truncate">
                    {analytics.totalBudget > 999999999 
                      ? `₩${Math.round(analytics.totalBudget / 1000000000)}B`
                      : analytics.totalBudget > 999999 
                      ? `₩${Math.round(analytics.totalBudget / 1000000)}M`
                      : formatCurrency(analytics.totalBudget)
                    }
                  </div>
                  <div className="text-xs sm:text-sm text-purple-600 truncate">총 예산</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 컨트롤 바 */}
      <div className="bg-white border-b border-slate-200 w-full overflow-x-hidden">
        <div className="max-w-full px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3 min-w-0">
            {/* 뷰 선택 */}
            <div className="flex-shrink-0">
              {/* 데스크톱 뷰 선택 */}
              <div className="hidden lg:flex items-center gap-1 bg-gray-200 p-1 rounded-xl">
                {viewItems.map(view => {
                  const Icon = view.icon;
                  return (
                    <button
                      key={view.id}
                      onClick={() => setActiveView(view.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                        activeView === view.id
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                      }`}
                    >
                      <Icon size={16} />
                      {view.name}
                    </button>
                  );
                })}
              </div>

              {/* 모바일 뷰 선택 */}
              <div className="lg:hidden relative">
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded-xl text-sm font-medium text-slate-700"
                >
                  {viewItems.find(v => v.id === activeView)?.icon && 
                    React.createElement(viewItems.find(v => v.id === activeView).icon, { size: 16 })
                  }
                  <span className="hidden sm:inline">{viewItems.find(v => v.id === activeView)?.name}</span>
                  <Menu size={16} />
                </button>
                
                {showMobileMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-lg py-2 z-30 min-w-48">
                    {viewItems.map(view => {
                      const Icon = view.icon;
                      return (
                        <button
                          key={view.id}
                          onClick={() => {
                            setActiveView(view.id);
                            setShowMobileMenu(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                            activeView === view.id
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Icon size={16} />
                          {view.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 검색 & 필터 */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end min-w-0">
              {/* 검색창 */}
              <div className="relative flex-1 max-w-xs min-w-0">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0"
                />
              </div>
              
              {/* 데스크톱 필터 */}
              <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
                <select 
                  value={filters.status} 
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">모든 상태</option>
                  <option value="not-started">시작 전</option>
                  <option value="in-progress">진행 중</option>
                  <option value="completed">완료</option>
                  <option value="on-hold">보류</option>
                </select>
                
                <select 
                  value={filters.priority} 
                  onChange={(e) => setFilters({...filters, priority: e.target.value})}
                  className="px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">모든 우선순위</option>
                  <option value="critical">긴급</option>
                  <option value="high">높음</option>
                  <option value="medium">보통</option>
                  <option value="low">낮음</option>
                </select>
              </div>

              {/* 모바일 필터 토글 */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden p-2 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-md flex-shrink-0"
              >
                <Filter size={16} />
              </button>

              {/* 결과 수 표시 */}
              <div className="hidden sm:block text-sm text-slate-500 whitespace-nowrap flex-shrink-0">
                {filteredProjects.length}개
              </div>
            </div>
          </div>

          {/* 모바일 필터 섹션 */}
          {showFilters && (
            <div className="lg:hidden bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-3 mt-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-slate-900">필터</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">상태</label>
                  <select 
                    value={filters.status} 
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="all">모든 상태</option>
                    <option value="not-started">시작 전</option>
                    <option value="in-progress">진행 중</option>
                    <option value="completed">완료</option>
                    <option value="on-hold">보류</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">우선순위</label>
                  <select 
                    value={filters.priority} 
                    onChange={(e) => setFilters({...filters, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="all">모든 우선순위</option>
                    <option value="critical">긴급</option>
                    <option value="high">높음</option>
                    <option value="medium">보통</option>
                    <option value="low">낮음</option>
                  </select>
                </div>
              </div>

              <div className="text-sm text-slate-500 pt-2 border-t border-slate-200">
                {filteredProjects.length}개의 프로젝트가 표시됩니다
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 메인 콘텐츠 영역 - 컨테이너 제한 */}
      <div className="max-w-full p-4 sm:p-6 overflow-x-hidden">
        {/* 빈 상태 처리 */}
        {filteredProjects.length === 0 && (searchQuery || filters.status !== 'all' || filters.priority !== 'all') ? (
          <div className="text-center py-12 sm:py-20">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-slate-400 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
              {searchQuery ? '검색 결과가 없습니다' : '조건에 맞는 프로젝트가 없습니다'}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mb-6 px-4">
              {searchQuery ? '다른 키워드로 검색해보세요.' : '다른 조건을 선택하거나 새 프로젝트를 추가해보세요.'}
            </p>
          </div>
        ) : (
          /* 뷰별 컨텐츠 렌더링 */
          <div className="w-full max-w-full">
            {activeView === 'board' && (
              <BoardView 
                filteredProjects={filteredProjects}
                setSelectedProject={setSelectedProject}
              />
            )}
            {activeView === 'list' && (
              <ListView 
                filteredProjects={filteredProjects}
                setSelectedProject={setSelectedProject}
              />
            )}
            {activeView === 'timeline' && (
              <TimelineView 
                filteredProjects={filteredProjects}
                updateTask={updateTask}
              />
            )}
            {activeView === 'analytics' && (
              <AnalyticsView 
                analytics={analytics}
                projects={projects}
              />
            )}
          </div>
        )}
      </div>
        
      {/* 모달들 */}
      <ProjectModal 
        showModal={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onCreateProject={handleCreateProject}
      />

      <ProjectDetailModal 
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        updateTask={updateTask}
        setShowTaskModal={setShowTaskModal}
      />

      <TaskModal 
        showTaskModal={showTaskModal}
        setShowTaskModal={setShowTaskModal}
        selectedProject={selectedProject}
        onAddTask={addTask}
      />

      {/* 모바일 메뉴 배경 오버레이 */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-20 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </div>
  );
}
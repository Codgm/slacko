import React from 'react';
import { Plus, Circle } from 'lucide-react';
import ProjectCard from './ProjectCard';

const BoardView = ({ filteredProjects, setSelectedProject }) => {
  const statusColumns = [
    { id: 'not-started', title: '시작 전', color: 'border-slate-300 bg-slate-50', accent: 'bg-slate-500' },
    { id: 'in-progress', title: '진행 중', color: 'border-blue-300 bg-blue-100', accent: 'bg-blue-500' },
    { id: 'completed', title: '완료', color: 'border-emerald-300 bg-emerald-100', accent: 'bg-emerald-500' },
    { id: 'on-hold', title: '보류', color: 'border-amber-300 bg-amber-100', accent: 'bg-amber-500' }
  ];

  const getColumnProjects = (status) => filteredProjects.filter(p => p.status === status);

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Mobile/Tablet: Vertical Stack (up to lg) */}
      <div className="block lg:hidden space-y-4 sm:space-y-6">
        {statusColumns.map(column => {
          const columnProjects = getColumnProjects(column.id);
          return (
            <div key={column.id} className={`${column.color} border-2 border-dashed rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 ${column.accent} rounded-full`}></div>
                  <h3 className="font-semibold text-slate-800 text-sm sm:text-base">{column.title}</h3>
                  <span className="bg-white border border-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                    {columnProjects.length}
                  </span>
                </div>
                <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
                            
              <div className="space-y-3">
                {columnProjects.map(project => (
                  <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
                ))}
              </div>
                            
              {columnProjects.length === 0 && (
                <div className="text-center py-6 sm:py-8 text-slate-400">
                  <Circle className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium">프로젝트가 없습니다</p>
                  <p className="text-xs mt-1">새 프로젝트를 추가해보세요</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop: Horizontal Columns (lg and above) - 반응형 개선 */}
      <div className="hidden lg:block">
        {/* 컨테이너 크기에 맞춰 동적 그리드 사용 */}
        <div className="grid grid-cols-4 gap-4 xl:gap-6 min-h-[600px] w-full">
          {statusColumns.map(column => {
            const columnProjects = getColumnProjects(column.id);
            return (
              <div 
                key={column.id} 
                className={`${column.color} border-2 border-dashed rounded-xl p-4 flex flex-col min-w-0`}
              >
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-3 h-3 ${column.accent} rounded-full flex-shrink-0`}></div>
                    <h3 className="font-semibold text-slate-800 truncate">{column.title}</h3>
                    <span className="bg-white border border-slate-200 text-slate-600 text-xs px-2.5 py-1 rounded-full font-medium shadow-sm flex-shrink-0">
                      {columnProjects.length}
                    </span>
                  </div>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors flex-shrink-0">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                                  
                {/* 스크롤 가능한 컨텐츠 영역 */}
                <div className="flex-1 overflow-y-auto space-y-4 min-h-0" style={{scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent'}}>
                  {columnProjects.map(project => (
                    <div key={project.id} className="flex-shrink-0">
                      <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
                    </div>
                  ))}
                </div>
                                  
                {/* 빈 상태 - 하단에 고정 */}
                {columnProjects.length === 0 && (
                  <div className="text-center py-12 text-slate-400 flex-1 flex flex-col items-center justify-center">
                    <Circle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">프로젝트가 없습니다</p>
                    <p className="text-xs mt-1">새 프로젝트를 추가해보세요</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty State - When no projects at all */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12 sm:py-16 text-slate-400">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 opacity-30 bg-slate-100 rounded-full flex items-center justify-center">
            <Circle className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <p className="text-lg font-medium">표시할 프로젝트가 없습니다</p>
          <p className="text-sm mt-1">필터를 조정하거나 새 프로젝트를 생성해보세요</p>
        </div>
      )}
    </div>
  );
};

export default BoardView;
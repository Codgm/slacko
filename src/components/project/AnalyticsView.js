import React from 'react';
import { Briefcase, Target, TrendingUp, Activity } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ProgressRing from './ProgressRing';

const AnalyticsView = ({ analytics, projects }) => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Enhanced Key Metrics - 반응형 그리드 개선 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-semibold text-indigo-600">총 프로젝트</p>
              <p className="text-2xl sm:text-3xl font-bold text-indigo-900 mt-1">{analytics.totalProjects}</p>
            </div>
            <div className="flex-shrink-0 p-2 sm:p-3 bg-indigo-500 rounded-xl shadow-lg">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <span className="text-xs sm:text-sm text-indigo-600 font-medium">
              {analytics.inProgressProjects}개 진행 중
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-semibold text-emerald-600">작업 완료율</p>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-900 mt-1">{Math.round(analytics.taskCompletionRate)}%</p>
            </div>
            <div className="flex-shrink-0 p-2 sm:p-3 bg-emerald-500 rounded-xl shadow-lg">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="w-full bg-emerald-200 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analytics.taskCompletionRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-semibold text-amber-600">예산 사용률</p>
              <p className="text-2xl sm:text-3xl font-bold text-amber-900 mt-1">{Math.round(analytics.budgetUtilization)}%</p>
            </div>
            <div className="flex-shrink-0 p-2 sm:p-3 bg-amber-500 rounded-xl shadow-lg">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <span className="text-xs sm:text-sm text-amber-600 font-medium truncate block">
              ₩{(analytics.totalSpent / 1000000).toFixed(1)}M / ₩{(analytics.totalBudget / 1000000).toFixed(1)}M
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-semibold text-purple-600">평균 진행률</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-900 mt-1">{Math.round(analytics.overallProgress)}%</p>
            </div>
            <div className="flex-shrink-0 p-2 sm:p-3 bg-purple-500 rounded-xl shadow-lg">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex justify-center">
            <ProgressRing progress={analytics.overallProgress} size={24} />
          </div>
        </div>
      </div>

      {/* Enhanced Project Performance Chart - 반응형 개선 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4 sm:mb-6">프로젝트별 성과</h3>
        
        {/* Mobile: Stack View */}
        <div className="block lg:hidden space-y-4">
          {projects.map(project => {
            const totalTasks = project.tasks?.length || 0;
            const completedTasks = project.tasks?.filter(t => t.status === 'completed').length || 0;
            const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
            const budgetProgress = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;
            
            return (
              <div key={project.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl sm:text-2xl">{project.icon}</span>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-slate-900 truncate">{project.name}</h4>
                    <p className="text-sm text-slate-600">{totalTasks}개 작업</p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm text-slate-600 mb-2">
                      <span>작업 진행률</span>
                      <span className="font-semibold">{Math.round(taskProgress)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${taskProgress}%` }}
                      />
                    </div>
                  </div>
                  
                  {project.budget > 0 && (
                    <div>
                      <div className="flex justify-between text-sm text-slate-600 mb-2">
                        <span>예산 사용률</span>
                        <span className="font-semibold">{Math.round(budgetProgress)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            budgetProgress > 90 ? 'bg-red-500' : budgetProgress > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        ₩{(project.spent / 1000000).toFixed(1)}M / ₩{(project.budget / 1000000).toFixed(1)}M
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: Table View */}
        <div className="hidden lg:block space-y-4">
          {projects.map(project => {
            const totalTasks = project.tasks?.length || 0;
            const completedTasks = project.tasks?.filter(t => t.status === 'completed').length || 0;
            const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
            const budgetProgress = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;
            
            return (
              <div key={project.id} className="flex items-center justify-between p-4 sm:p-5 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <span className="text-xl sm:text-2xl">{project.icon}</span>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-slate-900">{project.name}</h4>
                    <p className="text-sm text-slate-600">{totalTasks}개 작업</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 lg:gap-8">
                  <div className="text-center min-w-0">
                    <p className="text-sm text-slate-600 font-medium mb-1">작업 진행률</p>
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${taskProgress}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 min-w-[3rem] text-right">{Math.round(taskProgress)}%</span>
                    </div>
                  </div>
                  
                  {project.budget > 0 && (
                    <div className="text-center min-w-0">
                      <p className="text-sm text-slate-600 font-medium mb-1">예산 사용률</p>
                      <div className="flex items-center gap-3">
                        <div className="w-20 bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              budgetProgress > 90 ? 'bg-red-500' : budgetProgress > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 min-w-[3rem] text-right">{Math.round(budgetProgress)}%</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex-shrink-0">
                    <StatusBadge status={project.status} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <div className="w-16 h-16 mx-auto mb-4 opacity-30 bg-slate-100 rounded-full flex items-center justify-center">
              <Activity className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium">분석할 프로젝트가 없습니다</p>
            <p className="text-sm mt-1">새 프로젝트를 추가하여 분석을 시작해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsView;
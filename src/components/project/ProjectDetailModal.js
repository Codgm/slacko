import React, { useState, useEffect } from 'react';
import {
  FileText, Mail, Plus, Users,
  Target, Activity, BarChart3,
  UserPlus, Calendar, AlertCircle, ArrowLeft,
  Clock, TrendingUp, Star, CheckCircle2,
  MessageSquare, Download, Eye, Edit3,
  MoreHorizontal, Filter, ChevronRight,
  Zap, Award, Flame
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import TaskCard from './TaskCard';
import TeamManagementModal from './TeamManagementModal';
import MilestoneModal from './MilestoneModal';
import FileUploadComponent from './FileUploadComponent';
import { useOutletContext } from 'react-router-dom';

const ProjectDetailModal = ({ 
  selectedProject, 
  setSelectedProject, 
  setShowTaskModal 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [projectActivities, setProjectActivities] = useState([]);
  const [localProject, setLocalProject] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Layout context에서 사이드바 상태 가져오기
  const { sidebarOpen, sidebarCollapsed, isStudyMode } = useOutletContext() || {};

  // 사이드바 너비 계산
  const getSidebarWidth = () => {
    if (isStudyMode) {
      return sidebarCollapsed ? '4rem' : '20rem'; // 64px : 320px
    } else {
      return sidebarOpen ? '16rem' : '4rem'; // 256px : 64px
    }
  };

  // 애니메이션을 위한 상태 관리
  useEffect(() => {
    if (selectedProject) {
      setLocalProject(selectedProject);
      // 페이지 전환 애니메이션 시작
      setTimeout(() => setIsVisible(true), 10);
      
      // 임시 활동 데이터
      setProjectActivities([
        {
          id: 1,
          user: { name: '김현우', avatar: '👨‍💻' },
          action: '새 작업을 생성했습니다',
          target: '사용자 인증 시스템 구현',
          time: '2분 전',
          type: 'task',
          priority: 'high'
        },
        {
          id: 2,
          user: { name: '이유진', avatar: '👩‍🎨' },
          action: '마일스톤을 완료했습니다',
          target: 'UI 디자인 완료',
          time: '1시간 전',
          type: 'milestone',
          priority: 'medium'
        },
        {
          id: 3,
          user: { name: '박민수', avatar: '👨‍💼' },
          action: '파일을 업로드했습니다',
          target: 'project-specs.pdf',
          time: '3시간 전',
          type: 'file',
          priority: 'low'
        },
        {
          id: 4,
          user: { name: '김현우', avatar: '👨‍💻' },
          action: '팀 미팅을 예약했습니다',
          target: '주간 스프린트 리뷰',
          time: '어제',
          type: 'meeting',
          priority: 'medium'
        }
      ]);
    }
  }, [selectedProject]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setSelectedProject(null);
      setActiveTab('overview');
    }, 300);
  };

  const handleTaskUpdate = async (taskId, updates) => {
    setLocalProject(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      ),
      updatedAt: new Date().toISOString()
    }));
  };

  const handleTaskDelete = async (taskId) => {
    setLocalProject(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId),
      updatedAt: new Date().toISOString()
    }));
  };

  const handleTeamUpdate = async (projectId, updatedTeam) => {
    setLocalProject(prev => ({
      ...prev,
      team: updatedTeam,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleMilestonesUpdate = async (projectId, updatedMilestones) => {
    setLocalProject(prev => ({
      ...prev,
      milestones: updatedMilestones,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleFilesUpdate = async (projectId, updatedFiles) => {
    setLocalProject(prev => ({
      ...prev,
      files: updatedFiles,
      updatedAt: new Date().toISOString()
    }));
  };

  if (!selectedProject || !localProject) return null;

  // 프로젝트 진행률 계산
  const totalTasks = localProject.tasks?.length || 0;
  const completedTasks = localProject.tasks?.filter(task => task.status === 'completed').length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 탭 목록
  const tabs = [
    { 
      id: 'overview', 
      name: '개요', 
      icon: BarChart3, 
      count: null,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    { 
      id: 'tasks', 
      name: '작업', 
      icon: CheckCircle2, 
      count: localProject.tasks?.length || 0,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    { 
      id: 'team', 
      name: '팀', 
      icon: Users, 
      count: localProject.team?.length || 0,
      color: 'text-violet-600 bg-violet-50 border-violet-200'
    },
    { 
      id: 'milestones', 
      name: '마일스톤', 
      icon: Target, 
      count: localProject.milestones?.length || 0,
      color: 'text-orange-600 bg-orange-50 border-orange-200'
    },
    { 
      id: 'files', 
      name: '파일', 
      icon: FileText, 
      count: localProject.files?.length || 0,
      color: 'text-pink-600 bg-pink-50 border-pink-200'
    },
    { 
      id: 'activity', 
      name: '활동', 
      icon: Activity, 
      count: projectActivities.length,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* 프로젝트 진행률 */}
            <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  프로젝트 진행률
                </h4>
                <div className="text-2xl font-bold text-blue-600">{progress}%</div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 mb-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-slate-600">완료</div>
                  <div className="text-lg font-semibold text-emerald-600">{completedTasks}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">진행중</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {localProject.tasks?.filter(t => t.status === 'in-progress').length || 0}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">대기</div>
                  <div className="text-lg font-semibold text-slate-600">
                    {localProject.tasks?.filter(t => t.status === 'todo').length || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* 프로젝트 통계 카드 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100 group hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <Star className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-emerald-700">{localProject.tasks?.length || 0}</div>
                <div className="text-sm text-emerald-600 font-medium">총 작업</div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100 group hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <Award className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-blue-700">{localProject.team?.length || 0}</div>
                <div className="text-sm text-blue-600 font-medium">팀원</div>
              </div>

              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-5 border border-violet-100 group hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-violet-100 rounded-lg group-hover:bg-violet-200 transition-colors">
                    <Target className="w-5 h-5 text-violet-600" />
                  </div>
                  <Flame className="w-4 h-4 text-violet-400" />
                </div>
                <div className="text-2xl font-bold text-violet-700">{localProject.milestones?.length || 0}</div>
                <div className="text-sm text-violet-600 font-medium">마일스톤</div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 border border-orange-100 group hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <Zap className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-2xl font-bold text-orange-700">
                  {Math.ceil((new Date(localProject.endDate) - new Date()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-orange-600 font-medium">남은 일수</div>
              </div>
            </div>

            {/* 프로젝트 상세 정보 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-slate-600" />
                프로젝트 정보
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="text-sm font-medium text-slate-700">시작일</span>
                    <div className="text-sm font-semibold text-slate-900">
                      {new Date(localProject.startDate).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="text-sm font-medium text-slate-700">종료일</span>
                    <div className="text-sm font-semibold text-slate-900">
                      {new Date(localProject.endDate).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {localProject.budget > 0 && (
                    <>
                      <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                        <span className="text-sm font-medium text-emerald-700">예산</span>
                        <div className="text-sm font-semibold text-emerald-900">
                          ₩{(localProject.budget / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                        <span className="text-sm font-medium text-red-700">사용액</span>
                        <div className="text-sm font-semibold text-red-900">
                          ₩{(localProject.spent / 1000000).toFixed(1)}M
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 최근 활동 미리보기 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-slate-600" />
                  최근 활동
                </h4>
                <button 
                  onClick={() => setActiveTab('activity')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  전체 보기
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {projectActivities.slice(0, 3).map(activity => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="text-2xl">{activity.user.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900">{activity.user.name}</span>
                        <span className="text-sm text-slate-500">{activity.action}</span>
                      </div>
                      <p className="text-sm text-slate-700 mb-2">{activity.target}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{activity.time}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          activity.priority === 'high' ? 'bg-red-100 text-red-700' :
                          activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {activity.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {projectActivities.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-medium">최근 활동이 없습니다</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h4 className="text-lg font-bold text-slate-900">작업 목록</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  {localProject.tasks?.length || 0}개
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-4 h-4" />
                  작업 추가
                </button>
              </div>
            </div>
            
            {localProject.tasks?.length > 0 ? (
              <div className="space-y-4">
                {localProject.tasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onUpdate={handleTaskUpdate}
                    onDelete={handleTaskDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-200">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">아직 작업이 없습니다</h3>
                <p className="text-sm text-slate-600 mb-6">새 작업을 추가하여 프로젝트를 시작해보세요</p>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  첫 번째 작업 만들기
                </button>
              </div>
            )}
          </div>
        );

      case 'team':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h4 className="text-lg font-bold text-slate-900">팀 구성원</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                  {localProject.team?.length || 0}명
                </span>
              </div>
              <button
                onClick={() => setShowTeamModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <UserPlus className="w-4 h-4" />
                멤버 관리
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localProject.team?.map(member => (
                <div key={member.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:border-violet-200 transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="w-14 h-14 rounded-2xl border-2 border-white shadow-md group-hover:scale-105 transition-transform" 
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-slate-900 mb-1">{member.name}</h5>
                      <p className="text-sm text-violet-600 font-medium mb-2">{member.role}</p>
                      {member.email && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{member.email}</span>
                        </div>
                      )}
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {(!localProject.team || localProject.team.length === 0) && (
              <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-violet-50 rounded-2xl border border-slate-200">
                <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-violet-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">팀 구성원이 없습니다</h3>
                <p className="text-sm text-slate-600 mb-6">팀 멤버를 초대하여 협업을 시작해보세요</p>
                <button
                  onClick={() => setShowTeamModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  첫 번째 멤버 초대하기
                </button>
              </div>
            )}
          </div>
        );

      case 'milestones':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h4 className="text-lg font-bold text-slate-900">마일스톤</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  {localProject.milestones?.length || 0}개
                </span>
              </div>
              <button
                onClick={() => setShowMilestoneModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 text-sm font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Target className="w-4 h-4" />
                마일스톤 관리
              </button>
            </div>

            <div className="space-y-4">
              {localProject.milestones?.map((milestone, index) => {
                const isOverdue = !milestone.completed && new Date(milestone.date) < new Date();
                const isCompleted = milestone.completed;
                return (
                  <div key={milestone.id} className="relative">
                    {index < localProject.milestones.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-8 bg-gradient-to-b from-slate-300 to-transparent"></div>
                    )}
                    
                    <div className={`bg-white rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-lg group ${
                      isCompleted 
                        ? 'border-emerald-200 hover:border-emerald-300' 
                        : isOverdue
                        ? 'border-red-200 hover:border-red-300'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-emerald-100 border-emerald-300 group-hover:scale-110' 
                            : isOverdue
                            ? 'bg-red-100 border-red-300 group-hover:scale-110'
                            : 'bg-slate-100 border-slate-300 group-hover:scale-110'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                          ) : isOverdue ? (
                            <AlertCircle className="w-6 h-6 text-red-600" />
                          ) : (
                            <Target className="w-6 h-6 text-slate-600" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h5 className={`text-lg font-bold mb-2 ${
                            isCompleted 
                              ? 'text-emerald-700 line-through' 
                              : isOverdue 
                              ? 'text-red-700' 
                              : 'text-slate-900'
                          }`}>
                            {milestone.title}
                          </h5>
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(milestone.date).toLocaleDateString('ko-KR')}</span>
                            </div>
                            {isOverdue && (
                              <div className="flex items-center gap-2 px-2 py-1 bg-red-100 rounded-lg">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                <span className="text-xs font-medium text-red-700">지연</span>
                              </div>
                            )}
                            {isCompleted && (
                              <div className="flex items-center gap-2 px-2 py-1 bg-emerald-100 rounded-lg">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span className="text-xs font-medium text-emerald-700">완료</span>
                              </div>
                            )}
                          </div>
                          {milestone.description && (
                            <p className="text-sm text-slate-600 leading-relaxed">{milestone.description}</p>
                          )}
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {(!localProject.milestones || localProject.milestones.length === 0) && (
              <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-orange-50 rounded-2xl border border-slate-200">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">마일스톤이 없습니다</h3>
                <p className="text-sm text-slate-600 mb-6">프로젝트 마일스톤을 추가하여 진행 상황을 추적해보세요</p>
                <button
                  onClick={() => setShowMilestoneModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  첫 번째 마일스톤 만들기
                </button>
              </div>
            )}
          </div>
        );

      case 'files':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h4 className="text-lg font-bold text-slate-900">파일 관리</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                  {localProject.files?.length || 0}개
                </span>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <FileUploadComponent 
                project={localProject}
                onFilesUpdate={handleFilesUpdate}
              />
            </div>
            
            {/* 파일 목록 */}
            {localProject.files && localProject.files.length > 0 && (
              <div className="space-y-3">
                <h5 className="font-semibold text-slate-900">업로드된 파일</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {localProject.files.map((file, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 border border-slate-200 hover:border-pink-200 hover:shadow-lg transition-all duration-300 group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-100 rounded-lg group-hover:bg-pink-200 transition-colors">
                          <FileText className="w-5 h-5 text-pink-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">{file.name}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <span>{file.size ? (file.size / 1024).toFixed(1) + 'KB' : 'Unknown size'}</span>
                            <span>•</span>
                            <span>{file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString('ko-KR') : '날짜 미상'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h4 className="text-lg font-bold text-slate-900">활동 로그</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {projectActivities.length}개
                </span>
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {projectActivities.length > 0 ? (
                projectActivities.map(activity => (
                  <div key={activity.id} className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{activity.user.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-slate-900">{activity.user.name}</span>
                          <span className="text-sm text-slate-600">{activity.action}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-800 mb-3">{activity.target}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {activity.time}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                            activity.type === 'task' ? 'bg-emerald-100 text-emerald-700' :
                            activity.type === 'milestone' ? 'bg-orange-100 text-orange-700' :
                            activity.type === 'file' ? 'bg-pink-100 text-pink-700' :
                            activity.type === 'meeting' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {activity.type}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                            activity.priority === 'high' ? 'bg-red-100 text-red-700' :
                            activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {activity.priority}
                          </span>
                        </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl border border-slate-200">
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">활동 기록이 없습니다</h3>
                  <p className="text-sm text-slate-600">프로젝트 활동이 시작되면 여기에 표시됩니다</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* 전체 페이지 오버레이 - 사이드바 영역 제외 */}
      <div 
        className={`fixed inset-y-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 z-50 transition-all duration-500 ease-out backdrop-blur-sm ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          left: getSidebarWidth(),
          right: 0
        }}
      >
        <div className={`h-full flex flex-col transform transition-all duration-500 ease-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}>
          
          {/* Header - 업그레이드된 헤더 */}
          <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex-shrink-0 shadow-sm">
            <div className="max-w-full px-4 sm:px-6 py-5">
              <div className="flex items-center justify-between">
                {/* 뒤로가기 버튼과 프로젝트 정보 */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleClose}
                    className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 rounded-xl transition-all duration-200 flex items-center gap-2 group"
                  >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                    <span className="hidden sm:inline text-sm font-medium">뒤로가기</span>
                  </button>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg">
                      {localProject.icon}
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                        {localProject.name}
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-md truncate">
                        {localProject.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 상태 정보와 진행률 */}
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-xl">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">{progress}% 완료</span>
                  </div>
                  <StatusBadge status={localProject.status} />
                  <PriorityBadge priority={localProject.priority} />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs - 업그레이드된 탭 */}
          <div className="bg-white/60 backdrop-blur-xl border-b border-slate-200/40 flex-shrink-0">
            <div className="max-w-full px-4 sm:px-6 py-2">
              <div className="flex overflow-x-auto scrollbar-hide gap-1">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium whitespace-nowrap rounded-xl transition-all duration-300 border ${
                        isActive
                          ? `${tab.color} border-current shadow-sm scale-105`
                          : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                      {tab.count !== null && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          isActive ? 'bg-white/80' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content - 스크롤 가능한 컨텐츠 영역 */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="max-w-full p-4 sm:p-6 pb-8">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 10px;
          transition: all 0.2s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.6);
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Modals */}
      <TeamManagementModal 
        show={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        project={localProject}
        onTeamUpdate={handleTeamUpdate}
      />

      <MilestoneModal 
        show={showMilestoneModal}
        onClose={() => setShowMilestoneModal(false)}
        project={localProject}
        onMilestonesUpdate={handleMilestonesUpdate}
      />
    </>
  );
};

export default ProjectDetailModal;
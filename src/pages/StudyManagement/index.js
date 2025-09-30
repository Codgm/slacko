import { useState } from 'react';
import {
  Plus, BookOpen, Trophy, Target,
  Clock, BarChart3, Timer, PieChart,
  BookMarked, Search, TrendingUp,
  CheckCircle, Calendar
} from 'lucide-react';
import StudyDashboard from '../../components/study/StudyDashboard';
import SubjectManagement from '../../components/study/SubjectManagement';
import StudyTimer from '../../components/study/StudyTimer';
import GoalSetting from '../../components/study/GoalSetting';
import StudyAnalytics from '../../components/study/StudyAnalytics';
import AddSubjectModal from '../../components/study/AddSubjectModal';
import GoalSettingModal from '../../components/study/GoalSettingModal';
import Toast from '../../components/common/Toast';
import { useStudyContext } from '../../context/StudyContext';

export default function StudyManagementSystem() {
  const {
    subjects,
    studyLogs,
    goals,
    apiSubjects,
    apiStudyLogs,
    apiGoals,
    getTodayRecommendations,
    updateStudyTime,
    updateGoalProgress,
    addSubject,
    setSubjects
  } = useStudyContext();

  // 메인 상태 관리
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [expandedSubjects, setExpandedSubjects] = useState(new Set());

  // 토스트 상태
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // 검색 및 필터 상태 추가
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('전체');

  // API 데이터 로드 (StudyContext에서 자동으로 처리됨)
  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       await loadAllApiData();
  //     } catch (error) {
  //       console.error('학습 관리 데이터 로드 실패:', error);
  //     }
  //   };

  //   loadData();
  // }, [loadAllApiData]);

  // 유틸리티 함수들
  const getProgress = (subject) => {
    return Math.round((subject.completedChapters / subject.totalChapters) * 100);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
  };

  const getTotalStudyTime = () => {
    return subjects?.reduce((total, subject) => total + (subject?.totalStudyTime || 0), 0) || 0;
  };

  const getCompletionRate = () => {
    if (!subjects || subjects.length === 0) return 0;
    const totalChapters = subjects.reduce((total, subject) => total + (subject?.totalChapters || 0), 0);
    const completedChapters = subjects.reduce((total, subject) => total + (subject?.completedChapters || 0), 0);
    return totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
  };

  const getCurrentStreak = () => {
    if (!subjects || subjects.length === 0) return 0;
    return Math.max(...subjects.map(s => s?.currentStreak || 0));
  };

  // API 데이터 또는 mock 데이터 사용 (null/undefined 체크 추가)
  const currentSubjects = (apiSubjects && apiSubjects.length > 0) ? apiSubjects : subjects;
  const currentStudyLogs = (apiStudyLogs && apiStudyLogs.length > 0) ? apiStudyLogs : studyLogs;
  const currentGoals = (apiGoals && apiGoals.length > 0) ? apiGoals : goals;

  // 통계 계산 (null/undefined 체크 추가)
  const stats = {
    total: currentSubjects?.length || 0,
    inProgress: currentSubjects?.filter(s => s.completedChapters > 0 && s.completedChapters < s.totalChapters).length || 0,
    completed: currentSubjects?.filter(s => s.completedChapters === s.totalChapters).length || 0,
    notStarted: currentSubjects?.filter(s => s.completedChapters === 0).length || 0
  };

  // 이벤트 핸들러들
  const toggleChapter = (subjectId, chapterId) => {
    setSubjects(prev => prev.map(subject => {
      if (subject.id === subjectId) {
        const updatedChapters = subject.chapters.map(chapter => {
          if (chapter.id === chapterId) {
            const newCompleted = !chapter.completed;
            return {
              ...chapter,
              completed: newCompleted,
              lastStudied: newCompleted ? new Date().toISOString().split('T')[0] : null
            };
          }
          return chapter;
        });
        
        const completedCount = updatedChapters.filter(ch => ch.completed).length;
        return {
          ...subject,
          chapters: updatedChapters,
          completedChapters: completedCount
        };
      }
      return subject;
    }));
  };

  const updateMemo = (subjectId, chapterId, memo) => {
    setSubjects(prev => prev.map(subject => {
      if (subject.id === subjectId) {
        const updatedChapters = subject.chapters.map(chapter => {
          if (chapter.id === chapterId) {
            return { ...chapter, memo };
          }
          return chapter;
        });
        return { ...subject, chapters: updatedChapters };
      }
      return subject;
    }));
  };

  const toggleSubjectExpansion = (subjectId) => {
    setExpandedSubjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subjectId)) {
        newSet.delete(subjectId);
      } else {
        newSet.add(subjectId);
      }
      return newSet;
    });
  };

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddSubject = (newSubjectData) => {
    const newSubject = {
      ...newSubjectData,
      id: Date.now(),
      totalChapters: newSubjectData.chapters.length,
      completedChapters: 0,
      totalStudyTime: 0,
      currentStreak: 0,
      lastStudyDate: null,
      chapters: newSubjectData.chapters.map((name, index) => ({
        id: index + 1,
        name,
        completed: false,
        memo: '',
        timeSpent: 0,
        difficulty: 3,
        lastStudied: null
      }))
    };
    
    // Context의 addSubject 함수 호출
    addSubject(newSubject);
    showToastMessage('새 과목이 추가되었습니다!', 'success');
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 상단 헤더 바 (원서 관리와 동일한 구조) */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* 페이지 제목 */}
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">학습 관리</h1>
              <p className="text-xs md:text-sm text-slate-600 mt-0.5">체계적인 학습으로 목표를 달성하세요</p>
            </div>

            {/* 우측 액션 버튼들 */}
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-slate-50/80 backdrop-blur px-3 py-2 rounded-lg border border-slate-200/50">
                <Trophy size={16} className="text-amber-500" />
                <span className="text-xs text-slate-600">{getCurrentStreak()}일 연속</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50/80 backdrop-blur px-3 py-2 rounded-lg border border-slate-200/50">
                <Clock size={16} className="text-blue-500" />
                <span className="text-xs text-slate-600">{formatTime(getTotalStudyTime())}</span>
              </div>
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                새 과목
              </button>
            </div>
          </div>

          {/* 통계 카드들 (원서 관리와 동일한 구조) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <BookOpen size={20} className="text-slate-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                  <div className="text-sm text-slate-500">전체 과목</div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp size={20} className="text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-900">{stats.inProgress}</div>
                  <div className="text-sm text-blue-600">진행 중</div>
                </div>
              </div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CheckCircle size={20} className="text-emerald-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-900">{stats.completed}</div>
                  <div className="text-sm text-emerald-600">완료</div>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar size={20} className="text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-900">{stats.notStarted}</div>
                  <div className="text-sm text-orange-600">예정</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 컨트롤 바 (탭 + 검색/필터) */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* 탭 네비게이션 */}
          <div className="flex items-center gap-1 bg-gray-200 p-1 rounded-xl overflow-x-auto">
            {[
              { id: 'dashboard', name: '대시보드', icon: BarChart3 },
              { id: 'subjects', name: '과목 관리', icon: BookMarked },
              { id: 'timer', name: '학습 타이머', icon: Timer },
              { id: 'goals', name: '목표 설정', icon: Target },
              { id: 'analytics', name: '진도 분석', icon: PieChart }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon size={16} />
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* 검색 & 필터 (과목 관리 탭에서만 표시) */}
          {activeTab === 'subjects' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="relative w-full sm:w-auto">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="과목 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-48"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {['전체', '진행 중', '완료', '예정'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      filterStatus === status 
                        ? 'bg-slate-900 text-white' 
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="p-6">
        {/* 탭별 컨텐츠 */}
        {activeTab === 'dashboard' && (
          <StudyDashboard
            subjects={currentSubjects || []}
            studyLogs={currentStudyLogs || []}
            goals={currentGoals || []}
            getProgress={getProgress}
            formatTime={formatTime}
            getTotalStudyTime={getTotalStudyTime}
            getCompletionRate={getCompletionRate}
            getCurrentStreak={getCurrentStreak}
            getTodayRecommendations={getTodayRecommendations}
            updateStudyTime={updateStudyTime}
            updateGoalProgress={updateGoalProgress}
          />
        )}

        {activeTab === 'subjects' && (
          <SubjectManagement
            subjects={currentSubjects || []}
            studyLogs={currentStudyLogs || []}
            expandedSubjects={expandedSubjects}
            getProgress={getProgress}
            formatTime={formatTime}
            toggleChapter={toggleChapter}
            updateMemo={updateMemo}
            toggleSubjectExpansion={toggleSubjectExpansion}
            setSelectedSubject={setSelectedSubject}
            setActiveTab={setActiveTab}
            setShowGoalForm={setShowGoalForm}
            setShowAddForm={setShowAddForm}
            updateStudyTime={updateStudyTime}
            searchQuery={searchQuery}
            filterStatus={filterStatus}
          />
        )}

        {activeTab === 'timer' && (
          <StudyTimer
            subjects={currentSubjects || []}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            showToastMessage={showToastMessage}
            updateStudyTime={updateStudyTime}
            updateGoalProgress={updateGoalProgress}
          />
        )}

        {activeTab === 'goals' && (
          <GoalSetting
            subjects={currentSubjects || []}
            goals={currentGoals || []}
            showToastMessage={showToastMessage}
            updateGoalProgress={updateGoalProgress}
          />
        )}

        {activeTab === 'analytics' && (
          <StudyAnalytics
            subjects={currentSubjects || []}
            studyLogs={currentStudyLogs || []}
            goals={currentGoals || []}
            getProgress={getProgress}
            formatTime={formatTime}
            getTotalStudyTime={getTotalStudyTime}
            getCompletionRate={getCompletionRate}
            getCurrentStreak={getCurrentStreak}
          />
        )}
      </div>

      {/* 모달들 */}
      <AddSubjectModal
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAdd={handleAddSubject}
      />

      <GoalSettingModal
        open={showGoalForm}
        onClose={() => setShowGoalForm(false)}
        showToastMessage={showToastMessage}
      />

      {/* 토스트 알림 */}
      <Toast open={showToast} type={toastType}>
        {toastMessage}
      </Toast>
    </div>
  );
}
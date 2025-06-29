import { useState } from 'react';
import { 
  Calendar, Clock, Target, BookOpen, FileText, AlertCircle, CheckCircle, TrendingUp,
  Plus, X, ChevronDown, ChevronUp, AlarmClock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardWithTodoFlow = () => {
  // 기존 할일 목록 상태
  const [todoList, setTodoList] = useState([
    { id: 1, task: '자료구조 알고리즘 복습', priority: 'high', completed: false, category: '학습', deadline: '2025-07-05' },
    { id: 2, task: '프로젝트 API 설계서 작성', priority: 'high', completed: false, category: '프로젝트', deadline: '2025-07-03' },
    { id: 3, task: '영어 단어 100개 암기', priority: 'medium', completed: true, category: '학습', deadline: '2025-07-02' },
    { id: 4, task: '포트폴리오 웹사이트 디자인', priority: 'medium', completed: false, category: '프로젝트', deadline: '2025-07-08' },
  ]);

  // 할일 추가 관련 상태
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [quickAddMode, setQuickAddMode] = useState(false);
  const [quickTask, setQuickTask] = useState('');
  const [newTodo, setNewTodo] = useState({
    task: '',
    priority: 'medium',
    category: '학습',
    deadline: '',
    estimatedTime: '',
    description: '',
    reminder: false
  });

  // 기존 Dashboard 데이터
  const [currentProjects] = useState([
    { id: 1, name: '웹 개발 포트폴리오', progress: 75, category: '프로젝트', dueDate: '2025-07-15' },
    { id: 2, name: 'React 심화 과정', progress: 45, category: '학습', dueDate: '2025-07-20' },
    { id: 3, name: '데이터베이스 설계', progress: 90, category: '학습', dueDate: '2025-07-10' },
    { id: 4, name: 'UI/UX 디자인 스터디', progress: 30, category: '학습', dueDate: '2025-07-25' },
  ]);

  const [weeklyStudyData] = useState([
    { day: '월', hours: 3.5 },
    { day: '화', hours: 4.2 },
    { day: '수', hours: 2.8 },
    { day: '목', hours: 5.1 },
    { day: '금', hours: 3.9 },
    { day: '토', hours: 6.2 },
    { day: '일', hours: 4.5 },
  ]);

  const [upcomingDeadlines] = useState([
    { id: 1, title: '프로젝트 중간 발표', date: '2025-07-02', type: '발표' },
    { id: 2, title: '자기소개서 제출', date: '2025-07-05', type: '서류' },
    { id: 3, title: '코딩 테스트', date: '2025-07-08', type: '시험' },
    { id: 4, title: '최종 포트폴리오 제출', date: '2025-07-15', type: '제출' },
  ]);

  const weeklyGoal = 85;
  const monthlyGoal = 72;

  const priorities = {
    high: { label: '높음', color: 'bg-red-50 text-red-700 border-red-200', icon: '🔥' },
    medium: { label: '보통', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: '⚡' },
    low: { label: '낮음', color: 'bg-green-50 text-green-700 border-green-200', icon: '🌱' }
  };

  const categories = ['학습', '프로젝트', '과제', '시험', '기타'];

  // 할일 관련 함수들
  const toggleTodo = (id) => {
    setTodoList(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const resetForm = () => {
    setNewTodo({
      task: '',
      priority: 'medium',
      category: '학습',
      deadline: '',
      estimatedTime: '',
      description: '',
      reminder: false
    });
    setShowAdvanced(false);
  };

  const handleAddTodo = () => {
    if (!newTodo.task.trim()) return;

    const todo = {
      id: Date.now(),
      task: newTodo.task,
      priority: newTodo.priority,
      category: newTodo.category,
      deadline: newTodo.deadline,
      estimatedTime: newTodo.estimatedTime,
      description: newTodo.description,
      reminder: newTodo.reminder,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTodoList(prev => [todo, ...prev]);
    setShowAddModal(false);
    resetForm();
  };

  const handleQuickAdd = () => {
    if (!quickTask.trim()) return;

    const todo = {
      id: Date.now(),
      task: quickTask,
      priority: 'medium',
      category: '학습',
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTodoList(prev => [todo, ...prev]);
    setQuickTask('');
    setQuickAddMode(false);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  const getDaysUntilDeadline = (date) => {
    const today = new Date();
    const deadline = new Date(date);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const CircularProgress = ({ percentage, color, size = 96 }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`${color}20`}
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold" style={{ color }}>{percentage}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">학습 대시보드</h1>
          <p className="text-gray-600">오늘도 목표를 향해 한 걸음씩 나아가세요! 📚</p>
        </div>

        {/* 상단 통계 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">이번 주 목표 달성률</p>
                <p className="text-2xl font-bold text-blue-600">{weeklyGoal}%</p>
              </div>
              <div className="w-12 h-12">
                <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">이번 달 목표 달성률</p>
                <p className="text-2xl font-bold text-green-600">{monthlyGoal}%</p>
              </div>
              <div className="w-12 h-12">
                <div className="w-full h-full bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">진행 중인 프로젝트</p>
                <p className="text-2xl font-bold text-purple-600">{currentProjects.length}개</p>
              </div>
              <div className="w-12 h-12">
                <div className="w-full h-full bg-purple-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽 컬럼 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 오늘의 할 일 - 업그레이드된 버전 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">오늘의 할 일</h2>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                      {todoList.filter(todo => !todo.completed).length}개 남음
                    </span>
                  </div>
                  
                  {/* 추가 버튼들 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setQuickAddMode(true)}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      빠른 추가
                    </button>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      상세 추가
                    </button>
                  </div>
                </div>
              </div>

              {/* 빠른 추가 인라인 폼 */}
              {quickAddMode && (
                <div className="p-4 bg-blue-50 border-b border-blue-200">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={quickTask}
                      onChange={(e) => setQuickTask(e.target.value)}
                      placeholder="할 일을 입력하고 Enter를 누르세요"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleQuickAdd()}
                      autoFocus
                    />
                    <button
                      onClick={handleQuickAdd}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      추가
                    </button>
                    <button
                      onClick={() => {
                        setQuickAddMode(false);
                        setQuickTask('');
                      }}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="space-y-3">
                  {todoList.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>아직 등록된 할 일이 없습니다.</p>
                      <p className="text-sm">위 버튼을 눌러 새로운 할 일을 추가해보세요!</p>
                    </div>
                  ) : (
                    todoList.map((todo) => {
                      const priorityConfig = priorities[todo.priority] || priorities.medium;
                      return (
                        <div 
                          key={todo.id} 
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-sm ${
                            todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <span className={`${todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                              {todo.task}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              {todo.category && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                  {todo.category}
                                </span>
                              )}
                              {todo.deadline && (
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(todo.deadline).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
                            {priorityConfig.icon} {priorityConfig.label}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* 진행 중인 프로젝트 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900">진행 중인 프로젝트</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentProjects.map((project) => (
                    <div key={project.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-gray-900 leading-tight">{project.name}</h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                          {project.category}
                        </span>
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>진행률</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>마감: {new Date(project.dueDate).toLocaleDateString()}</span>
                        <span className="text-orange-600 font-medium">
                          D-{getDaysUntilDeadline(project.dueDate)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 이번 주 학습 시간 차트 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">이번 주 학습 시간</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyStudyData}>
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="#f3f4f6"
                        style={{
                          backgroundColor: '#fafafa',
                          background: 'linear-gradient(to bottom, #fafafa, #f9fafb)',
                          border: 'solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <XAxis 
                        dataKey="day" 
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickLine={{ stroke: '#d1d5db' }}
                        axisLine={{ stroke: '#d1d5db' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickLine={{ stroke: '#d1d5db' }}
                        axisLine={{ stroke: '#d1d5db' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: 'solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="hours" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, fill: '#8b5cf6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="space-y-6">
            {/* 목표 달성률 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-orange-600" />
                  <h2 className="text-lg font-semibold text-gray-900">목표 달성률</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-8">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 mb-4">이번 주</p>
                    <div className="flex justify-center">
                      <CircularProgress percentage={weeklyGoal} color="#3b82f6" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 mb-4">이번 달</p>
                    <div className="flex justify-center">
                      <CircularProgress percentage={monthlyGoal} color="#10b981" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 다가오는 마감일 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <h2 className="text-lg font-semibold text-gray-900">다가오는 마감일</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingDeadlines.map((deadline) => {
                    const daysLeft = getDaysUntilDeadline(deadline.date);
                    const isUrgent = daysLeft <= 3;
                    
                    return (
                      <div key={deadline.id} className={`p-3 rounded-lg border ${isUrgent ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{deadline.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${isUrgent ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                            {deadline.type}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{new Date(deadline.date).toLocaleDateString()}</span>
                          <span className={`font-medium ${isUrgent ? 'text-red-600' : 'text-orange-600'}`}>
                            D-{daysLeft}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 상세 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">새 할 일 추가</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  할 일 *
                </label>
                <input
                  type="text"
                  value={newTodo.task}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, task: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 데이터베이스 과제 완료하기"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    우선순위
                  </label>
                  <select
                    value={newTodo.priority}
                    onChange={(e) => setNewTodo(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(priorities).map(([key, config]) => (
                      <option key={key} value={key}>{config.icon} {config.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    카테고리
                  </label>
                  <select
                    value={newTodo.category}
                    onChange={(e) => setNewTodo(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 고급 옵션 토글 */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              >
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                고급 옵션
              </button>

              {/* 고급 옵션 */}
              {showAdvanced && (
                <div className="space-y-4 pt-2 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        마감일
                      </label>
                      <input
                        type="date"
                        value={newTodo.deadline}
                        onChange={(e) => setNewTodo(prev => ({ ...prev, deadline: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        예상 소요시간
                      </label>
                      <input
                        type="text"
                        value={newTodo.estimatedTime}
                        onChange={(e) => setNewTodo(prev => ({ ...prev, estimatedTime: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="예: 2시간"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      메모
                    </label>
                    <textarea
                      value={newTodo.description}
                      onChange={(e) => setNewTodo(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      placeholder="추가 메모나 설명을 입력하세요"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="reminder"
                      checked={newTodo.reminder}
                      onChange={(e) => setNewTodo(prev => ({ ...prev, reminder: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="reminder" className="text-sm text-gray-700 flex items-center gap-2">
                      <AlarmClock className="w-4 h-4" />
                      마감일 알림 받기
                    </label>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 p-4 border-t">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleAddTodo}
                disabled={!newTodo.task.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 플로팅 액션 버튼 (우하단) */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default DashboardWithTodoFlow;
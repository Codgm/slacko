import React, { useState } from 'react';
import { 
  Clock, Target, CheckCircle, User, Settings
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import TodoSection from '../../components/dashboard/TodoSection';
import ProjectSection from '../../components/dashboard/ProjectSection';
import DeadlineSection from '../../components/dashboard/DeadlineSection';

const Dashboard = () => {
  // 상태 관리
  const [todoList, setTodoList] = useState([
    { id: 1, task: '자료구조 알고리즘 복습', priority: 'high', completed: false, category: '학습', deadline: '2025-07-05' },
    { id: 2, task: '프로젝트 API 설계서 작성', priority: 'high', completed: false, category: '프로젝트', deadline: '2025-07-03' },
    { id: 3, task: '영어 단어 100개 암기', priority: 'medium', completed: true, category: '학습', deadline: '2025-07-02' },
    { id: 4, task: '포트폴리오 웹사이트 디자인', priority: 'medium', completed: false, category: '프로젝트', deadline: '2025-07-08' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [quickAddMode, setQuickAddMode] = useState(false);
  const [quickTask, setQuickTask] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const [newTodo, setNewTodo] = useState({
    task: '',
    priority: 'medium',
    category: '학습',
    deadline: '',
    estimatedTime: '',
    description: '',
    reminder: false
  });

  // 프로젝트 데이터
  const [currentProjects] = useState([
    { id: 1, name: '웹 개발 포트폴리오', progress: 75, category: '프로젝트', dueDate: '2025-07-15' },
    { id: 2, name: 'React 심화 과정', progress: 45, category: '학습', dueDate: '2025-07-20' },
    { id: 3, name: '데이터베이스 설계', progress: 90, category: '학습', dueDate: '2025-07-10' },
    { id: 4, name: 'UI/UX 디자인 스터디', progress: 30, category: '학습', dueDate: '2025-07-25' },
  ]);

  // 학습 데이터
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

  // 설정
  const priorities = {
    high: { label: '높음', color: 'bg-red-50 text-red-700 border-red-200', icon: '🔥' },
    medium: { label: '보통', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: '⚡' },
    low: { label: '낮음', color: 'bg-green-50 text-green-700 border-green-200', icon: '🌱' }
  };

  const categories = ['학습', '프로젝트', '과제', '시험', '기타'];

  // 통계 계산
  const weeklyGoal = 85;
  const monthlyGoal = 72;
  const totalStudyTime = weeklyStudyData.reduce((sum, day) => sum + day.hours, 0);
  const completedTodos = todoList.filter(todo => todo.completed).length;

  // 함수들
  const toggleTodo = (id) => {
    setTodoList(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
    showToastMessage('할 일 상태가 업데이트되었습니다.', 'success');
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
    if (!newTodo.task.trim()) {
      showToastMessage('할 일 내용을 입력해주세요.', 'error');
      return;
    }

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
    showToastMessage('새로운 할 일이 추가되었습니다.', 'success');
  };

  const handleQuickAdd = () => {
    if (!quickTask.trim()) {
      showToastMessage('할 일 내용을 입력해주세요.', 'error');
      return;
    }

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
    showToastMessage('할 일이 빠르게 추가되었습니다.', 'success');
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

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  // 원형 진행률 컴포넌트
  const CircularProgress = ({ percentage, color, size = 96, label }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="text-center">
        <div className="relative inline-block" style={{ width: size, height: size }}>
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
        {label && <p className="text-sm text-gray-600 mt-2">{label}</p>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 해더 - 카드 바깥 */}
      <div className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 mb-0">
        <div className="max-w mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span role="img" aria-label="대시보드">📊</span> 학습 대시보드
          </h1>
          <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="ghost" size="sm"><Settings className="w-5 h-5" /></Button>
          <Button variant="ghost" size="sm"><User className="w-5 h-5" /></Button>
        </div>
        </div>
      </div>
      {/* 메인 카드/콘텐츠 - Dashboard.js 구조 반영 */}
      <div className="max-w-7xl mx-auto p-8 px-6 pb-12">
        {/* 상단 통계 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <Card className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{weeklyGoal}%</h3>
            <p className="text-sm text-gray-600">주간 목표 달성률</p>
          </Card>

          <Card className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{totalStudyTime}h</h3>
            <p className="text-sm text-gray-600">이번 주 총 학습 시간</p>
          </Card>

          <Card className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{completedTodos}</h3>
            <p className="text-sm text-gray-600">완료된 할 일</p>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽 컬럼: 할일, 프로젝트, 차트 등 */}
          <div className="lg:col-span-2 space-y-6">
                        {/* 할 일 섹션 */}
            {todoList.length === 0 ? (
              <div className="text-center text-gray-400 py-12">아직 등록된 할 일이 없습니다.</div>
            ) : (
              <div className="mb-8">
                <TodoSection
                  todoList={todoList}
                  priorities={priorities}
                  getPriorityColor={getPriorityColor}
                  toggleTodo={toggleTodo}
                  setQuickAddMode={setQuickAddMode}
                  quickAddMode={quickAddMode}
                  quickTask={quickTask}
                  setQuickTask={setQuickTask}
                  handleQuickAdd={handleQuickAdd}
                  setShowAddModal={setShowAddModal}
                  showAddModal={showAddModal}
                  newTodo={newTodo}
                  setNewTodo={setNewTodo}
                  showAdvanced={showAdvanced}
                  setShowAdvanced={setShowAdvanced}
                  resetForm={resetForm}
                  handleAddTodo={handleAddTodo}
                  categories={categories}
                />
              </div>
            )}
            {/* 학습 차트 */}
            <div className="mb-8">
              <div className="bg-white rounded-2xl shadow-xl border p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">이번 주 학습 시간</h3>
                  <Button variant="outline" size="sm">
                    상세 보기
                  </Button>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyStudyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
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
          {/* 오른쪽 컬럼: 목표, 마감 등 */}
          <div className="space-y-6">
            {/* 진행률 원형 차트 */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">목표 진행률</h3>
              <div className="grid grid-cols-2 gap-4">
                <CircularProgress percentage={weeklyGoal} color="#3b82f6" label="주간 목표" />
                <CircularProgress percentage={monthlyGoal} color="#8b5cf6" label="월간 목표" />
              </div>
            </Card>

            {/* 프로젝트 섹션 */}
            {currentProjects.length === 0 ? (
              <div className="text-center text-gray-400 py-12">진행 중인 프로젝트가 없습니다.</div>
            ) : (
              <div className="mb-8">
                <ProjectSection
                  currentProjects={currentProjects}
                  getProgressColor={getProgressColor}
                  getDaysUntilDeadline={getDaysUntilDeadline}
                />
              </div>
            )}

            {/* 마감 임박 섹션 */}
            {upcomingDeadlines.length === 0 ? (
              <div className="text-center text-gray-400 py-12">임박한 마감 일정이 없습니다.</div>
            ) : (
              <div className="mb-8">
                <DeadlineSection upcomingDeadlines={upcomingDeadlines} getDaysUntilDeadline={getDaysUntilDeadline} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 할 일 추가 모달 */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">새로운 할 일 추가</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              할 일 내용 *
            </label>
            <input
              type="text"
              value={newTodo.task}
              onChange={(e) => setNewTodo(prev => ({ ...prev, task: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="할 일을 입력하세요"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                우선순위
              </label>
              <select
                value={newTodo.priority}
                onChange={(e) => setNewTodo(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">낮음</option>
                <option value="medium">보통</option>
                <option value="high">높음</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카테고리
              </label>
              <select
                value={newTodo.category}
                onChange={(e) => setNewTodo(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              마감일
            </label>
            <input
              type="date"
              value={newTodo.deadline}
              onChange={(e) => setNewTodo(prev => ({ ...prev, deadline: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              취소
            </Button>
            <Button variant="primary" onClick={handleAddTodo}>
              추가
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toast 알림 */}
      <Toast 
        open={showToast} 
        onClose={() => setShowToast(false)}
        type={toastType}
      >
        {toastMessage}
      </Toast>
    </div>
  );
};

export default Dashboard;
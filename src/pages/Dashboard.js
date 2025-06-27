import React, { useState } from 'react';
import { Calendar, Clock, Target, BookOpen, FileText, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StudyCalendar from './StudyCalendar';

const Dashboard = () => {
  // 샘플 데이터 (날짜를 2025년으로 업데이트)
  const [todoList, setTodoList] = useState([
    { id: 1, task: '자료구조 알고리즘 복습', priority: 'high', completed: false },
    { id: 2, task: '프로젝트 API 설계서 작성', priority: 'high', completed: false },
    { id: 3, task: '영어 단어 100개 암기', priority: 'medium', completed: true },
    { id: 4, task: '포트폴리오 웹사이트 디자인', priority: 'medium', completed: false },
  ]);

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

  const weeklyGoal = 85; // 이번 주 목표 달성률
  const monthlyGoal = 72; // 이번 달 목표 달성률

  const toggleTodo = (id) => {
    setTodoList(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
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
            {/* 오늘의 할 일 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">오늘의 할 일</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {todoList.map((todo) => (
                    <div key={todo.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${todo.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                      <input 
                        type="checkbox" 
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className={`flex-1 ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {todo.task}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
                        {todo.priority === 'high' ? '높음' : todo.priority === 'medium' ? '보통' : '낮음'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* <StudyCalendar /> */}

            {/* 현재 진행 중인 프로젝트 */}
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
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>마감: {project.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 주간 학습 시간 그래프 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">주간 학습 시간</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyStudyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value}시간`, '학습 시간']}
                        contentStyle={{ 
                          backgroundColor: '#ffffff',
                          border: '1px solid #e5e7eb',
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
            {/* 목표 달성률 원형 차트 */}
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
                      <CircularProgress percentage={monthlyGoal} color="#22c55e" />
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
                <div className="space-y-3">
                  {upcomingDeadlines.map((deadline) => {
                    const daysLeft = getDaysUntilDeadline(deadline.date);
                    return (
                      <div key={deadline.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{deadline.title}</p>
                          <p className="text-xs text-gray-500">{deadline.date}</p>
                        </div>
                        <div className="text-right ml-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            daysLeft <= 3 ? 'bg-red-100 text-red-800' : 
                            daysLeft <= 7 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {daysLeft > 0 ? `${daysLeft}일 후` : daysLeft === 0 ? '오늘' : '지남'}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{deadline.type}</p>
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
    </div>
  );
};

export default Dashboard;
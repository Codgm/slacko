import { useState } from 'react';
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight, BookOpen, Code, Check, RotateCcw, Flag, Trash2, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useProjectContext } from '../../context/ProjectContext';
import { getCurrentDate, formatDate as formatDateUtil, isToday as isTodayUtil } from '../../utils/dateUtils';

const StudyCalendar = () => {
  const { projects } = useProjectContext();
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  const [view, setView] = useState('month'); // month, week, day
  const [showAddModal, setShowAddModal] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: '알고리즘 6강 듣기',
      type: 'study',
      date: '2025-08-01',
      time: '14:00',
      duration: 2,
      repeat: 'none',
      memo: '중요 개념: DP 테이블 구조',
      completed: false
    },
    {
      id: 2,
      title: 'OS 100~130p 읽기',
      type: 'reading',
      date: '2025-08-02',
      time: '10:00',
      duration: 1.5,
      repeat: 'none',
      memo: '프로세스 스케줄링 부분',
      completed: false
    },
    {
      id: 3,
      title: 'React 프로젝트 리팩토링',
      type: 'coding',
      date: '2025-08-03',
      time: '15:00',
      duration: 3,
      repeat: 'none',
      memo: '컴포넌트 분리 및 최적화',
      completed: false
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'study',
    date: '',
    time: '',
    duration: 1,
    repeat: 'none',
    memo: ''
  });

  const eventTypes = {
    study: { label: '학습', icon: BookOpen, color: 'bg-blue-100 text-blue-800 border-blue-200' },
    reading: { label: '독서', icon: BookOpen, color: 'bg-green-100 text-green-800 border-green-200' },
    coding: { label: '코딩', icon: Code, color: 'bg-purple-100 text-purple-800 border-purple-200' },
    milestone: { label: '마일스톤', icon: Flag, color: 'bg-orange-100 text-orange-800 border-orange-200' },
    task: { label: '작업', icon: CheckCircle2, color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    project: { label: '프로젝트', icon: Flag, color: 'bg-pink-100 text-pink-800 border-pink-200' },
    deadline: { label: '마감', icon: AlertCircle, color: 'bg-red-100 text-red-800 border-red-200' }
  };

  const repeatOptions = {
    none: '반복 안함',
    daily: '매일',
    weekly: '매주',
    monthly: '매월'
  };

  // 프로젝트 데이터를 캘린더 이벤트로 변환
  const getProjectEvents = () => {
    const projectEvents = [];
    
    projects.forEach(project => {
      // 마일스톤 이벤트 추가
      project.milestones?.forEach(milestone => {
        projectEvents.push({
          id: `milestone-${milestone.id}`,
          title: `${project.name}: ${milestone.title}`,
          type: 'milestone',
          date: milestone.date,
          time: '',
          duration: 0,
          repeat: 'none',
          memo: `프로젝트: ${project.name}`,
          completed: milestone.completed,
          projectColor: project.color,
          projectIcon: project.icon
        });
      });
      
      // 작업 마감일 이벤트 추가
      project.tasks?.forEach(task => {
        if (task.dueDate) {
          projectEvents.push({
            id: `task-${task.id}`,
            title: `${project.name}: ${task.title}`,
            type: 'task',
            date: task.dueDate,
            time: '',
            duration: 0,
            repeat: 'none',
            memo: '',
            completed: task.status === 'completed',
            projectColor: project.color,
            projectIcon: project.icon,
            priority: task.priority
          });
        }
      });
      
      // 프로젝트 시작/종료일 이벤트 추가
      if (project.startDate) {
        projectEvents.push({
          id: `project-start-${project.id}`,
          title: `${project.name} 시작`,
          type: 'project',
          date: project.startDate,
          time: '',
          duration: 0,
          repeat: 'none',
          memo: project.description,
          completed: false,
          projectColor: project.color,
          projectIcon: project.icon
        });
      }
      
      if (project.endDate) {
        projectEvents.push({
          id: `project-end-${project.id}`,
          title: `${project.name} 마감`,
          type: 'deadline',
          date: project.endDate,
          time: '',
          duration: 0,
          repeat: 'none',
          memo: project.description,
          completed: project.status === 'completed',
          projectColor: project.color,
          projectIcon: project.icon
        });
      }
    });
    
    return projectEvents;
  };

  const allEvents = [...events, ...getProjectEvents()];

  // 날짜 관련 유틸리티 함수들
  const formatDate = (date) => {
    return formatDateUtil(date);
  };

  const getMonthCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendar = [];
    let currentWeek = [];
    
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      currentWeek.push(currentDate);
      
      if (currentWeek.length === 7) {
        calendar.push(currentWeek);
        currentWeek = [];
      }
    }
    
    return calendar;
  };

  const getWeekDays = (date) => {
    const weekDays = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

  const getEventsForDate = (date) => {
    const dateStr = formatDate(date);
    return allEvents.filter(event => event.date === dateStr);
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    
    switch (view) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + direction);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction * 7));
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + direction);
        break;
      default:
        break;
    }
    
    setCurrentDate(newDate);
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return;

    const event = {
      id: Date.now(),
      ...newEvent,
      completed: false
    };

    setEvents([...events, event]);
    setNewEvent({
      title: '',
      type: 'study',
      date: '',
      time: '',
      duration: 1,
      repeat: 'none',
      memo: ''
    });
    setShowAddModal(false);
  };

  const toggleEventComplete = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, completed: !event.completed } : event
    ));
  };

  const deleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const openAddModal = (date) => {
    setNewEvent(prev => ({ ...prev, date: formatDate(date) }));
    setShowAddModal(true);
  };

  // 월간 보기 렌더링
  const renderMonthView = () => {
    const calendar = getMonthCalendar(currentDate);
    
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="grid grid-cols-7 border-b">
          {['일', '월', '화', '수', '목', '금', '토'].map(day => (
            <div key={day} className="p-3 text-center font-medium text-gray-600 border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        {calendar.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-b last:border-b-0">
            {week.map((date, dayIndex) => {
              const dayEvents = getEventsForDate(date);
              const isToday = isTodayUtil(date);
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              
              return (
                <div 
                  key={dayIndex}
                  className={`min-h-24 p-2 border-r last:border-r-0 cursor-pointer hover:bg-gray-50 ${
                    !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                  }`}
                  onClick={() => openAddModal(date)}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''
                  }`}>
                    {date.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => {
                      const typeConfig = eventTypes[event.type];
                      const Icon = typeConfig.icon;
                      
                      return (
                        <div 
                          key={event.id}
                          className={`text-xs px-1 py-0.5 rounded flex items-center gap-1 ${
                            event.projectColor ? 'text-white' : `${typeConfig.color} text-white`
                          } ${event.completed ? 'opacity-60 line-through' : ''}`}
                          style={event.projectColor ? { backgroundColor: event.projectColor } : {}}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!event.id.toString().includes('project') && !event.id.toString().includes('milestone') && !event.id.toString().includes('task')) {
                              toggleEventComplete(event.id);
                            }
                          }}
                        >
                          {event.projectIcon ? (
                            <span className="text-xs">{event.projectIcon}</span>
                          ) : (
                            <Icon size={10} />
                          )}
                          <span className="truncate">{event.title}</span>
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayEvents.length - 2}개 더
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // 주간 보기 렌더링
  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="grid grid-cols-8 border-b">
          <div className="p-3 border-r"></div>
          {weekDays.map((date, index) => {
            const isToday = isTodayUtil(date);
            return (
              <div key={index} className="p-3 text-center border-r last:border-r-0">
                <div className="font-medium text-gray-600">
                  {['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}
                </div>
                <div className={`text-lg font-bold mt-1 ${
                  isToday ? 'bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''
                }`}>
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        
        {Array.from({ length: 12 }, (_, hour) => hour + 9).map(hour => (
          <div key={hour} className="grid grid-cols-8 border-b last:border-b-0 min-h-12">
            <div className="p-2 border-r text-sm text-gray-500 font-medium">
              {hour}:00
            </div>
            {weekDays.map((date, dayIndex) => {
              const dayEvents = getEventsForDate(date).filter(event => {
                const eventHour = parseInt(event.time?.split(':')[0] || '0');
                return eventHour === hour;
              });
              
              return (
                <div 
                  key={dayIndex}
                  className="p-1 border-r last:border-r-0 cursor-pointer hover:bg-gray-50"
                  onClick={() => openAddModal(date)}
                >
                  {dayEvents.map(event => {
                    const typeConfig = eventTypes[event.type];
                    const Icon = typeConfig.icon;
                    
                    return (
                      <div 
                        key={event.id}
                        className={`text-xs px-2 py-1 rounded flex items-center gap-1 mb-1 ${
                          event.projectColor ? 'text-white' : `${typeConfig.color} text-white`
                        } ${event.completed ? 'opacity-60 line-through' : ''}`}
                        style={event.projectColor ? { backgroundColor: event.projectColor } : {}}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!event.id.toString().includes('project') && !event.id.toString().includes('milestone') && !event.id.toString().includes('task')) {
                            toggleEventComplete(event.id);
                          }
                        }}
                      >
                        {event.projectIcon ? (
                          <span className="text-xs">{event.projectIcon}</span>
                        ) : (
                          <Icon size={10} />
                        )}
                        <span className="truncate">{event.title}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // 일간 보기 렌더링
  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);
    const today = new Date();
    const isToday = formatDate(currentDate) === formatDate(today);
    
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월 {currentDate.getDate()}일
              {isToday && <span className="ml-2 text-sm bg-blue-500 text-white px-2 py-1 rounded">오늘</span>}
            </h3>
            <button
              onClick={() => openAddModal(currentDate)}
              className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Plus size={16} />
              일정 추가
            </button>
          </div>
        </div>
        
        <div className="p-4">
          {dayEvents.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Calendar size={48} className="mx-auto mb-2 opacity-50" />
              <p>오늘 등록된 일정이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dayEvents.map(event => {
                const typeConfig = eventTypes[event.type];
                const Icon = typeConfig.icon;
                
                return (
                  <div 
                    key={event.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      event.projectColor ? 'border-l-4' : typeConfig.color.replace('bg-', 'border-')
                    } bg-gray-50 ${
                      event.completed ? 'opacity-60' : ''
                    }`}
                    style={event.projectColor ? { borderLeftColor: event.projectColor } : {}}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {event.projectIcon ? (
                            <span className="text-lg">{event.projectIcon}</span>
                          ) : (
                            <Icon size={16} className={typeConfig.color.replace('bg-', 'text-')} />
                          )}
                          <h4 className={`font-medium ${event.completed ? 'line-through' : ''}`}>
                            {event.title}
                          </h4>
                          <span className="text-xs px-2 py-1 bg-gray-200 rounded">
                            {typeConfig.label}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-4">
                            {event.time && (
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {event.time} ({event.duration}시간)
                              </span>
                            )}
                            {event.repeat !== 'none' && (
                              <span className="flex items-center gap-1">
                                <RotateCcw size={12} />
                                {repeatOptions[event.repeat]}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {event.memo && (
                          <p className="text-sm text-gray-700 bg-white p-2 rounded border">
                            {event.memo}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {!event.id.toString().includes('project') && !event.id.toString().includes('milestone') && !event.id.toString().includes('task') && (
                          <>
                            <button
                              onClick={() => toggleEventComplete(event.id)}
                              className={`p-1 rounded ${
                                event.completed 
                                  ? 'bg-green-500 text-white' 
                                  : 'border-2 border-gray-300 hover:border-green-500'
                              }`}
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => deleteEvent(event.id)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 해더 - 카드 바깥 */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-20 shadow-sm">
        <div className="max-w mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg">
              <Calendar size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                학습 캘린더
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">체계적인 일정 관리로 학습 효과를 극대화하세요</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50/80 backdrop-blur px-3 py-2 rounded-xl border border-slate-200/50">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-600">오늘 {getEventsForDate(new Date()).length}개 일정</span>
            </div>
            <button 
              className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-rose-700 transition-all duration-300 flex items-center gap-2 font-medium"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={18} /> 일정 추가
            </button>
          </div>
        </div>
      </div>
      {/* 메인 카드 */}
      <div className="max-w-7xl mx-auto px-6 py-6 pb-12">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
          {/* 캘린더 헤더/탭/네비게이션 등 */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateDate(-1)}
                    className="p-2 hover:bg-gray-200 rounded"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h2 className="text-xl font-semibold min-w-48 text-center">
                    {view === 'month' && `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`}
                    {view === 'week' && `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일 주`}
                    {view === 'day' && `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`}
                  </h2>
                  <button
                    onClick={() => navigateDate(1)}
                    className="p-2 hover:bg-gray-200 rounded"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="ml-2 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    오늘
                  </button>
                </div>
              </div>
              {/* 보기 모드 선택 */}
              <div className="flex bg-gray-200 rounded-lg p-1">
                {[
                  { key: 'month', label: '월간' },
                  { key: 'week', label: '주간' },
                  { key: 'day', label: '일간' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setView(key)}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      view === key 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* 캘린더 본체 */}
          <div>
            {view === 'month' && renderMonthView()}
            {view === 'week' && renderWeekView()}
            {view === 'day' && renderDayView()}
          </div>
        </div>
      </div>
      
      {/* 일정 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">새 일정 추가</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목 *
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 알고리즘 6강 듣기"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  종류
                </label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(eventTypes).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    날짜 *
                  </label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    시간
                  </label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    소요시간 (시간)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, duration: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    반복
                  </label>
                  <select
                    value={newEvent.repeat}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, repeat: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(repeatOptions).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  메모
                </label>
                <textarea
                  value={newEvent.memo}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, memo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="추가 정보나 메모를 입력하세요"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleAddEvent}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyCalendar;
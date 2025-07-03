import { useState } from 'react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight, BookOpen, Code, Check, RotateCcw, Flag, Trash2, X } from 'lucide-react';

export default function StudyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, week, day
  const [showAddModal, setShowAddModal] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: '알고리즘 6강 듣기',
      type: 'study',
      date: '2024-12-28',
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
      date: '2024-12-29',
      time: '19:00',
      duration: 1.5,
      repeat: 'none',
      memo: '',
      completed: true
    },
    {
      id: 3,
      title: '캡스톤 중간발표',
      type: 'project',
      date: '2024-12-30',
      time: '14:00',
      duration: 1,
      repeat: 'none',
      memo: '발표자료 준비 완료',
      completed: false
    },
    {
      id: 4,
      title: '복습: 자료구조',
      type: 'review',
      date: '2024-12-31',
      time: '10:00',
      duration: 1,
      repeat: 'weekly',
      memo: '지난 주 학습 내용 복습',
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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const eventTypes = {
    study: { label: '학습', color: 'bg-blue-500', icon: BookOpen },
    review: { label: '복습', color: 'bg-green-500', icon: RotateCcw },
    project: { label: '프로젝트', color: 'bg-purple-500', icon: Flag },
    reading: { label: '원서읽기', color: 'bg-orange-500', icon: Code },
  };

  const repeatOptions = {
    none: '반복 안함',
    daily: '매일',
    weekly: '매주',
    monthly: '매월'
  };

  // 날짜 관련 유틸리티 함수들
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getMonthCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendar = [];
    const current = new Date(startDate);
    
    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        weekDays.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      calendar.push(weekDays);
      if (current > lastDay && current.getDay() === 0) break;
    }
    
    return calendar;
  };

  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

  const getEventsForDate = (date) => {
    const dateStr = formatDate(date);
    return events.filter(event => event.date === dateStr);
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
    setToastMessage('일정이 성공적으로 추가되었습니다!');
    setToastType('success');
    setShowToast(true);
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
    const today = new Date();
    
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
              const isToday = formatDate(date) === formatDate(today);
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              return (
                <div
                  key={dayIndex}
                  className={`relative h-24 p-2 border-r last:border-r-0 cursor-pointer transition-colors ${
                    isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
                  } ${isToday ? 'ring-2 ring-blue-400 z-10' : ''}`}
                  onClick={() => openAddModal(date)}
                >
                  <div className="text-xs font-semibold mb-1 text-right">
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={`truncate px-2 py-1 rounded text-xs font-medium text-white ${eventTypes[event.type].color}`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-blue-500">+{dayEvents.length - 2}개 더보기</div>
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

  // 주간/일간 보기 등 추가 렌더링 함수는 필요시 구현

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 mb-8">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">학습 캘린더</h1>
                <p className="text-sm text-gray-600">일정과 학습 계획을 한눈에 관리하세요!</p>
              </div>
              <Button
                onClick={() => setShowAddModal(true)}
                variant="primary"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                새 일정 추가
              </Button>
            </div>
          </div>
        </div>
        {/* 뷰 전환 및 네비게이션 */}
        <div className="flex items-center gap-2 mb-4">
          <Button 
            onClick={() => setView('month')} 
            variant={view === 'month' ? 'primary' : 'ghost'}
            size="sm"
          >
            월간
          </Button>
          <Button 
            onClick={() => setView('week')} 
            variant={view === 'week' ? 'primary' : 'ghost'}
            size="sm"
          >
            주간
          </Button>
          <Button 
            onClick={() => setView('day')} 
            variant={view === 'day' ? 'primary' : 'ghost'}
            size="sm"
          >
            일간
          </Button>
          <div className="flex-1" />
          <Button onClick={() => navigateDate(-1)} variant="ghost" size="sm" className="p-2">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="font-medium text-gray-800">{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</span>
          <Button onClick={() => navigateDate(1)} variant="ghost" size="sm" className="p-2">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
        {/* 캘린더 뷰 */}
        {view === 'month' && renderMonthView()}
        {/* TODO: 주간/일간 뷰 구현 필요시 추가 */}
      </div>
      {/* 일정 추가 모달 */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        className="max-w-md"
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
            <input
              type="text"
              value={newEvent.title}
              onChange={e => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: 자료구조 복습"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">유형</label>
              <select
                value={newEvent.type}
                onChange={e => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(eventTypes).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">날짜 *</label>
              <input
                type="date"
                value={newEvent.date}
                onChange={e => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">시간</label>
              <input
                type="time"
                value={newEvent.time}
                onChange={e => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">소요시간(시간)</label>
              <input
                type="number"
                min={0.5}
                step={0.5}
                value={newEvent.duration}
                onChange={e => setNewEvent(prev => ({ ...prev, duration: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">반복</label>
              <select
                value={newEvent.repeat}
                onChange={e => setNewEvent(prev => ({ ...prev, repeat: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(repeatOptions).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">메모</label>
              <input
                type="text"
                value={newEvent.memo}
                onChange={e => setNewEvent(prev => ({ ...prev, memo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="추가 메모"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 pt-4 border-t">
          <Button
            onClick={() => setShowAddModal(false)}
            variant="outline"
            className="flex-1"
          >
            취소
          </Button>
          <Button
            onClick={handleAddEvent}
            disabled={!newEvent.title.trim() || !newEvent.date}
            variant="primary"
            className="flex-1"
          >
            추가하기
          </Button>
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
} 
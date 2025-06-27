import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Minus, Plus } from 'lucide-react';

const FloatingCalendar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [iconSize, setIconSize] = useState(56); // 기본 크기
  const [opacity, setOpacity] = useState(0.8);
  const calendarRef = useRef(null);

  // 캘린더 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const today = new Date();

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selected);
    setIsOpen(false);
  };

  const isToday = (day) => {
    return today.getDate() === day && 
           today.getMonth() === currentDate.getMonth() && 
           today.getFullYear() === currentDate.getFullYear();
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day && 
           selectedDate.getMonth() === currentDate.getMonth() && 
           selectedDate.getFullYear() === currentDate.getFullYear();
  };

  const formatDate = (date) => {
    if (!date) return '날짜를 선택하세요';
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // 빈 셀 추가 (이전 달 마지막 날들)
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }
    
    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`
            w-8 h-8 text-sm rounded-full transition-all duration-200 hover:scale-110 font-medium
            ${isToday(day) ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
            ${isSelected(day) ? 'bg-green-500 text-white hover:bg-green-600' : ''}
            ${!isToday(day) && !isSelected(day) ? 'text-gray-700 hover:bg-blue-100 hover:text-blue-600' : ''}
          `}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-8">

      {/* 플로팅 캘린더 컨테이너 */}
      <div className="fixed bottom-6 right-6 z-50" ref={calendarRef}>
        {/* 캘린더 팝업 */}
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-4 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="w-72">
              {/* 캘린더 헤더 */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                
                <h2 className="text-lg font-semibold text-gray-800">
                  {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
                </h2>
                
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* 요일 헤더 */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* 날짜 그리드 */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {renderCalendarDays()}
              </div>

              {/* 투명도 조절 */}
              {/* <div className="border-t pt-3">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>투명도:</span>
                  <span>{Math.round(opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="1"
                  step="0.1"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div> */}
            </div>
          </div>
        )}

        {/* 크기 조절 버튼들 */}
        {/* <div className="flex gap-2 mb-2 justify-end">
          <button
            onClick={() => setIconSize(Math.max(40, iconSize - 8))}
            className="w-8 h-8 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center hover:scale-110"
            style={{ opacity }}
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
          
          <button
            onClick={() => setIconSize(Math.min(80, iconSize + 8))}
            className="w-8 h-8 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center hover:scale-110"
            style={{ opacity }}
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div> */}

        {/* 메인 플로팅 버튼 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
          style={{ 
            width: `${iconSize}px`, 
            height: `${iconSize}px`,
            opacity 
          }}
        >
          <Calendar className="text-white" style={{ width: `${iconSize * 0.4}px`, height: `${iconSize * 0.4}px` }} />
        </button>

        {/* 오늘 날짜 표시 */}
        <div 
          className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
          style={{ opacity }}
        >
          {today.getDate()}
        </div>
      </div>
    </div>
  );
};

export default FloatingCalendar;
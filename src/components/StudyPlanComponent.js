import { useState } from "react";

export default function StudyPlanComponent() {
  const [startDate, setStartDate] = useState('2025-07-07');
  const [studyWeeks, setStudyWeeks] = useState(8);
  const [studyIntensity, setStudyIntensity] = useState('normal');
  const [showPlan, setShowPlan] = useState(false);
  const [taskStatuses, setTaskStatuses] = useState({});
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');

  // 교재 목차 데이터
  const chapters = [
    {
      id: 1,
      title: "딥러닝, HTML 시작하기",
      sections: ["웹과 HTML 소개", "딥러닝 개요", "개발환경 설정", "첫 번째 예제"],
      difficulty: "easy",
      estimatedHours: 6
    },
    {
      id: 2,
      title: "딥러닝 사전 지식",
      sections: ["수학 기초", "통계 기초", "파이썬 기초", "포럼 활용법", "학습 가이드", "QR코드 토론"],
      difficulty: "easy", 
      estimatedHours: 8
    },
    {
      id: 3,
      title: "딥러닝 소개",
      sections: ["딥러닝 개념", "데이터 조작", "선형대수", "미분", "확률과 통계", "자동 미분", "확률 분포", "나이브 베이즈", "QR코드 토론"],
      difficulty: "medium",
      estimatedHours: 16
    },
    {
      id: 4,
      title: "딥러닝 계산",
      sections: ["텐서 조작", "Gluon 인터페이스", "데이터 조작", "딥러닝 하드웨어", "자동 미분", "확률과 통계", "나이브 베이즈 분류", "환경과 분산", "문서화"],
      difficulty: "hard",
      estimatedHours: 24
    },
    {
      id: 5,
      title: "딥러닝 기초",
      sections: ["선형 회귀", "선형 회귀 구현", "합성 회귀 데이터", "Softmax 회귀", "Fashion-MNIST", "Softmax 회귀 구현", "Softmax 회귀 간결 구현", "다층 퍼셉트론", "다층 퍼셉트론 구현", "다층 퍼셉트론 간결 구현", "언더피팅과 오버피팅", "가중치 감쇠", "드롭아웃", "순전파, 역전파, 계산 그래프", "수치 안정성", "딥러닝 하드웨어", "Kaggle 실전"],
      difficulty: "hard",
      estimatedHours: 32
    },
    {
      id: 6,
      title: "딥러닝 계산 심화",
      sections: ["레이어와 블록", "매개변수 관리", "지연 초기화", "사용자 정의 레이어", "NDArray 파일 입출력", "Gluon 모델 저장", "매개변수 관리", "사용자 정의 레이어", "QR코드 토론", "GPU 계산"],
      difficulty: "medium",
      estimatedHours: 18
    },
    {
      id: 7,
      title: "부록",
      sections: ["수학 기초", "d2l 패키지"],
      difficulty: "easy",
      estimatedHours: 4
    }
  ];

  const intensitySettings = {
    light: { multiplier: 1.5, label: "여유롭게", desc: "주 2-3회, 복습 위주" },
    normal: { multiplier: 1.0, label: "보통", desc: "주 3-4회, 균형있게" },
    intensive: { multiplier: 0.7, label: "집중적으로", desc: "주 5-6회, 빠른 진도" }
  };

  const generateStudyPlan = () => {
    const totalEstimatedHours = chapters.reduce((sum, ch) => sum + ch.estimatedHours, 0);
    const adjustedHours = totalEstimatedHours * intensitySettings[studyIntensity].multiplier;
    const hoursPerWeek = adjustedHours / studyWeeks;
    
    const startDateObj = new Date(startDate);
    const plan = [];
    let currentWeek = 0;
    let currentChapterIndex = 0;
    let remainingHoursInChapter = chapters[0].estimatedHours * intensitySettings[studyIntensity].multiplier;

    while (currentChapterIndex < chapters.length && currentWeek < studyWeeks) {
      const weekStartDate = new Date(startDateObj.getTime() + currentWeek * 7 * 24 * 60 * 60 * 1000);
      const weekEndDate = new Date(weekStartDate.getTime() + 6 * 24 * 60 * 60 * 1000);
      
      const weekChapters = [];
      let weekHours = 0;

      while (weekHours < hoursPerWeek && currentChapterIndex < chapters.length) {
        const currentChapter = chapters[currentChapterIndex];
        const hoursToAllocate = Math.min(remainingHoursInChapter, hoursPerWeek - weekHours);
        
        if (hoursToAllocate > 0) {
          const existingChapter = weekChapters.find(wc => wc.id === currentChapter.id);
          if (existingChapter) {
            existingChapter.hours += hoursToAllocate;
          } else {
            weekChapters.push({
              ...currentChapter,
              hours: hoursToAllocate,
              isPartial: remainingHoursInChapter > hoursToAllocate,
              taskId: `week-${currentWeek + 1}-chapter-${currentChapter.id}`
            });
          }
          
          weekHours += hoursToAllocate;
          remainingHoursInChapter -= hoursToAllocate;
        }

        if (remainingHoursInChapter <= 0) {
          currentChapterIndex++;
          if (currentChapterIndex < chapters.length) {
            remainingHoursInChapter = chapters[currentChapterIndex].estimatedHours * intensitySettings[studyIntensity].multiplier;
          }
        } else {
          break;
        }
      }

      plan.push({
        week: currentWeek + 1,
        startDate: weekStartDate,
        endDate: weekEndDate,
        chapters: weekChapters,
        totalHours: weekHours
      });

      currentWeek++;
    }

    return plan;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
  };

  const calculateEndDate = () => {
    const start = new Date(startDate);
    const end = new Date(start.getTime() + (studyWeeks - 1) * 7 * 24 * 60 * 60 * 1000);
    return end.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleTaskClick = (task) => {
    if (!taskStatuses[task.taskId]?.completed) {
      setSelectedTask(task);
      setScheduleDate(taskStatuses[task.taskId]?.scheduledDate || '');
      setShowScheduleModal(true);
    }
  };

  const handleTaskComplete = (taskId) => {
    setTaskStatuses(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        completed: true,
        completedDate: new Date().toISOString().split('T')[0]
      }
    }));
  };

  const handleScheduleSave = () => {
    if (selectedTask && scheduleDate) {
      setTaskStatuses(prev => ({
        ...prev,
        [selectedTask.taskId]: {
          ...prev[selectedTask.taskId],
          scheduledDate: scheduleDate
        }
      }));
      setShowScheduleModal(false);
      setSelectedTask(null);
      setScheduleDate('');
    }
  };

  const getTaskStatus = (taskId) => {
    return taskStatuses[taskId] || { completed: false, scheduledDate: null };
  };

  const studyPlan = showPlan ? generateStudyPlan() : [];

  // 전체 진행률 계산
  const totalTasks = studyPlan.reduce((sum, week) => sum + week.chapters.length, 0);
  const completedTasks = Object.values(taskStatuses).filter(status => status.completed).length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 설정 섹션 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">📚 딥러닝 교재 학습 플랜 설정</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* 시작 날짜 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">시작 날짜</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 학습 기간 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              학습 기간: {studyWeeks}주 (종료: {calculateEndDate()})
            </label>
            <input
              type="range"
              min="4"
              max="16"
              value={studyWeeks}
              onChange={(e) => setStudyWeeks(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>4주</span>
              <span>16주</span>
            </div>
          </div>
        </div>

        {/* 학습 강도 */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">학습 강도</label>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(intensitySettings).map(([key, setting]) => (
              <button
                key={key}
                onClick={() => setStudyIntensity(key)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  studyIntensity === key
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
                }`}
              >
                <div className="font-medium mb-1">{setting.label}</div>
                <div className="text-xs text-gray-500">{setting.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 플랜 생성 버튼 */}
        <button
          onClick={() => setShowPlan(true)}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-medium text-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] shadow-lg"
        >
          🗺️ 학습 로드맵 생성하기
        </button>
      </div>

      {/* 생성된 학습 플랜 */}
      {showPlan && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">📅 주차별 학습 로드맵</h3>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                진행률: {completedTasks}/{totalTasks} ({progressPercentage}%)
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {studyPlan.map((week) => (
              <div key={week.week} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      Week {week.week}
                    </span>
                    <span className="text-gray-600">
                      {formatDate(week.startDate)} - {formatDate(week.endDate)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{Math.round(week.totalHours)}시간</span>
                </div>

                <div className="space-y-2">
                  {week.chapters.map((chapter) => {
                    const status = getTaskStatus(chapter.taskId);
                    return (
                      <div 
                        key={chapter.taskId} 
                        className={`flex items-center justify-between bg-gray-50 rounded-lg p-3 transition-all ${
                          !status.completed ? 'cursor-pointer hover:bg-blue-50' : 'bg-green-50'
                        }`}
                        onClick={() => handleTaskClick(chapter)}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <input
                            type="checkbox"
                            checked={status.completed}
                            onChange={() => handleTaskComplete(chapter.taskId)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <div className="flex-1">
                            <div className={`font-medium ${status.completed ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                              Chapter {chapter.id}: {chapter.title}
                              {chapter.isPartial && <span className="text-blue-600 ml-2">(진행중)</span>}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              주요 내용: {chapter.sections.slice(0, 3).join(', ')}
                              {chapter.sections.length > 3 && ` 외 ${chapter.sections.length - 3}개`}
                            </div>
                            {status.scheduledDate && !status.completed && (
                              <div className="text-xs text-blue-600 mt-1 font-medium">
                                📅 예정일: {new Date(status.scheduledDate).toLocaleDateString('ko-KR')}
                              </div>
                            )}
                            {status.completed && status.completedDate && (
                              <div className="text-xs text-green-600 mt-1 font-medium">
                                ✅ 완료일: {new Date(status.completedDate).toLocaleDateString('ko-KR')}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-sm font-medium text-gray-700">{Math.round(chapter.hours)}시간</div>
                          <div className={`text-xs px-2 py-1 rounded ${
                            chapter.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                            chapter.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {chapter.difficulty === 'easy' ? '기초' : 
                             chapter.difficulty === 'medium' ? '중급' : '고급'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* 플랜 수정 버튼 */}
          <div className="mt-6 flex space-x-3">
            <button 
              onClick={() => setShowPlan(false)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              ⚙️ 설정 수정
            </button>
            <button className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
              ✅ 이 플랜으로 시작하기
            </button>
          </div>
        </div>
      )}

      {/* 일정 설정 모달 */}
      {showScheduleModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📅 학습 일정 설정</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">언제 진행할 예정인가요?</p>
              <p className="font-medium text-gray-900 mb-4">
                Chapter {selectedTask.id}: {selectedTask.title}
              </p>
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleScheduleSave}
                disabled={!scheduleDate}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
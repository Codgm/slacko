import { useState, useEffect } from 'react';
import { Plus, Play, Pause, Square, CheckCircle, FileText } from 'lucide-react';

const StudyManagementSystem = () => {
  // 상태 관리
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: '알고리즘',
      category: 'major',
      color: 'blue',
      totalChapters: 10,
      completedChapters: 6,
      chapters: [
        { id: 1, name: '배열과 문자열', completed: true, memo: '기본 개념 완료' },
        { id: 2, name: '연결 리스트', completed: true, memo: '구현 연습 완료' },
        { id: 3, name: '스택과 큐', completed: true, memo: '' },
        { id: 4, name: '트리 구조', completed: true, memo: '이진트리 중점 학습' },
        { id: 5, name: '그래프', completed: true, memo: '' },
        { id: 6, name: '정렬 알고리즘', completed: true, memo: '퀵정렬, 머지정렬 완료' },
        { id: 7, name: '탐색 알고리즘', completed: false, memo: '' },
        { id: 8, name: '동적 프로그래밍', completed: false, memo: '' },
        { id: 9, name: '그리디 알고리즘', completed: false, memo: '' },
        { id: 10, name: '백트래킹', completed: false, memo: '' }
      ],
      nextTodo: '7강 탐색 알고리즘 학습',
      weeklyGoal: '10강까지 완료',
      studyTime: 45
    },
    {
      id: 2,
      name: '캡스톤 프로젝트',
      category: 'project',
      color: 'green',
      totalChapters: 8,
      completedChapters: 3,
      chapters: [
        { id: 1, name: '주제 선정', completed: true, memo: 'AI 챗봇 서비스로 결정' },
        { id: 2, name: '요구사항 분석', completed: true, memo: '사용자 스토리 작성 완료' },
        { id: 3, name: 'UI/UX 설계', completed: true, memo: 'Figma 프로토타입 완성' },
        { id: 4, name: '백엔드 설계', completed: false, memo: '' },
        { id: 5, name: '프론트엔드 개발', completed: false, memo: '' },
        { id: 6, name: '백엔드 개발', completed: false, memo: '' },
        { id: 7, name: '테스트 및 배포', completed: false, memo: '' },
        { id: 8, name: '최종 발표 준비', completed: false, memo: '' }
      ],
      nextTodo: '백엔드 API 설계서 작성',
      weeklyGoal: '5단계까지 완료',
      studyTime: 120
    },
    {
      id: 3,
      name: '토익 준비',
      category: 'certificate',
      color: 'purple',
      totalChapters: 12,
      completedChapters: 4,
      chapters: [
        { id: 1, name: 'Part 1 사진 묘사', completed: true, memo: '기본 패턴 암기 완료' },
        { id: 2, name: 'Part 2 응답 선택', completed: true, memo: 'WH 질문 연습' },
        { id: 3, name: 'Part 3 대화 듣기', completed: true, memo: '키워드 파악 연습' },
        { id: 4, name: 'Part 4 설명문 듣기', completed: true, memo: '' },
        { id: 5, name: 'Part 5 문법', completed: false, memo: '' },
        { id: 6, name: 'Part 6 빈칸 추론', completed: false, memo: '' },
        { id: 7, name: 'Part 7 독해', completed: false, memo: '' },
        { id: 8, name: '단어 암기 1000개', completed: false, memo: '' },
        { id: 9, name: '모의고사 1회', completed: false, memo: '' },
        { id: 10, name: '모의고사 2회', completed: false, memo: '' },
        { id: 11, name: '모의고사 3회', completed: false, memo: '' },
        { id: 12, name: '최종 정리', completed: false, memo: '' }
      ],
      nextTodo: 'Part 5 문법 문제 50개',
      weeklyGoal: '7단계까지 완료',
      studyTime: 90
    }
  ]);

  const [selectedSubject, setSelectedSubject] = useState(null);
  // const [showAddForm, setShowAddForm] = useState(false);
  const [showStudyLog, setShowStudyLog] = useState(false);
  const [timer, setTimer] = useState({ minutes: 0, seconds: 0, isRunning: false });
  const [studyLog, setStudyLog] = useState('');
  const [todayPlan, setTodayPlan] = useState('');

  // 타이머 기능
  useEffect(() => {
    let interval = null;
    if (timer.isRunning) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev.seconds === 59) {
            return { ...prev, minutes: prev.minutes + 1, seconds: 0 };
          } else {
            return { ...prev, seconds: prev.seconds + 1 };
          }
        });
      }, 1000);
    } else if (!timer.isRunning && timer.seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer.isRunning, timer.seconds]);

  // 색상 매핑
  const colorMap = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', accent: 'bg-blue-500' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', accent: 'bg-green-500' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', accent: 'bg-purple-500' },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', accent: 'bg-red-500' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600', accent: 'bg-yellow-500' }
  };

  const categoryMap = {
    major: { name: '전공', color: 'bg-blue-100 text-blue-800' },
    project: { name: '프로젝트', color: 'bg-green-100 text-green-800' },
    certificate: { name: '자격증', color: 'bg-purple-100 text-purple-800' },
    hobby: { name: '취미', color: 'bg-yellow-100 text-yellow-800' }
  };

  // 진도율 계산
  const getProgress = (subject) => {
    return Math.round((subject.completedChapters / subject.totalChapters) * 100);
  };

  // 챕터 완료 토글
  const toggleChapter = (subjectId, chapterId) => {
    setSubjects(prev => prev.map(subject => {
      if (subject.id === subjectId) {
        const updatedChapters = subject.chapters.map(chapter => {
          if (chapter.id === chapterId) {
            return { ...chapter, completed: !chapter.completed };
          }
          return chapter;
        });
        const completedCount = updatedChapters.filter(ch => ch.completed).length;
        return { ...subject, chapters: updatedChapters, completedChapters: completedCount };
      }
      return subject;
    }));
  };

  // 메모 업데이트
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

  // 타이머 제어
  const startTimer = () => setTimer(prev => ({ ...prev, isRunning: true }));
  const pauseTimer = () => setTimer(prev => ({ ...prev, isRunning: false }));
  const resetTimer = () => setTimer({ minutes: 0, seconds: 0, isRunning: false });

  // 학습 기록 저장
  const saveStudyLog = () => {
    if (studyLog.trim() && selectedSubject) {
      // 여기서 실제로는 localStorage나 서버에 저장
      alert(`학습 기록이 저장되었습니다!\n과목: ${selectedSubject.name}\n시간: ${timer.minutes}분 ${timer.seconds}초\n내용: ${studyLog}`);
      setStudyLog('');
      resetTimer();
      setShowStudyLog(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📚 학습 관리</h1>
              <p className="text-sm text-gray-600">체계적인 학습으로 목표를 달성하세요</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              새 과목 추가
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 오늘의 계획 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📝 오늘의 학습 계획</h2>
            <textarea
              value={todayPlan}
              onChange={(e) => setTodayPlan(e.target.value)}
              placeholder="오늘 공부할 내용을 간단히 적어보세요..."
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            />
          </div>
        </div>

        {!selectedSubject ? (
          /* 과목 리스트 뷰 */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map(subject => {
              const progress = getProgress(subject);
              const colors = colorMap[subject.color];
              
              return (
                <div
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject)}
                  className={`${colors.bg} ${colors.border} border-2 rounded-lg p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{subject.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${categoryMap[subject.category].color}`}>
                      {categoryMap[subject.category].name}
                    </span>
                  </div>

                  {/* 진도율 원형 차트 */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-20 h-20">
                      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="2"
                        />
                        <path
                          d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray={`${progress}, 100`}
                          className={colors.text}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-sm font-bold ${colors.text}`}>{progress}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>진도:</span>
                      <span className="font-medium">{subject.completedChapters}/{subject.totalChapters}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>주간 목표:</span>
                      <span className="font-medium text-blue-600">{subject.weeklyGoal}</span>
                    </div>
                    <div className="mt-3 p-2 bg-white rounded border">
                      <div className="text-xs text-gray-500 mb-1">다음 할 일</div>
                      <div className="font-medium text-gray-900">{subject.nextTodo}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* 선택된 과목 상세 보기 */
          <div className="space-y-6">
            {/* 상단 네비게이션 */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedSubject(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← 과목 목록으로 돌아가기
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowStudyLog(true)}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  학습 기록
                </button>
              </div>
            </div>

            {/* 과목 헤더 */}
            <div className={`${colorMap[selectedSubject.color].bg} ${colorMap[selectedSubject.color].border} border-2 rounded-lg p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedSubject.name}</h2>
                  <span className={`inline-block text-xs px-2 py-1 rounded-full ${categoryMap[selectedSubject.category].color} mt-2`}>
                    {categoryMap[selectedSubject.category].name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">{getProgress(selectedSubject)}%</div>
                  <div className="text-sm text-gray-600">진도율</div>
                </div>
              </div>

              {/* 진도 바 */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className={`h-3 rounded-full ${colorMap[selectedSubject.color].accent} transition-all duration-300`}
                  style={{ width: `${getProgress(selectedSubject)}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">완료: </span>
                  <span className="font-medium">{selectedSubject.completedChapters}/{selectedSubject.totalChapters}</span>
                </div>
                <div>
                  <span className="text-gray-600">주간 목표: </span>
                  <span className="font-medium text-blue-600">{selectedSubject.weeklyGoal}</span>
                </div>
              </div>
            </div>

            {/* 챕터 목록 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">📖 학습 진도</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {selectedSubject.chapters.map((chapter, index) => (
                    <div key={chapter.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <button
                          onClick={() => toggleChapter(selectedSubject.id, chapter.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            chapter.completed 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'border-gray-300 hover:border-green-400'
                          }`}
                        >
                          {chapter.completed && <CheckCircle className="w-4 h-4" />}
                        </button>
                        <div className="flex-1">
                          <h4 className={`font-medium ${chapter.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {index + 1}. {chapter.name}
                          </h4>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          chapter.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {chapter.completed ? '완료' : '진행 예정'}
                        </span>
                      </div>
                      
                      <textarea
                        value={chapter.memo}
                        onChange={(e) => updateMemo(selectedSubject.id, chapter.id, e.target.value)}
                        placeholder="학습 메모를 작성하세요..."
                        className="w-full p-2 text-sm border border-gray-200 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 학습 기록 모달 */}
      {showStudyLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">⏱️ 학습 기록</h3>
            </div>
            <div className="p-6">
              {/* 타이머 */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-4">
                  {String(timer.minutes).padStart(2, '0')}:{String(timer.seconds).padStart(2, '0')}
                </div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={startTimer}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    시작
                  </button>
                  <button
                    onClick={pauseTimer}
                    className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <Pause className="w-4 h-4" />
                    일시정지
                  </button>
                  <button
                    onClick={resetTimer}
                    className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Square className="w-4 h-4" />
                    리셋
                  </button>
                </div>
              </div>

              {/* 학습 내용 입력 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  오늘 학습한 내용
                </label>
                <textarea
                  value={studyLog}
                  onChange={(e) => setStudyLog(e.target.value)}
                  placeholder="오늘 공부한 내용, 어려웠던 점, 느낀 점 등을 기록하세요..."
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowStudyLog(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={saveStudyLog}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyManagementSystem;
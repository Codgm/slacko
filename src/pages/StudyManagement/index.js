import { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import { Plus, Play, Pause, Square, CheckCircle } from 'lucide-react';

export default function StudyManagement() {
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
        { id: 6, name: '정렬 알고리즘', completed: true, memo: '퀵정렬, 버블정렬 완료' },
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [showStudyLog, setShowStudyLog] = useState(false);
  const [timer, setTimer] = useState({ minutes: 0, seconds: 0, isRunning: false });
  const [studyLog, setStudyLog] = useState('');
  const [todayPlan, setTodayPlan] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

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
      setToastMessage(`학습 기록이 저장되었습니다!\n과목: ${selectedSubject.name}\n시간: ${timer.minutes}분 ${timer.seconds}초\n내용: ${studyLog}`);
      setToastType('success');
      setShowToast(true);
      setStudyLog('');
      resetTimer();
      setShowStudyLog(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 해더 */}
      <div className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w mx-auto px-4 py-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📚 학습 관리</h1>
            <p className="text-sm text-gray-600">체계적인 학습으로 목표를 달성하세요</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} variant="primary" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> 새 과목 추가
          </Button>
        </div>
      </div>
      {/* 메인 컨테이너 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
          {/* 상단 정보/오늘의 계획 카드 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📝 오늘의 학습 계획</h2>
            <textarea
              value={todayPlan}
              onChange={e => setTodayPlan(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="오늘의 목표를 입력하세요"
            />
          </div>
          {/* 과목 리스트 */}
          {subjects.length === 0 ? (
            <div className="text-center text-gray-400 py-12">아직 등록된 과목이 없습니다.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjects.map(subject => (
                <div key={subject.id} className={`rounded-lg shadow-sm border ${colorMap[subject.color].bg} ${colorMap[subject.color].border} p-6`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryMap[subject.category].color}`}>{categoryMap[subject.category].name}</span>
                      <h3 className={`text-lg font-bold ${colorMap[subject.color].text}`}>{subject.name}</h3>
                    </div>
                    <span className="text-xs text-gray-500">{subject.completedChapters}/{subject.totalChapters} 챕터</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className={`${colorMap[subject.color].accent} h-2 rounded-full`} style={{ width: `${getProgress(subject)}%` }}></div>
                  </div>
                  <div className="mb-2 text-sm text-gray-700">다음 할 일: {subject.nextTodo}</div>
                  <div className="mb-2 text-xs text-gray-500">주간 목표: {subject.weeklyGoal}</div>
                  <div className="mb-2 text-xs text-gray-500">누적 학습 시간: {subject.studyTime}분</div>
                  <div className="mb-2">
                    <h4 className="font-semibold text-sm mb-1">챕터별 진행</h4>
                    <ul className="space-y-1">
                      {subject.chapters.map(chapter => (
                        <li key={chapter.id} className="flex items-center gap-2">
                          <Button
                            onClick={() => toggleChapter(subject.id, chapter.id)}
                            variant="ghost"
                            size="sm"
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center p-0 ${chapter.completed ? colorMap[subject.color].accent : 'border-gray-300'}`}
                            aria-label={chapter.completed ? '완료됨' : '미완료'}
                          >
                            {chapter.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                          </Button>
                          <span className={chapter.completed ? 'line-through text-gray-400' : ''}>{chapter.name}</span>
                          <input
                            type="text"
                            value={chapter.memo}
                            onChange={e => updateMemo(subject.id, chapter.id, e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs ml-2"
                            placeholder="메모"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={() => { setSelectedSubject(subject); setShowStudyLog(true); }}
                      variant="success"
                      size="sm"
                      className="flex-1"
                    >
                      학습 기록
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      disabled
                    >
                      과목 편집(준비중)
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* 학습 플랜/타이머 등 섹션 */}
          {/* 필요시 조건부로 추가 */}
          <Modal open={showStudyLog && !!selectedSubject} onClose={() => setShowStudyLog(false)} className="max-w-md">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">학습 내용</label>
                <textarea
                  value={studyLog}
                  onChange={e => setStudyLog(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="학습한 내용을 입력하세요"
                  autoFocus
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={startTimer}
                  variant="primary"
                  size="sm"
                  disabled={timer.isRunning}
                >
                  <Play className="w-4 h-4 inline" /> 시작
                </Button>
                <Button
                  onClick={pauseTimer}
                  variant="warning"
                  size="sm"
                  disabled={!timer.isRunning}
                >
                  <Pause className="w-4 h-4 inline" /> 일시정지
                </Button>
                <Button
                  onClick={resetTimer}
                  variant="secondary"
                  size="sm"
                >
                  <Square className="w-4 h-4 inline" /> 초기화
                </Button>
                <span className="ml-2 text-sm font-mono text-gray-700">
                  {timer.minutes}분 {timer.seconds}초
                </span>
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={() => setShowStudyLog(false)}
                variant="outline"
                className="flex-1"
              >
                취소
              </Button>
              <Button
                onClick={saveStudyLog}
                disabled={!studyLog.trim()}
                variant="primary"
                className="flex-1"
              >
                저장하기
              </Button>
            </div>
          </Modal>
          <Modal open={showAddForm} onClose={() => setShowAddForm(false)} className="max-w-md">
            <h3 className="text-lg font-semibold mb-4">새 과목 추가 (준비중)</h3>
            <Button
              onClick={() => setShowAddForm(false)}
              variant="secondary"
              className="w-full mt-4"
            >
              닫기
            </Button>
          </Modal>
          <Toast open={showToast} onClose={() => setShowToast(false)} type={toastType}>{toastMessage}</Toast>
        </div>
      </div>
    </div>
  );
} 
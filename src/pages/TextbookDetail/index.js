import Breadcrumb from '../../components/common/Breadcrumb';
import WeeklyProgress from '../../components/common/WeeklyProgress';
import { useParams, useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

// 원서 상세 페이지
const TextbookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleStartStudy = () => {
    navigate(`/textbook/${id}/study`, { state: { textbookTitle: textbook.title } });
  };

  const textbook = {
    id: 1,
    title: 'Operating Systems: Three Easy Pieces',
    author: 'Remzi H. Arpaci-Dusseau',
    publisher: 'CreateSpace',
    totalPages: 400,
    currentPage: 120,
    targetDate: '2025-07-30',
    status: '읽는 중',
    startDate: '2025-06-01',
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
    progress: 30,
    notes: 23,
    bookmarks: 8,
    category: 'Computer Science',
    purpose: '전공 심화 학습',
    intensity: '보통',
    studyDays: 12,
    totalStudyTime: '24시간 30분',
    weeklyGoal: 3,
    lastStudyDate: '2025-07-17'
  };
  // 노트 요약 예시 데이터
  const noteSummaries = [
    {
      title: 'Process Control Block (PCB)',
      summary: '운영체제가 프로세스를 효율적으로 관리하기 위한 핵심 자료구조로, Context Switching과 멀티태스킹을 가능하게 하는 필수 요소',
      chapter: 'Chapter 3',
      page: '95-97',
      date: '2025-07-17',
    },
    {
      title: 'Context Switching 과정',
      summary: '프로세스 전환 시 발생하는 Context Switching의 단계별 과정과 오버헤드 최소화 방법',
      chapter: 'Chapter 3',
      page: '98-102',
      date: '2025-07-16',
    },
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 해더 */}
      <div className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 mb-0">
        <div className="max-w mx-auto px-4 py-2 flex items-center justify-between">
          {/* 화살표와 텍스트를 한 줄에 붙임 */}
          <div className="flex flex-col min-w-[180px]">
            <h1 className="text-2xl font-bold text-gray-900">원서 상세</h1>
            <p className="text-sm text-gray-600"> 원서 학습 현황 한눈에 확인하세요!</p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Breadcrumb />
        {/* 원서 정보 카드: 가장 위로 이동 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex items-start space-x-8">
              <div className="relative">
                <img 
                  src={textbook.coverImage} 
                  alt="cover" 
                  className="w-48 h-64 rounded-xl shadow-lg object-cover" 
                />
                <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {textbook.progress}%
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{textbook.title}</h1>
                  <p className="text-xl text-gray-600 mb-4">{textbook.author}</p>
                  <div className="flex items-center space-x-4 text-gray-500">
                    <span>출판사: {textbook.publisher}</span>
                    <span>•</span>
                    <span>총 {textbook.totalPages}페이지</span>
                    <span>•</span>
                    <span>{textbook.category}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{textbook.progress}%</div>
                    <div className="text-sm text-blue-700">진행률</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">{textbook.notes}</div>
                    <div className="text-sm text-green-700">노트</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">{textbook.bookmarks}</div>
                    <div className="text-sm text-purple-700">북마크</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">{textbook.studyDays}</div>
                    <div className="text-sm text-orange-700">학습일</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleStartStudy}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>학습 시작하기</span>
                  </button>
                  <div className="text-sm text-gray-600">
                    마지막 학습: {textbook.lastStudyDate}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 3분할 카드형 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* 노트 요약 카드 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">노트 요약</h3>
            {noteSummaries.map((note, idx) => (
              <div key={idx} className="p-3 bg-blue-50 rounded-lg mb-2">
                <h4 className="font-semibold text-blue-800 mb-1">{note.title}</h4>
                <p className="text-sm text-blue-700 mb-1">{note.summary}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-blue-600">{note.chapter} · 페이지 {note.page}</span>
                  <span className="text-xs text-blue-400">{note.date}</span>
                </div>
              </div>
            ))}
          </div>
          {/* 학습 현황 카드 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-green-900 mb-2">학습 현황</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-green-700 font-bold text-2xl">{textbook.progress}%</span>
                <span className="text-gray-600 text-sm">진도율</span>
              </div>
              <div className="w-full h-2 bg-green-200 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${textbook.progress}%` }}></div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-700">
                <span>학습일 <span className="font-bold text-green-700">{textbook.studyDays}</span></span>
                <span>총 학습 시간 <span className="font-bold text-green-700">{textbook.totalStudyTime}</span></span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>마지막 학습: {textbook.lastStudyDate}</span>
                <span>목표 완료일: {textbook.targetDate}</span>
              </div>
            </div>
          </div>
          {/* 복습 현황 카드 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">복습 현황</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-purple-700 font-bold text-2xl">85%</span>
                <span className="text-gray-600 text-sm">복습률</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-700">
                <span>복습 완료 <span className="font-bold text-purple-700">12</span></span>
                <span>추천 복습 <span className="font-bold text-purple-700">2</span></span>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 mt-2">
                <div className="text-xs text-purple-700 mb-1">오늘/이번주 복습 추천</div>
                <ul className="list-disc pl-5 text-xs text-purple-800 space-y-1">
                  <li>Chapter 3: PCB 개념 복습</li>
                  <li>노트 2개, 퀴즈 1개</li>
                  <li>오답노트 1개</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* 학습 현황 및 목표: 2분할로 다시 추가 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <WeeklyProgress 
            selectedDays={[0, 2, 4]} // 월, 수, 금
            completedDays={[0, 2]} // 월, 수 완료
          />
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">학습 목표</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">목표 완료일</span>
                <span className="font-semibold text-blue-600">{textbook.targetDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">학습 강도</span>
                <span className="font-semibold">{textbook.intensity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">총 학습 시간</span>
                <span className="font-semibold">{textbook.totalStudyTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">학습 목적</span>
                <span className="font-semibold">{textbook.purpose}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TextbookDetailPage; 
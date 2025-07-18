import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import ChapterPreview from '../../components/textbook/ChapterPreview';
import NoteSection from '../../components/notes/NoteSection';
import QuizSection from '../../components/notes/QuizSection';
import TextbookContentCard from '../../components/textbook/TextbookContentCard';
import AIPlanGenerator from '../../components/plan/AIPlanGenerator';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';

// 집중 학습 모드(전체화면) 인터페이스
const IntegratedStudyInterface = ({ textbook, onClose }) => {
  const [currentPage, setCurrentPage] = useState(95);
  const [activeNoteTab, setActiveNoteTab] = useState('write');
  const [noteMode, setNoteMode] = useState('view');
  const [currentNote, setCurrentNote] = useState({
    cues: '• PCB란 무엇인가?\n• 왜 필요한가?\n• 주요 구성요소는?\n• Context Switching과 관계?',
    notes: '📝 Process Control Block (PCB) 핵심 정리\n\n• 정의: 운영체제가 각 프로세스를 관리하기 위해 유지하는 자료구조\n• 목적: 프로세스 상태 정보를 체계적으로 저장 및 관리\n\n주요 구성요소:\n1. Process ID (PID) - 프로세스 고유 식별자\n2. Process State - NEW, READY, RUNNING, WAITING, TERMINATED\n3. Program Counter - 다음 실행할 명령어 주소\n4. CPU Registers - 프로세스 실행 중 사용된 레지스터 값들\n5. Memory Management Info - 메모리 할당 정보\n\n💡 핵심 이해\n• Context Switching 시 PCB에 현재 상태를 저장하고 복원\n• 멀티태스킹 운영체제의 필수 요소',
    summary: 'PCB는 운영체제가 프로세스를 효율적으로 관리하기 위한 핵심 자료구조로, Context Switching과 멀티태스킹을 가능하게 하는 필수 요소',
    pageRange: '95-97'
  });
  const [existingNotes, setExistingNotes] = useState([
    {
      id: 1,
      title: 'PCB 개념 정리',
      content: 'Process Control Block의 핵심 개념과 구성요소',
      date: '2025-06-20',
      chapter: 'Chapter 3',
      pageRange: '95-97'
    },
    {
      id: 2,
      title: 'Context Switching 과정',
      content: '프로세스 전환 시 발생하는 Context Switching의 단계별 과정',
      date: '2025-06-21',
      chapter: 'Chapter 3',
      pageRange: '98-102'
    }
  ]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [hoveredNote, setHoveredNote] = useState(null);

  const textbookContent = {
    title: 'Chapter 3: Process Management',
    content: `Process Control Block (PCB)는 운영체제가 각 프로세스를 관리하기 위해 유지하는 자료구조입니다. PCB는 프로세스의 상태 정보를 체계적으로 저장하고 관리하는 역할을 합니다.

주요 구성요소:
1. Process ID (PID): 프로세스의 고유 식별자
2. Process State: 프로세스의 현재 상태 (NEW, READY, RUNNING, WAITING, TERMINATED)
3. Program Counter: 다음에 실행할 명령어의 주소
4. CPU Registers: 프로세스 실행 중 사용된 레지스터 값들
5. Memory Management Information: 메모리 할당 정보

Context Switching이 발생할 때, 운영체제는 현재 실행 중인 프로세스의 상태를 PCB에 저장하고, 다음에 실행할 프로세스의 상태를 PCB에서 복원합니다.`,
    pageInfo: '페이지 95-97',
    chapter: 'Chapter 3',
    section: 'Process Control Block'
  };

  const saveNote = (note) => {
    if (note.id) {
      setExistingNotes(prev => prev.map(n => n.id === note.id ? note : n));
    } else {
      const newNote = { ...note, id: Date.now() };
      setExistingNotes(prev => [...prev, newNote]);
    }
  };

  const startNewNote = () => {
    setCurrentNote({
      cues: '',
      notes: '',
      summary: '',
      pageRange: '95-97'
    });
    setNoteMode('edit');
    setActiveNoteTab('write');
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* 전체화면 모달 헤더 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="돌아가기"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">{textbook.title}</h1>
                <p className="text-sm text-gray-600">{textbookContent.chapter} · {textbookContent.section}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">{textbookContent.pageInfo}</span>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-gray-50">
        {/* 왼쪽: 교재 내용 */}
        <TextbookContentCard
          title={textbookContent.title}
          content={textbookContent.content}
          page={currentPage}
          onPrev={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          onNext={() => setCurrentPage(prev => prev + 1)}
        />
        {/* 오른쪽: 노트 영역 */}
        <div className="w-full md:w-5/12 bg-gray-50 flex flex-col flex-1 min-h-0 h-full p-0 md:p-6">
            <NoteSection
              currentNote={currentNote}
              setCurrentNote={setCurrentNote}
              noteMode={noteMode}
              setNoteMode={setNoteMode}
              activeNoteTab={activeNoteTab}
              setActiveNoteTab={setActiveNoteTab}
              saveNote={saveNote}
              startNewNote={startNewNote}
              existingNotes={existingNotes}
              setExistingNotes={setExistingNotes}
              selectedNote={selectedNote}
              setSelectedNote={setSelectedNote}
              setHoveredNote={setHoveredNote}
              hoveredNote={hoveredNote}
            />
        </div>
      </div>
      {/* 하단: 상태바 */}
      <div className="bg-white border-t border-gray-100 px-6 py-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between text-sm text-gray-600 gap-2 md:gap-0">
          <div className="flex items-center space-x-4">
            <span>Chapter 3 · Process Management</span>
            <span>•</span>
            <span>총 {existingNotes.filter(note => note.chapter === 'Chapter 3').length}개 노트</span>
          </div>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <Clock className="w-4 h-4" />
            <span>마지막 저장: 방금 전</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TextbookDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('content');
  const [isFullScreenStudy, setIsFullScreenStudy] = useState(false);
  const [currentPage, setCurrentPage] = useState(95);
  const [currentNote, setCurrentNote] = useState({
    cues: '• PCB란 무엇인가?\n• 왜 필요한가?\n• 주요 구성요소는?\n• Context Switching과 관계?',
    notes: '📝 Process Control Block (PCB) 핵심 정리\n\n• 정의: 운영체제가 각 프로세스를 관리하기 위해 유지하는 자료구조\n• 목적: 프로세스 상태 정보를 체계적으로 저장 및 관리\n\n주요 구성요소:\n1. Process ID (PID) - 프로세스 고유 식별자\n2. Process State - NEW, READY, RUNNING, WAITING, TERMINATED\n3. Program Counter - 다음 실행할 명령어 주소\n4. CPU Registers - 프로세스 실행 중 사용된 레지스터 값들\n5. Memory Management Info - 메모리 할당 정보\n\n💡 핵심 이해\n• Context Switching 시 PCB에 현재 상태를 저장하고 복원\n• 멀티태스킹 운영체제의 필수 요소',
    summary: 'PCB는 운영체제가 프로세스를 효율적으로 관리하기 위한 핵심 자료구조로, Context Switching과 멀티태스킹을 가능하게 하는 필수 요소',
    pageRange: '95-97'
  });
  const [noteMode, setNoteMode] = useState('view');
  const [activeNoteTab, setActiveNoteTab] = useState('write');
  const [existingNotes, setExistingNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [hoveredNote, setHoveredNote] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const [showAddNoteOverlay, setShowAddNoteOverlay] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showNoteSection, setShowNoteSection] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // URL 파라미터로 받은 ID를 사용하여 원서 정보를 가져오는 로직
  const [textbook, setTextbook] = useState(null);

  useEffect(() => {
    // 로컬 스토리지에서 원서 데이터 가져오기
    const savedBooks = JSON.parse(localStorage.getItem('textbooks') || '[]');
    const foundBook = savedBooks.find(book => book.id === parseInt(id));
    
    if (foundBook) {
      setTextbook(foundBook);
    } else {
      // 기본 데이터 (ID가 1인 경우)
      const defaultBook = {
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
        plan: [
          { week: 1, task: '1~3장 읽기', date: '', done: false, memo: '' },
          { week: 2, task: '4~6장 읽고 문제풀이', date: '', done: false, memo: '' },
          { week: 3, task: '7~9장 + 복습', date: '', done: false, memo: '' },
        ]
      };
      
      if (parseInt(id) === 1) {
        setTextbook(defaultBook);
      } else {
        // 원서를 찾을 수 없는 경우
        setToastMessage('원서를 찾을 수 없습니다.');
        setToastType('error');
        setShowToast(true);
        setTimeout(() => navigate('/textbook'), 2000);
      }
    }
  }, [id, navigate]);

  const handleResize = () => {
    setIsDesktop(window.innerWidth >= 1024);
  };
  
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 노트에 추가 버튼 클릭 시 호출
  const handleAddNote = () => {
    if (isDesktop) setShowNoteSection(true);
  };

  // ChapterPreview용 샘플 데이터
  const chapterPreviewData = {
    objectives: ['PCB의 정의', '주요 구성요소', 'Context Switching'],
    aiSummary: 'PCB는 프로세스 관리의 핵심 자료구조입니다.',
    keywords: ['PCB', '프로세스', 'Context Switching']
  };

  const textbookContent = {
    title: 'Chapter 3: Process Management',
    content: `Process Control Block (PCB)는 운영체제가 각 프로세스를 관리하기 위해 유지하는 자료구조입니다. PCB는 프로세스의 상태 정보를 체계적으로 저장하고 관리하는 역할을 합니다.

주요 구성요소:
1. Process ID (PID): 프로세스의 고유 식별자
2. Process State: 프로세스의 현재 상태 (NEW, READY, RUNNING, WAITING, TERMINATED)
3. Program Counter: 다음에 실행할 명령어의 주소
4. CPU Registers: 프로세스 실행 중 사용된 레지스터 값들
5. Memory Management Information: 메모리 할당 정보

Context Switching이 발생할 때, 운영체제는 현재 실행 중인 프로세스의 상태를 PCB에 저장하고, 다음에 실행할 프로세스의 상태를 PCB에서 복원합니다.`,
    pageInfo: '페이지 95-97',
    chapter: 'Chapter 3',
    section: 'Process Control Block'
  };

  function saveNote(note) {
    if (!note || typeof note !== 'object') return; // note가 undefined/null/비객체면 아무것도 하지 않음

    if (note.id) {
      setExistingNotes(prev => prev.map(n => n.id === note.id ? note : n));
    } else {
      const newNote = { ...note, id: Date.now() };
      setExistingNotes(prev => [...prev, newNote]);
    }
  }

  function startNewNote() {
    setCurrentNote({
      cues: '',
      notes: '',
      summary: '',
      pageRange: '95-97'
    });
    setNoteMode('edit');
    setActiveNoteTab('write');
  }

  // 탭 변경 시 NoteSection 닫기
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setShowNoteSection(false); // 탭 변경 시 NoteSection 닫기
  };


  if (!textbook) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">원서 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isFullScreenStudy) {
    return (
      <IntegratedStudyInterface 
        textbook={textbook}
        onClose={() => setIsFullScreenStudy(false)}
      />
    );
  }

  const tabList = [
    { id: 'content', label: '원서 본문', emoji: '📖' },
    { id: 'concept', label: '개념 정리', emoji: '💡' },
    { id: 'review', label: '복습 현황', emoji: '🧠' },
    { id: 'plan', label: '학습 플랜', emoji: '🧭' },
    { id: 'notes', label: '노트/요약', emoji: '✍️' },
    { id: 'quiz', label: '퀴즈', emoji: '📝' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="w-full bg-white shadow-sm border-b border-gray-200">
        <div className="max-w mx-auto px-4 py-2 flex items-center">
          {/* 뒤로가기 버튼: 항상 보이게, onClose 없이 */}
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-300 mr-4"
            title="돌아가기"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">원서 상세</h1>
            <p className="text-sm text-gray-600">원서 학습으로 목표를 달성하세요</p>
          </div>
        </div>
      </div>
      
      {/* 상단: compact 요약 카드 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img 
              src={textbook.coverImage} 
              alt="cover" 
              className="w-24 h-32 rounded-2xl shadow-lg border-2 border-white object-cover" 
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {textbook.progress}%
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 mb-1">{textbook.title}</h1>
            <p className="text-sm text-gray-600 mb-3">저자: {textbook.author} · 출판사: {textbook.publisher}</p>
            <div className="flex gap-3">
              <span className="bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs font-medium border border-blue-200">
                📝 노트 {textbook.notes}
              </span>
              <span className="bg-green-50 text-green-700 rounded-full px-3 py-1 text-xs font-medium border border-green-200">
                🔖 북마크 {textbook.bookmarks}
              </span>
              <span className="bg-purple-50 text-purple-700 rounded-full px-3 py-1 text-xs font-medium border border-purple-200">
                📅 학습일 12
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${textbook.progress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">{textbook.currentPage} / {textbook.totalPages}p</span>
          </div>
        </div>
      </div>
      {/* 탭 바 (모바일/데스크탑 모두) */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex px-0">
          {tabList.map(tab => (
            <button
              key={tab.id}
              className={`flex-1 py-5 text-sm md:text-base font-medium transition-all ${activeTab === tab.id ? 'text-blue-700 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-blue-700'}`}
              onClick={() => handleTabChange(tab.id)}
            >
              <span className="mr-1">{tab.emoji}</span>{tab.label}
            </button>
          ))}
        </div>
      </div>
      {/* 탭별 컨텐츠 */}
      <div className="flex-1 flex flex-row bg-gray-50 min-h-0">
        {/* 본문 영역 */}
        <div className="flex-1 flex flex-col" style={{ flex: isDesktop && showNoteSection ? '0 0 60%' : '1 1 0%' }}>
          {activeTab === 'content' && (
            <div className="w-full max-w mx-auto px-4 py-6 flex flex-col gap-4 min-h-0">
              {/* 2. ChapterPreview 카드
              <ChapterPreview {...chapterPreviewData} /> */}
              {/* 1. 본문 드래그 시 노트에 추가 */}
              <TextbookContentCard
                title={textbookContent.title}
                content={textbookContent.content}
                page={currentPage}
                onPrev={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                onNext={() => setCurrentPage(prev => prev + 1)}
                onTextSelect={(text) => {
                  if (text) {
                    setSelectedText(text);
                    setShowAddNoteOverlay(true);
                  } else {
                    setShowAddNoteOverlay(false);
                    setSelectedText('');
                  }
                }}
                onAddNote={handleAddNote}
                className="w-full"
              />
              {/* 오버레이/노트에 추가 버튼 */}
              {showAddNoteOverlay && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <h3 className="text-lg font-semibold mb-4">선택한 텍스트를 노트에 추가</h3>
                    <div className="bg-gray-50 p-3 rounded mb-4 text-sm">
                      "{selectedText}"
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setCurrentNote(prev => ({
                            ...prev,
                            notes: prev.notes + '\n\n' + selectedText
                          }));
                          setShowAddNoteOverlay(false);
                          setSelectedText('');
                          handleAddNote(); // 노트에 추가 버튼 클릭 시 NoteSection 열기
                        }}
                        variant="primary"
                        className="flex-1"
                      >
                        노트에 추가
                      </Button>
                      <Button
                        onClick={() => {
                          setShowAddNoteOverlay(false);
                          setSelectedText('');
                        }}
                        variant="secondary"
                        className="flex-1"
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'concept' && (
            <div className="p-6 min-h-0 flex-1 flex flex-col">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 flex flex-col gap-6 flex-1 min-h-0">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 개념 정리</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-blue-700 mb-2">학습 목적</h4>
                    <p className="text-gray-700">{textbook.purpose}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-blue-700 mb-2">학습 강도</h4>
                    <p className="text-gray-700">{textbook.intensity}</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 flex-1 min-h-0">
                  <h4 className="font-bold text-blue-700 mb-2">핵심 개념 요약</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h5 className="font-semibold text-blue-800">Process Control Block (PCB)</h5>
                      <p className="text-sm text-blue-700">운영체제가 각 프로세스를 관리하기 위한 핵심 자료구조</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h5 className="font-semibold text-green-800">Context Switching</h5>
                      <p className="text-sm text-green-700">프로세스 간 전환 시 상태 정보를 저장하고 복원하는 과정</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'review' && (
            <div className="p-6 min-h-0 flex-1 flex flex-col">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 flex flex-col gap-6 flex-1 min-h-0">
                <h3 className="text-lg font-semibold text-green-900 mb-4">🧠 복습 현황</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">85%</div>
                    <div className="text-sm text-gray-600">이해도</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-gray-600">복습 완료</div>
                  </div>
                </div>
                {/* 복습 플래너/추천 영역 */}
                <div className="bg-white rounded-lg p-4 mt-4 flex-1 min-h-0">
                  <h4 className="font-bold text-green-700 mb-2">오늘/이번주 복습 추천</h4>
                  <ul className="list-disc pl-6 text-gray-800 space-y-1">
                    <li>Chapter 3: PCB 개념 복습</li>
                    <li>노트 2개, 퀴즈 1개</li>
                    <li>오답노트 1개</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'plan' && (
            <div className="flex-1 min-h-0 h-full flex flex-col">
              <div className="p-6">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">🧭 학습 플랜 관리</h3>
                  {textbook.plan && textbook.plan.length > 0 ? (
                    <AIPlanGenerator
                      studyIntensity={textbook.intensity || '보통'}
                      planTasks={textbook.plan}
                      setPlanTasks={(newPlan) => {
                        setTextbook(prev => ({ ...prev, plan: newPlan }));
                        // 로컬 스토리지 업데이트
                        const savedBooks = JSON.parse(localStorage.getItem('textbooks') || '[]');
                        const updatedBooks = savedBooks.map(book => 
                          book.id === textbook.id ? { ...book, plan: newPlan } : book
                        );
                        localStorage.setItem('textbooks', JSON.stringify(updatedBooks));
                      }}
                      readOnly={false}
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>아직 설정된 학습 플랜이 없습니다.</p>
                      <p className="text-sm mt-2">새 원서 생성 시 학습 플랜을 설정할 수 있습니다.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'notes' && (
            <div className="flex-1 min-h-0 h-full flex flex-col">
              <div className="p-6">
                <NoteSection
                  currentNote={currentNote}
                  setCurrentNote={setCurrentNote}
                  noteMode={noteMode}
                  setNoteMode={setNoteMode}
                  activeNoteTab={activeNoteTab}
                  setActiveNoteTab={setActiveNoteTab}
                  saveNote={saveNote}
                  startNewNote={startNewNote}
                  existingNotes={existingNotes}
                  setExistingNotes={setExistingNotes}
                  selectedNote={selectedNote}
                  setSelectedNote={setSelectedNote}
                  setHoveredNote={setHoveredNote}
                  hoveredNote={hoveredNote}
                />
              </div>
            </div>
          )}
          {activeTab === 'quiz' && (
            <div className="flex-1 min-h-0 h-full flex flex-col">
              <div className="p-6">
                <QuizSection 
                  quizList={[
                    "PCB의 주요 구성요소는 무엇인가요?",
                    "Context Switching이 발생할 때 어떤 과정을 거치나요?",
                    "프로세스 상태 중 WAITING 상태는 언제 발생하나요?",
                    "PCB에서 Process ID의 역할은 무엇인가요?"
                  ]}
                  wrongNotes={[
                    "Context Switching 오버헤드 계산",
                    "PCB 메모리 구조 이해"
                  ]}
                />
              </div>
            </div>
          )}
        </div>
        {/* NoteSection: 데스크탑에서 showNoteSection이 true일 때만 오른쪽에 표시 */}
        {isDesktop && showNoteSection && (
          <div className="flex flex-col shadow-lg border-l bg-white min-h-0" style={{ flex: '0 0 40%', maxWidth: '40%' }}>
            <NoteSection
              currentNote={currentNote}
              setCurrentNote={setCurrentNote}
              noteMode={noteMode}
              setNoteMode={setNoteMode}
              activeNoteTab={activeNoteTab}
              setActiveNoteTab={setActiveNoteTab}
              saveNote={saveNote}
              startNewNote={startNewNote}
              existingNotes={existingNotes}
              setExistingNotes={setExistingNotes}
              selectedNote={selectedNote}
              setSelectedNote={setSelectedNote}
              setHoveredNote={setHoveredNote}
              hoveredNote={hoveredNote}
            />
          </div>
        )}
      </div>
      {/* Toast 알림 */}
      <Toast open={showToast} onClose={() => setShowToast(false)} type={toastType}>
        {toastMessage}
      </Toast>
    </div>
  );
} 
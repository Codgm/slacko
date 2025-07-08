import { useState, useRef, useEffect } from 'react';
import Button from '../../components/common/Button';
import { ArrowLeft, BookOpen, Target, FileText, Settings, Brain, ChevronLeft, ChevronRight, Clock, Minimize2, Maximize2 } from 'lucide-react';
import ConceptStudyComponent from '../../components/ConceptStudyComponent';
import StudyPlanComponent from '../../components/StudyPlanComponent';
import ChapterPreview from '../../components/textbook/ChapterPreview';
import ProgressBar from '../../components/common/ProgressBar';
import NoteSection from '../../components/notes/NoteSection';
import QuizSection from '../../components/notes/QuizSection';
import TextbookContentCard from '../../components/textbook/TextbookContentCard';

// 집중 학습 모드(전체화면) 인터페이스
const IntegratedStudyInterface = ({ textbook, onClose }) => {
  const [currentPage, setCurrentPage] = useState(95);
  const [isNoteCollapsed, setIsNoteCollapsed] = useState(false);
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
      title: 'Process 개념 정리',
      pageRange: '90-94',
      date: '2025-07-01',
      chapter: 'Chapter 3',
      summary: '프로세스의 정의와 상태 변화 모델',
      content: {
        cues: '• 프로세스란?\n• 프로그램과 차이점?\n• 프로세스 상태',
        notes: '프로세스는 실행 중인 프로그램을 의미한다.\n- 메모리에 로드된 상태\n- CPU 시간을 할당받을 수 있는 상태\n- 독립적인 메모리 공간 보유',
        summary: '프로세스 = 실행 중인 프로그램 + 시스템 자원'
      }
    },
    {
      id: 2,
      title: 'Context Switching',
      pageRange: '88-89',
      date: '2025-06-30',
      chapter: 'Chapter 3',
      summary: '컨텍스트 스위칭의 필요성과 오버헤드',
      content: {
        cues: '• Context Switching이란?\n• 언제 발생?\n• 오버헤드는?',
        notes: 'CPU를 한 프로세스에서 다른 프로세스로 넘겨주는 과정\n- 현재 상태 저장 (PCB에)\n- 새 프로세스 상태 복원\n- 시간이 많이 소요되는 작업',
        summary: 'Context Switching = 프로세스 간 CPU 전환 과정'
      }
    }
  ]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [hoveredNote, setHoveredNote] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const textbookContent = {
    chapter: 'Chapter 3',
    section: '3.2 Process Control Block',
    title: 'Process Control Block (PCB)',
    content: `\nProcess Control Block (PCB)는 운영체제가 프로세스를 관리하기 위해 유지하는 자료구조입니다.\n\n**PCB의 주요 구성요소:**\n\n1. **Process ID (PID)**\n   - 프로세스를 고유하게 식별하는 번호\n   - 시스템 내에서 중복되지 않는 정수값\n\n2. **Process State**\n   - NEW: 프로세스가 생성 중인 상태\n   - READY: CPU 할당을 기다리는 상태  \n   - RUNNING: 현재 CPU를 사용하고 있는 상태\n   - WAITING: I/O 완료 등을 기다리는 상태\n   - TERMINATED: 프로세스가 종료된 상태\n\n3. **Program Counter (PC)**\n   - 다음에 실행할 명령어의 주소를 저장\n   - Context switching 시 복원에 필요\n\n4. **CPU Registers**\n   - 프로세스 실행 중 사용된 레지스터 값들\n   - 인덱스 레지스터, 스택 포인터, 범용 레지스터 등\n\n5. **Memory Management Information**\n   - 베이스/리미트 레지스터 값\n   - 페이지 테이블 또는 세그먼트 테이블 정보\n    `,
    pageInfo: '페이지 95-97'
  };

  const saveNote = () => {
    if (currentNote.notes.trim() || currentNote.cues.trim() || currentNote.summary.trim()) {
      const newNote = {
        id: existingNotes.length + 1,
        title: currentNote.summary ? currentNote.summary.substring(0, 30) + '...' : '새 노트',
        pageRange: currentNote.pageRange,
        date: new Date().toISOString().split('T')[0],
        chapter: 'Chapter 3',
        summary: currentNote.summary || '요약 없음',
        content: {
          cues: currentNote.cues,
          notes: currentNote.notes,
          summary: currentNote.summary
        }
      };
      setExistingNotes([newNote, ...existingNotes]);
      setNoteMode('view');
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
    <div className="fixed inset-0 z-50 bg-white bg-opacity-95 flex flex-col">
      {/* 전체화면 모달 헤더 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="돌아가기"
            aria-label="돌아가기"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">{textbook.title}</h1>
              <p className="text-sm text-gray-600">집중 학습 모드</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">진행 중</span>
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
        <div className="w-full md:w-5/12 bg-gray-50 flex flex-col p-0 md:p-6">
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

function SlidingTabBar({ tabs, activeTab, setActiveTab }) {
  const tabRefs = useRef([]);
  const underlineRef = useRef(null);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const idx = tabs.findIndex(tab => tab.id === activeTab);
    const tabEl = tabRefs.current[idx];
    if (tabEl) {
      setUnderlineStyle({
        left: tabEl.offsetLeft,
        width: tabEl.clientWidth
      });
    }
  }, [activeTab, tabs]);

  // 윈도우 리사이즈 대응
  useEffect(() => {
    const handleResize = () => {
      const idx = tabs.findIndex(tab => tab.id === activeTab);
      const tabEl = tabRefs.current[idx];
      if (tabEl) {
        setUnderlineStyle({
          left: tabEl.offsetLeft,
          width: tabEl.clientWidth
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab, tabs]);

  return (
    <nav className="relative max-w-4xl mx-auto overflow-x-auto scrollbar-hide px-2 sm:px-4 md:px-0">
      <div className="flex gap-2 sm:gap-4 md:gap-6 relative">
        {/* underline */}
        <span
          ref={underlineRef}
          className="absolute bottom-0 h-1 bg-blue-600 rounded-full transition-all duration-300 z-10"
          style={{ left: underlineStyle.left, width: underlineStyle.width }}
          aria-hidden="true"
        />
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={el => (tabRefs.current[i] = el)}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex flex-col items-center py-3 px-2 sm:px-4 rounded-lg transition-all font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
              activeTab === tab.id
                ? 'text-blue-700 font-bold' : 'text-gray-500 hover:text-blue-600'
            }`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
            tabIndex={0}
          >
            <span className="text-xl mb-1">{tab.emoji}</span>
            <span className="text-xs sm:text-sm">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default function TextbookDetailPage() {
  const [activeTab, setActiveTab] = useState('content');
  const [isFullScreenStudy, setIsFullScreenStudy] = useState(false);
  const [showChapterPreview, setShowChapterPreview] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

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

  const textbookContent = {
    chapter: 'Chapter 3',
    section: '3.2 Process Control Block',
    title: 'Process Control Block (PCB)',
    content: `\nProcess Control Block (PCB)는 운영체제가 프로세스를 관리하기 위해 유지하는 자료구조입니다.\n\n**PCB의 주요 구성요소:**\n\n1. **Process ID (PID)**\n   - 프로세스를 고유하게 식별하는 번호\n   - 시스템 내에서 중복되지 않는 정수값\n\n2. **Process State**\n   - NEW: 프로세스가 생성 중인 상태\n   - READY: CPU 할당을 기다리는 상태  \n   - RUNNING: 현재 CPU를 사용하고 있는 상태\n   - WAITING: I/O 완료 등을 기다리는 상태\n   - TERMINATED: 프로세스가 종료된 상태\n\n3. **Program Counter (PC)**\n   - 다음에 실행할 명령어의 주소를 저장\n   - Context switching 시 복원에 필요\n\n4. **CPU Registers**\n   - 프로세스 실행 중 사용된 레지스터 값들\n   - 인덱스 레지스터, 스택 포인터, 범용 레지스터 등\n\n5. **Memory Management Information**\n   - 베이스/리미트 레지스터 값\n   - 페이지 테이블 또는 세그먼트 테이블 정보\n    `,
    pageInfo: '페이지 95-97'
  };

  function saveNote() {
    if (currentNote.notes.trim() || currentNote.cues.trim() || currentNote.summary.trim()) {
      const newNote = {
        id: existingNotes.length + 1,
        title: currentNote.summary ? currentNote.summary.substring(0, 30) + '...' : '새 노트',
        pageRange: currentNote.pageRange,
        date: new Date().toISOString().split('T')[0],
        chapter: 'Chapter 3',
        summary: currentNote.summary || '요약 없음',
        content: {
          cues: currentNote.cues,
          notes: currentNote.notes,
          summary: currentNote.summary
        }
      };
      setExistingNotes([newNote, ...existingNotes]);
      setNoteMode('view');
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

  const textbook = {
    id: 1,
    title: 'Operating System Concepts',
    author: 'Abraham Silberschatz',
    publisher: 'Wiley',
    totalPages: 944,
    currentPage: 156,
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
    progress: 16.5,
    studyStartDate: '2025-06-01',
    notes: 23,
    bookmarks: 8,
    category: 'Computer Science'
  };

  const tabList = [
    { id: 'content', label: '원서 본문', emoji: '📖' },
    { id: 'concept', label: '개념 정리', emoji: '💡' },
    { id: 'review', label: '복습 현황', emoji: '🧠' },
    { id: 'plan', label: '학습 플랜', emoji: '🧭' },
    { id: 'notes', label: '노트/요약', emoji: '✍️' },
    { id: 'quiz', label: '퀴즈', emoji: '📝' },
  ];

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isFullScreenStudy) {
    return (
      <IntegratedStudyInterface 
        textbook={textbook}
        onClose={() => setIsFullScreenStudy(false)}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* 상단: compact 요약 카드 + 챕터 네비게이터 */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 px-4 md:px-8 pt-6 pb-2">
        <div className="flex items-center gap-4">
          <img src={textbook.coverImage} alt="cover" className="w-20 h-28 rounded-lg shadow border object-cover" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">{textbook.title}</h1>
            <p className="text-xs text-gray-600">저자: {textbook.author} · 출판사: {textbook.publisher}</p>
            <div className="flex gap-2 mt-2">
              <span className="bg-blue-50 text-blue-700 rounded px-2 py-1 text-xs">노트 {textbook.notes}</span>
              <span className="bg-green-50 text-green-700 rounded px-2 py-1 text-xs">북마크 {textbook.bookmarks}</span>
              <span className="bg-purple-50 text-purple-700 rounded px-2 py-1 text-xs">학습일 {textbook.studyDays}</span>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-start md:items-end gap-1">
          <span className="text-xs text-gray-500">진행률 {textbook.progress}%</span>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${textbook.progress}%` }}></div>
          </div>
          <span className="text-xs text-gray-500">{textbook.currentPage} / {textbook.totalPages}p</span>
        </div>
      </div>
      {/* 탭 바 (모바일/데스크탑 모두) */}
      <div className="w-full border-b bg-white sticky top-0 z-30">
        <div className="max-w-4xl mx-auto">
          <div className="flex">
            {tabList.map(tab => (
              <button
                key={tab.id}
                className={`flex-1 py-3 text-sm md:text-base font-medium transition-all ${activeTab === tab.id ? 'text-blue-700 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-blue-700'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="mr-1">{tab.emoji}</span>{tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* 탭별 컨텐츠 */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {activeTab === 'content' && (
          <div className="w-full max-w mx-auto px-4 py-6">
            <TextbookContentCard
              title={textbookContent.title}
              content={textbookContent.content}
              page={currentPage}
              onPrev={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              onNext={() => setCurrentPage(prev => prev + 1)}
              className="w-full"
            />
          </div>
        )}
        {activeTab === 'concept' && (
          <div className="p-6">
            {/* 개념 정리: 핵심 개념 요약/정리만 보여줌 */}
            <div className="bg-white rounded-xl shadow p-6 border border-blue-100">
              <h2 className="text-xl font-bold text-blue-900 mb-4">💡 개념 정리</h2>
              <ul className="list-disc pl-6 text-gray-800 space-y-2">
                <li>PCB(프로세스 제어 블록)의 정의와 목적</li>
                <li>PCB의 주요 구성요소: PID, 상태, Program Counter, 레지스터, 메모리 정보 등</li>
                <li>Context Switching과 PCB의 관계</li>
                <li>운영체제에서 PCB가 왜 중요한지</li>
                <li>멀티태스킹/프로세스 관리의 핵심 개념</li>
              </ul>
              <div className="mt-6 text-sm text-gray-500">※ 본 개념 정리는 원서 본문과 별도로, 시험/면접 대비 핵심만 요약한 내용입니다.</div>
            </div>
          </div>
        )}
        {activeTab === 'review' && (
          <div className="p-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
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
            </div>
          </div>
        )}
        {activeTab === 'plan' && (
          <StudyPlanComponent />
        )}
        {activeTab === 'notes' && (
          <div className="w-full">
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
        {activeTab === 'quiz' && (
          <QuizSection
            quizList={[
              'PCB의 주요 구성요소를 3가지 이상 서술하시오.',
              'Context Switching이 발생하는 상황을 예시와 함께 설명하시오.',
              'Process State의 종류와 각 상태의 의미를 정리하시오.'
            ]}
            wrongNotes={[
              'Context Switching의 오버헤드 설명이 부족함',
              '프로세스 상태 전이 조건 미흡'
            ]}
          />
        )}
      </div>
    </div>
  );
} 
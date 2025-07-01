import { useState } from 'react';
import { ArrowLeft, BookOpen, Target, FileText, Settings, Brain, Eye, PenTool, Save, Plus, ChevronLeft, ChevronRight, Clock, Hash, Minimize2, Maximize2 } from 'lucide-react';
import ConceptStudyComponent from '../components/ConceptStudyComponent';
import StudyPlanComponent from '../components/StudyPlanComponent';

// 통합 학습 인터페이스 컴포넌트
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
  const [ setHoveredNote] = useState(null);

  const textbookContent = {
    chapter: "Chapter 3",
    section: "3.2 Process Control Block",
    title: "Process Control Block (PCB)",
    content: `
Process Control Block (PCB)는 운영체제가 프로세스를 관리하기 위해 유지하는 자료구조입니다.

**PCB의 주요 구성요소:**

1. **Process ID (PID)**
   - 프로세스를 고유하게 식별하는 번호
   - 시스템 내에서 중복되지 않는 정수값

2. **Process State**
   - NEW: 프로세스가 생성 중인 상태
   - READY: CPU 할당을 기다리는 상태  
   - RUNNING: 현재 CPU를 사용하고 있는 상태
   - WAITING: I/O 완료 등을 기다리는 상태
   - TERMINATED: 프로세스가 종료된 상태

3. **Program Counter (PC)**
   - 다음에 실행할 명령어의 주소를 저장
   - Context switching 시 복원에 필요

4. **CPU Registers**
   - 프로세스 실행 중 사용된 레지스터 값들
   - 인덱스 레지스터, 스택 포인터, 범용 레지스터 등

5. **Memory Management Information**
   - 베이스/리미트 레지스터 값
   - 페이지 테이블 또는 세그먼트 테이블 정보
    `,
    pageInfo: "페이지 95-97"
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
      alert('노트가 저장되었습니다!');
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
            <button
              onClick={() => setIsNoteCollapsed(!isNoteCollapsed)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title={isNoteCollapsed ? "노트 영역 펼치기" : "노트 영역 접기"}
            >
              {isNoteCollapsed ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 왼쪽: 교재 내용 */}
        <div className={`${isNoteCollapsed ? 'w-full' : 'w-3/5'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
          {/* 페이지 네비게이션 */}
          <div className="border-b border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>이전</span>
              </button>
              <span className="font-medium text-gray-900 px-4 py-2 bg-gray-50 rounded-lg">페이지 {currentPage}</span>
              <button 
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span>다음</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 교재 본문 */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">{textbookContent.title}</h2>
              <div className="prose prose-lg max-w-none">
                {textbookContent.content.split('\n').map((paragraph, index) => {
                  if (paragraph.trim() === '') return <br key={index} />;
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return <h3 key={index} className="text-xl font-semibold text-gray-800 mt-8 mb-4">{paragraph.slice(2, -2)}</h3>;
                  }
                  if (paragraph.trim().startsWith('- ')) {
                    return <li key={index} className="ml-6 mb-3 text-gray-700 leading-relaxed">{paragraph.slice(2)}</li>;
                  }
                  if (paragraph.trim().match(/^\d+\./)) {
                    return <p key={index} className="font-semibold text-gray-800 mt-6 mb-3 text-lg">{paragraph}</p>;
                  }
                  return <p key={index} className="mb-5 text-gray-700 leading-relaxed text-lg">{paragraph}</p>;
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 노트 영역 */}
        {!isNoteCollapsed && (
          <div className="w-2/5 bg-gray-50 flex flex-col">
            {/* 탭 헤더 */}
            <div className="bg-white border-b border-gray-100">
              <div className="flex items-center justify-between p-5 pb-0">
                <h3 className="font-bold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-slate-600" />
                  Chapter 3 노트
                </h3>
                <div className="flex items-center space-x-2">
                  {activeNoteTab === 'write' && (
                    <>
                      <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setNoteMode('view')}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            noteMode === 'view'
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Eye className="w-4 h-4 inline mr-1" />
                          읽기
                        </button>
                        <button
                          onClick={() => setNoteMode('edit')}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            noteMode === 'edit'
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <PenTool className="w-4 h-4 inline mr-1" />
                          편집
                        </button>
                      </div>
                      {noteMode === 'edit' && (
                        <button
                          onClick={saveNote}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>저장</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActiveNoteTab('write')}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeNoteTab === 'write'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  노트 작성
                </button>
                <button
                  onClick={() => setActiveNoteTab('list')}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeNoteTab === 'list'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  노트 목록 ({existingNotes.filter(note => note.chapter === 'Chapter 3').length})
                </button>
              </div>
            </div>

            {/* 탭 콘텐츠 */}
            <div className="flex-1 overflow-hidden">
              {activeNoteTab === 'write' ? (
                <div className="h-full">
                  {noteMode === 'view' ? (
                    /* 읽기 모드 */
                    <div className="h-full flex flex-col">
                      <div className="p-5 bg-white border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Hash className="w-4 h-4 text-gray-400" />
                            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                              {currentNote.pageRange}p
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date().toLocaleDateString()}
                            </span>
                          </div>
                          <button
                            onClick={startNewNote}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                          >
                            <Plus className="w-4 h-4" />
                            <span>새 노트</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col">
                        <div className="flex flex-1">
                          <div className="w-2/5 bg-amber-50 border-r border-amber-100">
                            <div className="p-4 bg-amber-100 border-b border-amber-200">
                              <h4 className="font-semibold text-amber-800 text-sm flex items-center">
                                <Brain className="w-4 h-4 mr-2" />
                                질문 & 키워드
                              </h4>
                            </div>
                            <div className="p-4 h-full overflow-y-auto">
                              <div className="text-sm text-amber-900 leading-relaxed whitespace-pre-wrap">
                                {currentNote.cues || '작성된 내용이 없습니다.'}
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 bg-white">
                            <div className="p-4 bg-blue-50 border-b border-blue-100">
                              <h4 className="font-semibold text-blue-800 text-sm flex items-center">
                                <FileText className="w-4 h-4 mr-2" />
                                메인 노트
                              </h4>
                            </div>
                            <div className="p-4 h-full overflow-y-auto">
                              <div className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
                                {currentNote.notes || '작성된 내용이 없습니다.'}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="h-32 bg-emerald-50 border-t border-emerald-100">
                          <div className="p-4 bg-emerald-100 border-b border-emerald-200">
                            <h4 className="font-semibold text-emerald-800 text-sm flex items-center">
                              <Target className="w-4 h-4 mr-2" />
                              핵심 요약
                            </h4>
                          </div>
                          <div className="p-4 h-full overflow-y-auto">
                            <div className="text-sm text-emerald-900 leading-relaxed">
                              {currentNote.summary || '작성된 내용이 없습니다.'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* 편집 모드 */
                    <div className="h-full flex flex-col">
                      <div className="p-5 bg-white border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={currentNote.pageRange}
                            onChange={(e) => setCurrentNote(prev => ({...prev, pageRange: e.target.value}))}
                            className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="페이지 범위 (예: 95-97)"
                          />
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex flex-1">
                          <div className="w-2/5 bg-amber-50 border-r border-amber-100">
                            <div className="p-4 bg-amber-100 border-b border-amber-200">
                              <h4 className="font-semibold text-amber-800 text-sm flex items-center">
                                <Brain className="w-4 h-4 mr-2" />
                                질문 & 키워드
                              </h4>
                            </div>
                            <div className="p-4 h-full">
                              <textarea
                                value={currentNote.cues}
                                onChange={(e) => setCurrentNote(prev => ({...prev, cues: e.target.value}))}
                                placeholder="• 핵심 질문들을 입력하세요"
                                className="w-full h-full border-none outline-none resize-none text-sm bg-transparent leading-relaxed placeholder-amber-500 text-amber-900"
                              />
                            </div>
                          </div>
                          <div className="flex-1 bg-white">
                            <div className="p-4 bg-blue-50 border-b border-blue-100">
                              <h4 className="font-semibold text-blue-800 text-sm flex items-center">
                                <FileText className="w-4 h-4 mr-2" />
                                메인 노트
                              </h4>
                            </div>
                            <div className="p-4 h-full">
                              <textarea
                                value={currentNote.notes}
                                onChange={(e) => setCurrentNote(prev => ({...prev, notes: e.target.value}))}
                                placeholder="핵심 내용을 자유롭게 정리하세요"
                                className="w-full h-full border-none outline-none resize-none text-sm leading-relaxed text-gray-900"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="h-32 bg-emerald-50 border-t border-emerald-100">
                          <div className="p-4 bg-emerald-100 border-b border-emerald-200">
                            <h4 className="font-semibold text-emerald-800 text-sm flex items-center">
                              <Target className="w-4 h-4 mr-2" />
                              핵심 요약
                            </h4>
                          </div>
                          <div className="p-4 h-full">
                            <textarea
                              value={currentNote.summary}
                              onChange={(e) => setCurrentNote(prev => ({...prev, summary: e.target.value}))}
                              placeholder="학습한 내용을 한 문장으로 요약해보세요"
                              className="w-full h-full border-none outline-none resize-none text-sm bg-transparent leading-relaxed placeholder-emerald-500 text-emerald-900"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* 노트 목록 */
                <div className="h-full overflow-y-auto p-5">
                  <div className="space-y-2">
                    {existingNotes
                      .filter(note => note.chapter === 'Chapter 3')
                      .map(note => (
                      <div key={note.id} className="relative">
                        <div
                          className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer transition-all hover:border-blue-300 hover:shadow-sm"
                          onMouseEnter={() => setHoveredNote(note.id)}
                          onMouseLeave={() => setHoveredNote(null)}
                          onClick={() => setSelectedNote(selectedNote?.id === note.id ? null : note)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3 mb-1">
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium">
                                  {note.pageRange}p
                                </span>
                                <span className="text-xs text-gray-500">{note.date}</span>
                              </div>
                              <h5 className="font-medium text-gray-900 truncate">{note.title}</h5>
                              <p className="text-sm text-gray-600 truncate mt-1">{note.summary}</p>
                            </div>
                            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                              selectedNote?.id === note.id ? 'rotate-90' : ''
                            }`} />
                          </div>
                        </div>
                        {selectedNote?.id === note.id && (
                          <div className="bg-gray-50 border-t border-gray-200 p-4 space-y-4">
                            <div className="bg-white rounded-lg p-4 border-l-4 border-amber-400">
                              <h6 className="text-sm font-semibold text-amber-800 mb-2">질문 & 키워드</h6>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content.cues}</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-400">
                              <h6 className="text-sm font-semibold text-blue-800 mb-2">메인 노트</h6>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content.notes}</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 border-l-4 border-emerald-400">
                              <h6 className="text-sm font-semibold text-emerald-800 mb-2">핵심 요약</h6>
                              <p className="text-sm text-gray-700">{note.content.summary}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 하단: 상태바 */}
      <div className="bg-white border-t border-gray-100 px-6 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Chapter 3 · Process Management</span>
            <span>•</span>
            <span>총 {existingNotes.filter(note => note.chapter === 'Chapter 3').length}개 노트</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>마지막 저장: 방금 전</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 메인 원서 상세 페이지
const TextbookDetailPage = () => {
  const [activeTab, setActiveTab] = useState('concept');
  const [isFullScreenStudy, setIsFullScreenStudy] = useState(false);

  const textbook = {
    id: 1,
    title: "Operating System Concepts",
    author: "Abraham Silberschatz",
    publisher: "Wiley",
    totalPages: 944,
    currentPage: 156,
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    progress: 16.5,
    studyStartDate: "2025-06-01",
    notes: 23,
    bookmarks: 8,
    category: "Computer Science"
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'concept':
        return (
          <ConceptStudyComponent/>
        );
      case 'review':
        return (
          <div className="p-6 space-y-6">
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
        );
      case 'plan':
        return (
          <StudyPlanComponent/>
        );
      case 'notes':
        return (
          <div className="p-6">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">📚 집중 학습 모드</h3>
                <p className="text-gray-600 mb-6">
                  교재와 노트를 동시에 보면서 효율적으로 학습해보세요.
                  <br />
                  코넬 노트 방식으로 체계적인 정리가 가능합니다.
                </p>
                <button
                  onClick={() => setIsFullScreenStudy(true)}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-3 mx-auto"
                >
                  <BookOpen className="w-6 h-6" />
                  <span>집중 학습 모드로 전환</span>
                </button>
                <div className="mt-4 text-sm text-gray-500">
                  전체화면에서 교재 읽기와 노트 작성을 함께 할 수 있습니다
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // 전체화면 학습 모드가 활성화된 경우
  if (isFullScreenStudy) {
    return (
      <IntegratedStudyInterface 
        textbook={textbook}
        onClose={() => setIsFullScreenStudy(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center">
            <button className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">원서 상세</h1>
              <p className="text-sm text-gray-600">학습 진도와 계획을 관리하세요</p>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* 책 정보 섹션 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={textbook.coverImage}
                alt={textbook.title}
                className="w-32 h-40 object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{textbook.title}</h2>
                <p className="text-gray-600 mb-1">저자: {textbook.author}</p>
                <p className="text-gray-600 mb-1">출판사: {textbook.publisher}</p>
                <p className="text-gray-600">총 {textbook.totalPages}페이지</p>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">학습 진도</span>
                  <span className="text-sm text-gray-600">
                    {textbook.currentPage} / {textbook.totalPages} 페이지 ({textbook.progress}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${textbook.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{textbook.notes}</div>
                  <div className="text-xs text-gray-600">노트</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{textbook.bookmarks}</div>
                  <div className="text-xs text-gray-600">북마크</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">12</div>
                  <div className="text-xs text-gray-600">학습일</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
          {renderTabContent()}
        </div>
      </div>

      {/* 하단 탭 네비게이션 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-around py-2">
            {[
              { id: 'concept', label: '개념 정리', icon: BookOpen, emoji: '📖' },
              { id: 'review', label: '복습 현황', icon: Target, emoji: '🧠' },
              { id: 'plan', label: '학습 플랜', icon: Settings, emoji: '🧭' },
              { id: 'notes', label: '노트/요약', icon: FileText, emoji: '✍️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-3 px-4 transition-all ${
                  activeTab === tab.id
                    ? 'text-blue-600 bg-blue-50 rounded-lg'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="text-lg mb-1">{tab.emoji}</span>
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextbookDetailPage;
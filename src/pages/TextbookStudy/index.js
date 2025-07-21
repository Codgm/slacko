import React, { useState, useEffect } from 'react';
import { useOutletContext, useParams, useLocation } from 'react-router-dom';
import { Search, Settings, NotebookPen, X, MessageSquare, Eye } from 'lucide-react';
import Breadcrumb from '../../components/common/Breadcrumb';
import TextbookContentView from '../../components/textbook/TextbookContentView';
import NoteBookView from '../../components/textbook/NoteBookView';
import StudyProgressView from '../../components/textbook/StudyProgressView';

const TextbookStudyPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const context = useOutletContext();
  const activeView = context ? context.activeView : 'content';
  const { textbookTitle } = location.state || {}; // 상세 페이지에서 전달받은 제목

  // 데이터 상태 (원서 객체 기반)
  const [currentPage, setCurrentPage] = useState(1);
  const [plan, setPlan] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [studyTimer, setStudyTimer] = useState(0);
  const [allNotes, setAllNotes] = useState([]);

  // UI 상태 
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState(null);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [highlightColor, setHighlightColor] = useState('bg-yellow-200');
  const [isStudying, setIsStudying] = useState(false);
  const [isNotePanelVisible, setIsNotePanelVisible] = useState(false);

  const textbookContent = `Process Control Block (PCB)는 운영체제가 각 프로세스를 관리하기 위해 유지하는 자료구조입니다. PCB는 프로세스의 상태 정보를 체계적으로 저장하고 관리하는 역할을 합니다.

주요 구성요소:
1. Process ID (PID): 프로세스의 고유 식별자
2. Process State: 프로세스의 현재 상태 (NEW, READY, RUNNING, WAITING, TERMINATED)
3. Program Counter: 다음에 실행할 명령어의 주소
4. CPU Registers: 프로세스 실행 중 사용된 레지스터 값들
5. Memory Management Information: 메모리 할당 정보

Context Switching이 발생할 때, 운영체제는 현재 실행 중인 프로세스의 상태를 PCB에 저장하고, 다음에 실행할 프로세스의 상태를 PCB에서 복원합니다. 이 과정은 멀티태스킹 운영체제에서 매우 중요한 역할을 합니다.

프로세스 스케줄링에서 PCB는 중앙 집중식 관리를 가능하게 합니다. 스케줄러는 PCB 정보를 기반으로 어떤 프로세스를 다음에 실행할지 결정하며, 이때 프로세스의 우선순위, 대기 시간, CPU 사용 시간 등을 고려합니다.`;

  const highlightColors = [
    { name: '노랑', class: 'bg-yellow-200', preview: 'bg-yellow-200' },
    { name: '파랑', class: 'bg-blue-200', preview: 'bg-blue-200' },
    { name: '초록', class: 'bg-green-200', preview: 'bg-green-200' },
    { name: '분홍', class: 'bg-pink-200', preview: 'bg-pink-200' },
    { name: '보라', class: 'bg-purple-200', preview: 'bg-purple-200' }
  ];

  // 원서 데이터 불러오기
  useEffect(() => {
    const books = JSON.parse(localStorage.getItem('textbooks') || '[]');
    const found = books.find(b => String(b.id) === String(id));
    if (found) {
      setCurrentPage(found.currentPage || 1);
      setPlan(found.plan || []);
      // notes를 highlights 형식으로 변환하여 로드
      setHighlights(found.notes ? found.notes.map(n => ({
        id: n.id,
        text: n.title,
        color: n.color || 'bg-yellow-200',
        note: n.content,
        page: n.page,
        createdAt: n.createdAt,
        updatedAt: n.updatedAt,
        type: n.type,
        tags: n.tags,
      })) : []);
      setStudyTimer(found.studyTime || 0);
    }
  }, [id]);

  // highlights -> allNotes 동기화 (노트 패널/뷰용 데이터)
  useEffect(() => {
    const notesFromHighlights = highlights
      .filter(h => h.note && h.note.trim() !== '') // 빈 노트 필터링
      .map(h => ({
        id: h.id,
        title: h.text,
        content: h.note,
        page: h.page,
        color: h.color.replace('bg-', '').replace('-200', ''), // 'bg-yellow-200' -> 'yellow'
        createdAt: h.createdAt || new Date().toISOString(),
        updatedAt: h.updatedAt || new Date().toISOString(),
        tags: h.tags || [],
        type: h.type || 'memo',
      }));
    setAllNotes(notesFromHighlights);
  }, [highlights]);
  
  // 주요 데이터 변경 시 localStorage 업데이트
  useEffect(() => {
    if (!id) return;
    
    const books = JSON.parse(localStorage.getItem('textbooks') || '[]');
    const idx = books.findIndex(b => String(b.id) === String(id));
    if (idx !== -1) {
      const updatedBook = {
        ...books[idx],
        currentPage,
        plan,
        notes: highlights.map(h => ({
          id: h.id,
          title: h.text,
          content: h.note,
          page: h.page,
          color: h.color,
          createdAt: h.createdAt,
          updatedAt: h.updatedAt,
          type: h.type,
          tags: h.tags,
        })),
        studyTime: studyTimer,
      };
      
      books[idx] = updatedBook;
      localStorage.setItem('textbooks', JSON.stringify(books));
    }
  }, [currentPage, plan, highlights, studyTimer, id]); // book 제외하여 무한루프 방지

  useEffect(() => {
    let interval;
    if (isStudying) {
      interval = setInterval(() => {
        setStudyTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStudying]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTextSelect = (text, position) => {
    setSelectedText(text);
    setSelectionPosition(position);
    setShowQuickActions(true);
  };

  const handleAddHighlight = (color = highlightColor) => {
    if (selectedText) {
      const newHighlight = {
        id: Date.now(),
        text: selectedText,
        color: color,
        note: '',
        page: currentPage
      };
      setHighlights([...highlights, newHighlight]);
      setShowQuickActions(false);
      setSelectedText('');
      window.getSelection().removeAllRanges();
    }
  };

  const handleAddNote = () => {
    setShowNoteDialog(true);
  };

  const handleOpenNotePanel = () => {
    // 그냥 패널만 열 때는 selectedText가 없을 수 있음
    // 텍스트 선택 후 '노트 추가' 액션을 통해 열 때는 selectedText가 있음
    setIsNotePanelVisible(true);
    setShowQuickActions(false);
  };

  const handleHighlightClick = (highlightId) => {
    console.log('Clicked on highlight:', highlightId);
    // 향후 하이라이트 클릭 시 노트 패널의 해당 노트로 스크롤하는 등의 기능 추가 가능
  };

  const handleSaveNote = () => { // 이건 메모 추가 다이얼로그 저장
    if (!noteContent.trim()) {
      alert('메모 내용을 입력해주세요.');
      return;
    }
    if (selectedText) {
      const newHighlight = {
        id: Date.now(),
        text: selectedText,
        page: currentPage,
        note: noteContent,
        color: highlightColor,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        type: 'memo',
        tags: [],
      };
      setHighlights(prev => [...prev, newHighlight]);
      setShowNoteDialog(false);
      setNoteContent('');
      setSelectedText(''); // 메모 저장 후 선택된 텍스트 초기화
      setShowQuickActions(false);
    }
  };

  const handleNotePanelSave = (noteData) => {
    const newHighlight = {
      id: noteData.id || `highlight-${Date.now()}`,
      text: noteData.title, // NotePanel의 title이 하이라이트된 텍스트
      page: noteData.page,
      note: noteData.content,
      color: noteData.color,
      createdAt: noteData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: noteData.type,
      tags: noteData.tags,
    };

    setHighlights(prev => {
        const existingIndex = prev.findIndex(h => h.id === newHighlight.id);
        if (existingIndex > -1) {
            const updatedHighlights = [...prev];
            updatedHighlights[existingIndex] = newHighlight;
            return updatedHighlights;
        } else {
            return [...prev, newHighlight];
        }
    });
    
    // NotePanel에서 저장 후 패널을 닫을지는 정책에 따라 결정
    // setIsNotePanelVisible(false); 
    setSelectedText(''); // 저장 후 선택된 텍스트 초기화
  };

  const toggleStudy = () => setIsStudying(!isStudying);
  const toggleNotePanel = () => setIsNotePanelVisible(!isNotePanelVisible);
  
  const renderContent = () => {
    switch (activeView) {
      case 'notes':
        return <NoteBookView notes={allNotes} />;
      case 'progress':
        return <StudyProgressView studyPlan={plan} progress={{ todayTime: studyTimer, percent: 0 }} />;
      case 'content':
      default:
        return (
          <TextbookContentView
            textbookContent={textbookContent}
            highlights={highlights}
            onTextSelect={handleTextSelect}
            onHighlightClick={handleHighlightClick}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isNotePanelVisible={isNotePanelVisible}
            toggleNotePanel={toggleNotePanel}
            allNotes={allNotes}
            selectedText={selectedText}
            shouldOpenEditor={isNotePanelVisible && selectedText && selectedText.length > 0}
            handleNotePanelSave={handleNotePanelSave}
            onEditorOpened={() => {
              // 편집기가 열리고 나면 selectedText를 초기화해서
              // 다음에 패널을 그냥 열 때 편집기가 또 열리는 것을 방지
              setSelectedText('');
            }}
            showQuickActions={showQuickActions}
            selectionPosition={selectionPosition}
            highlightColors={highlightColors}
            handleAddHighlight={handleAddHighlight}
            handleAddNote={handleAddNote}
            handleOpenNotePanel={handleOpenNotePanel}
            setShowQuickActions={setShowQuickActions}
            showNoteDialog={showNoteDialog}
            setShowNoteDialog={setShowNoteDialog}
            noteContent={noteContent}
            setNoteContent={setNoteContent}
            highlightColor={highlightColor}
            setHighlightColor={setHighlightColor}
            handleSaveNote={handleSaveNote}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 mb-0">
        <div className="max-w mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex flex-col min-w-[180px]">
            <h1 className="text-2xl font-bold text-gray-900">{textbookTitle || "원서 학습"}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              <Eye className="w-4 h-4" />
              <span>페이지 {currentPage}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              <span>학습시간: {formatTime(studyTimer)}</span>
              <button
                onClick={toggleStudy}
                className={`px-2 py-1 text-xs rounded ${isStudying ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
              >
                {isStudying ? '정지' : '시작'}
              </button>
            </div>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"><Search className="w-5 h-5" /></button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"><Settings className="w-5 h-5" /></button>
          </div>
        </div>            
      </div>
      <div className='pl-8 pt-8'>
        <Breadcrumb />
      </div>
      {renderContent()}
      {!isNotePanelVisible && activeView === 'content' && (
        <button
          onClick={toggleNotePanel}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
          title="노트 패널 열기"
        >
          <NotebookPen className="w-7 h-7" />
        </button>
      )}
      {showQuickActions && selectionPosition && (
        <div 
          className="fixed z-50 bg-white rounded-xl shadow-lg border border-gray-200 p-2"
          style={{ left: selectionPosition.x, top: selectionPosition.y - 60, transform: 'translateX(-50%)' }}
        >
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {highlightColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleAddHighlight(color.class)}
                  className={`w-6 h-6 rounded ${color.preview} border-2 border-gray-300 hover:border-gray-400 transition-colors`}
                  title={`${color.name} 하이라이트`}
                />
              ))}
            </div>
            <div className="w-px h-6 bg-gray-300" />
            <button onClick={handleAddNote} className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" title="메모 추가">
              <MessageSquare className="w-4 h-4" />
            </button>
            <button onClick={handleOpenNotePanel} className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" title="노트 추가">
              <NotebookPen className="w-4 h-4" />
            </button>
            <button onClick={() => setShowQuickActions(false)} className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {showNoteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">메모 추가</h3>
              <button onClick={() => setShowNoteDialog(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">선택한 텍스트</label>
                <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 border border-gray-200">"{selectedText}"</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">하이라이트 색상</label>
                <div className="flex space-x-2">
                  {highlightColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setHighlightColor(color.class)}
                      className={`w-8 h-8 rounded-lg ${color.preview} border-2 transition-colors ${highlightColor === color.class ? 'border-gray-900' : 'border-gray-300 hover:border-gray-400'}`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="이 부분에 대한 메모를 작성하세요..."
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button onClick={handleSaveNote} className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium">저장</button>
              <button onClick={() => setShowNoteDialog(false)} className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-medium">취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextbookStudyPage;
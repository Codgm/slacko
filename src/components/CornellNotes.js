import { useState } from 'react';
import { Save, Download, Plus, BookOpen, Edit3, Tag, Clock, FileText } from 'lucide-react';

const CornellNotesUI = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({
    id: null,
    title: '',
    date: new Date().toISOString().split('T')[0],
    subject: '',
    chapter: '',
    pageRange: '',
    cues: '',
    notes: '',
    summary: '',
    keywords: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });
  const [isEditing, setIsEditing] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');

  // 노트 저장
  const saveNote = () => {
    if (!currentNote.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    const noteData = {
      ...currentNote,
      id: currentNote.id || Date.now(),
      updatedAt: new Date()
    };

    if (currentNote.id) {
      // 기존 노트 업데이트
      setNotes(prev => prev.map(note => 
        note.id === currentNote.id ? noteData : note
      ));
    } else {
      // 새 노트 추가
      setNotes(prev => [...prev, noteData]);
    }

    setIsEditing(false);
    alert('노트가 저장되었습니다!');
  };

  // 새 노트 시작
  const startNewNote = () => {
    setCurrentNote({
      id: null,
      title: '',
      date: new Date().toISOString().split('T')[0],
      subject: '',
      chapter: '',
      pageRange: '',
      cues: '',
      notes: '',
      summary: '',
      keywords: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    setIsEditing(true);
  };

  // 노트 선택
  const selectNote = (note) => {
    setCurrentNote(note);
    setIsEditing(false);
  };

  // 키워드 추가
  const addKeyword = () => {
    if (keywordInput.trim() && !currentNote.keywords.includes(keywordInput.trim())) {
      setCurrentNote(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  // 키워드 제거
  const removeKeyword = (keyword) => {
    setCurrentNote(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  // PDF 내보내기 (시뮬레이션)
  const exportToPDF = () => {
    alert('PDF 내보내기 기능이 실행됩니다. (실제 구현 시 jsPDF 라이브러리 사용)');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 사이드바 - 노트 목록 */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-blue-600" />
              코넬 노트
            </h1>
            <button
              onClick={startNewNote}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              title="새 노트 작성"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="text-sm text-gray-600">
            총 {notes.length}개 노트
          </div>
        </div>

        <div className="overflow-y-auto max-h-screen">
          {notes.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>작성된 노트가 없습니다.</p>
              <p className="text-sm">새 노트를 작성해보세요!</p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {notes.map(note => (
                <div
                  key={note.id}
                  onClick={() => selectNote(note)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    currentNote.id === note.id 
                      ? 'bg-blue-50 border-blue-200 shadow-md' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                      {note.title}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(note.date).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  
                  {note.subject && (
                    <div className="text-xs text-blue-600 mb-1">
                      📚 {note.subject} {note.chapter && `- ${note.chapter}`}
                    </div>
                  )}
                  
                  {note.pageRange && (
                    <div className="text-xs text-gray-500 mb-2">
                      📖 {note.pageRange}p
                    </div>
                  )}
                  
                  {note.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {note.keywords.slice(0, 3).map((keyword, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          #{keyword}
                        </span>
                      ))}
                      {note.keywords.length > 3 && (
                        <span className="text-xs text-gray-400">+{note.keywords.length - 3}</span>
                      )}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(note.updatedAt).toLocaleString('ko-KR')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 메인 에디터 */}
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="노트 제목을 입력하세요..."
                value={currentNote.title}
                onChange={(e) => setCurrentNote(prev => ({ ...prev, title: e.target.value }))}
                className="text-xl font-semibold bg-transparent border-none outline-none focus:ring-0 placeholder-gray-400"
                readOnly={!isEditing && currentNote.id}
              />
              {!isEditing && currentNote.id && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  title="편집"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {isEditing && (
                <button
                  onClick={saveNote}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  저장
                </button>
              )}
              <button
                onClick={exportToPDF}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                PDF
              </button>
            </div>
          </div>

          {/* 메타데이터 */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
              <input
                type="date"
                value={currentNote.date}
                onChange={(e) => setCurrentNote(prev => ({ ...prev, date: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">과목</label>
              <input
                type="text"
                placeholder="예: 운영체제"
                value={currentNote.subject}
                onChange={(e) => setCurrentNote(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">챕터</label>
              <input
                type="text"
                placeholder="예: Chapter 3"
                value={currentNote.chapter}
                onChange={(e) => setCurrentNote(prev => ({ ...prev, chapter: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">페이지</label>
              <input
                type="text"
                placeholder="예: 45-52"
                value={currentNote.pageRange}
                onChange={(e) => setCurrentNote(prev => ({ ...prev, pageRange: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly={!isEditing}
              />
            </div>
          </div>

          {/* 키워드 */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">키워드</label>
            <div className="flex items-center space-x-2 mb-2">
              {isEditing && (
                <>
                  <input
                    type="text"
                    placeholder="키워드 입력..."
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={addKeyword}
                    className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Tag className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {currentNote.keywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  #{keyword}
                  {isEditing && (
                    <button
                      onClick={() => removeKeyword(keyword)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 코넬 노트 레이아웃 */}
        <div className="flex-1 p-6 bg-gray-50">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex">
            {/* 큐 영역 (왼쪽) */}
            <div className="w-1/3 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-yellow-50">
                <h3 className="font-semibold text-gray-800 text-sm">💡 큐 (Questions/Keywords)</h3>
                <p className="text-xs text-gray-600 mt-1">질문, 키워드, 중요 포인트</p>
              </div>
              <div className="p-4 h-full">
                <textarea
                  value={currentNote.cues}
                  onChange={(e) => setCurrentNote(prev => ({ ...prev, cues: e.target.value }))}
                  placeholder="• 이 개념이 왜 중요한가?&#10;• 핵심 키워드는?&#10;• 다른 개념과의 연관성은?&#10;• 예상 시험 문제는?"
                  className="w-full h-full border-none outline-none resize-none text-sm leading-relaxed focus:ring-0"
                  readOnly={!isEditing}
                />
              </div>
            </div>

            {/* 노트 영역 (오른쪽 상단) */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 border-b border-gray-200">
                <div className="p-4 border-b border-gray-200 bg-blue-50">
                  <h3 className="font-semibold text-gray-800 text-sm">📝 노트 (Main Notes)</h3>
                  <p className="text-xs text-gray-600 mt-1">강의 내용, 중요한 정보, 세부 사항</p>
                </div>
                <div className="p-4 h-full">
                  <textarea
                    value={currentNote.notes}
                    onChange={(e) => setCurrentNote(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="📚 읽은 내용의 핵심 정리&#10;&#10;• 주요 개념과 정의&#10;• 중요한 공식이나 법칙&#10;• 구체적인 예시&#10;• 도표나 그림 설명&#10;• 저자의 주장과 근거&#10;&#10;💡 개인적인 이해와 해석&#10;• 이전 학습과의 연결점&#10;• 궁금한 점이나 의문사항&#10;• 실생활 적용 예시"
                    className="w-full h-full border-none outline-none resize-none text-sm leading-relaxed focus:ring-0"
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              {/* 요약 영역 (오른쪽 하단) */}
              <div className="h-48">
                <div className="p-4 border-b border-gray-200 bg-green-50">
                  <h3 className="font-semibold text-gray-800 text-sm">📋 요약 (Summary)</h3>
                  <p className="text-xs text-gray-600 mt-1">전체 내용의 핵심 요약</p>
                </div>
                <div className="p-4 h-full">
                  <textarea
                    value={currentNote.summary}
                    onChange={(e) => setCurrentNote(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="🎯 오늘 학습한 내용을 3-5문장으로 요약&#10;&#10;• 가장 중요한 핵심 개념은?&#10;• 이 내용이 전체 과목에서 어떤 의미인가?&#10;• 다음 학습과 어떻게 연결되는가?"
                    className="w-full h-full border-none outline-none resize-none text-sm leading-relaxed focus:ring-0"
                    readOnly={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CornellNotesUI;
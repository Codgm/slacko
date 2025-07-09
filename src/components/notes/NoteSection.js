import React from 'react';
import { FileText, Eye, PenTool, Save, Plus, Hash, Brain, Target, ChevronRight } from 'lucide-react';

export default function NoteSection({
  currentNote,
  setCurrentNote,
  noteMode,
  setNoteMode,
  activeNoteTab,
  setActiveNoteTab,
  saveNote: saveNoteProp,
  startNewNote,
  existingNotes,
  setExistingNotes,
  selectedNote,
  setSelectedNote,
  setHoveredNote,
  hoveredNote
}) {
  // 저장 시 필수 입력 체크
  const saveNote = () => {
    if (!currentNote.notes.trim() || !currentNote.summary.trim()) {
      alert('메인 노트와 핵심 요약은 필수 입력입니다.');
      return;
    }
    saveNoteProp();
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
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
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${noteMode === 'view' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <Eye className="w-4 h-4 inline mr-1" />읽기
                  </button>
                  <button
                    onClick={() => setNoteMode('edit')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${noteMode === 'edit' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <PenTool className="w-4 h-4 inline mr-1" />편집
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
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeNoteTab === 'write' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            노트 작성
          </button>
          <button
            onClick={() => setActiveNoteTab('list')}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeNoteTab === 'list' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
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
              // 읽기 모드
              <div className="h-full flex flex-col overflow-y-auto">
                {/* 페이지 정보 & 새 노트 */}
                <div className="p-4 bg-white border-b border-gray-100">
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

                {/* 코넬 노트 레이아웃 */}
                <div className="flex-1 flex flex-col md:flex-row">
                  {/* 큐 영역 */}
                  <div className="md:w-2/5 bg-amber-50 border-r border-amber-100 flex flex-col">
                    <div className="p-4 bg-amber-100 border-b border-amber-200">
                      <h4 className="font-semibold text-amber-800 text-sm flex items-center">
                        <Brain className="w-4 h-4 mr-2" />
                        질문 & 키워드
                      </h4>
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto">
                      <div className="text-sm text-amber-900 leading-relaxed whitespace-pre-wrap">
                        {currentNote.cues || '작성된 내용이 없습니다.'}
                      </div>
                    </div>
                  </div>

                  {/* 노트 영역 */}
                  <div className="flex-1 bg-white flex flex-col">
                    <div className="p-4 bg-blue-50 border-b border-blue-100">
                      <h4 className="font-semibold text-blue-800 text-sm flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        메인 노트
                      </h4>
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto">
                      <div className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
                        {currentNote.notes || '작성된 내용이 없습니다.'}
                      </div>
                    </div>
                  </div>
                </div>
                {/* 핵심 요약: 항상 하단 */}
                <div className="h-40 bg-emerald-50 border-t border-emerald-100 flex flex-col">
                  <div className="p-4 bg-emerald-100 border-b border-emerald-200">
                    <h4 className="font-semibold text-emerald-800 text-sm flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      핵심 요약
                    </h4>
                  </div>
                  <div className="p-4 flex-1 overflow-y-auto">
                    <div className="text-sm text-emerald-900 leading-relaxed">
                      {currentNote.summary || '작성된 내용이 없습니다.'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // 편집 모드
              <div className="flex-1 min-h-0 h-full flex flex-col md:flex-row gap-4">
                {/* 큐 */}
                <div className="md:w-1/3 flex flex-col flex-1 min-h-0 h-full bg-amber-50 border-r border-amber-100">
                  <div className="p-4 bg-amber-100 border-b border-amber-200 shrink-0">
                    <h4 className="font-semibold text-amber-800 text-sm flex items-center">
                      <Brain className="w-4 h-4 mr-2" />
                      질문 & 키워드
                    </h4>
                  </div>
                  <div className="p-4 flex-1 min-h-0 h-full flex flex-col">
                    <textarea
                      value={currentNote.cues}
                      onChange={(e) => setCurrentNote(prev => ({ ...prev, cues: e.target.value }))}
                      placeholder="• PCB란 무엇인가?\n• 왜 필요한가?\n• 주요 구성요소는?"
                      className="w-full h-full min-h-0 border-none outline-none resize-none text-sm bg-transparent leading-relaxed placeholder-amber-500 text-amber-900"
                    />
                  </div>
                </div>

                {/* 메인 노트 */}
                <div className="md:w-1/3 flex flex-col flex-1 min-h-0 h-full bg-white border-r border-gray-100">
                  <div className="p-4 bg-blue-50 border-b border-blue-100 shrink-0">
                    <h4 className="font-semibold text-blue-800 text-sm flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      메인 노트
                    </h4>
                  </div>
                  <div className="p-4 flex-1 min-h-0 h-full flex flex-col">
                    <textarea
                      value={currentNote.notes}
                      onChange={(e) => setCurrentNote(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="핵심 내용을 자유롭게 정리하세요"
                      className="w-full h-full min-h-0 border-none outline-none resize-none text-sm leading-relaxed text-gray-900"
                    />
                  </div>
                </div>

                {/* 요약 */}
                <div className="md:w-1/3 flex flex-col flex-1 min-h-0 h-full bg-emerald-50">
                  <div className="p-4 bg-emerald-100 border-b border-emerald-200 shrink-0">
                    <h4 className="font-semibold text-emerald-800 text-sm flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      핵심 요약
                    </h4>
                  </div>
                  <div className="p-4 flex-1 min-h-0 h-full flex flex-col">
                    <textarea
                      value={currentNote.summary}
                      onChange={(e) => setCurrentNote(prev => ({ ...prev, summary: e.target.value }))}
                      placeholder="학습한 내용을 한 문장으로 요약해보세요"
                      className="w-full h-full min-h-0 border-none outline-none resize-none text-sm bg-transparent leading-relaxed placeholder-emerald-500 text-emerald-900"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-6 md:p-10 bg-gradient-to-br from-white via-blue-50 to-emerald-50 rounded-b-2xl scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
            <div className="space-y-4 max-w-3xl mx-auto">
              {existingNotes.filter(note => note.chapter === 'Chapter 3').map(note => (
                <div key={note.id} className="relative group">
                  <div
                    className="bg-white rounded-2xl border border-gray-200 p-5 cursor-pointer transition-all hover:border-blue-400 hover:shadow-xl shadow-md flex flex-col gap-2 group-hover:scale-[1.01] group-hover:bg-blue-50/30 duration-200"
                    onMouseEnter={() => setHoveredNote(note.id)}
                    onMouseLeave={() => setHoveredNote(null)}
                    onClick={() => setSelectedNote(selectedNote?.id === note.id ? null : note)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold shadow-sm">
                            {note.pageRange}p
                          </span>
                          <span className="text-xs text-gray-400">{note.date}</span>
                        </div>
                        <h5 className="font-semibold text-gray-900 truncate text-lg">{note.title}</h5>
                        <p className="text-sm text-gray-600 truncate mt-1">{note.summary}</p>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${selectedNote?.id === note.id ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                  {/* 호버 미리보기 */}
                  {hoveredNote === note.id && selectedNote?.id !== note.id && (
                    <div className="absolute left-full top-0 ml-4 w-80 bg-white rounded-2xl shadow-2xl border border-blue-100 p-5 z-10 animate-fade-in">
                      <div className="space-y-3">
                        <div className="border-l-4 border-amber-400 pl-3">
                          <h6 className="text-sm font-semibold text-amber-800">질문 & 키워드</h6>
                          <p className="text-sm text-gray-700 mt-1 line-clamp-2">{note.content.cues}</p>
                        </div>
                        <div className="border-l-4 border-blue-400 pl-3">
                          <h6 className="text-sm font-semibold text-blue-800">메인 노트</h6>
                          <p className="text-sm text-gray-700 mt-1 line-clamp-3">{note.content.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* 확장된 미리보기 */}
                  {selectedNote?.id === note.id && (
                    <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border-t border-blue-100 p-5 space-y-4 rounded-b-2xl shadow-inner mt-2">
                      <div className="bg-white rounded-lg p-4 border-l-4 border-amber-400 shadow-sm">
                        <h6 className="text-sm font-semibold text-amber-800 mb-2">질문 & 키워드</h6>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content.cues}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border-l-4 border-blue-400 shadow-sm">
                        <h6 className="text-sm font-semibold text-blue-800 mb-2">메인 노트</h6>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content.notes}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border-l-4 border-emerald-400 shadow-sm">
                        <h6 className="text-sm font-semibold text-emerald-800 mb-2">핵심 요약</h6>
                        <p className="text-sm text-gray-700">{note.content.summary}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {existingNotes.filter(note => note.chapter === 'Chapter 3').length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <FileText className="w-14 h-14 mx-auto mb-4 text-blue-100" />
                  <p className="text-lg font-semibold">아직 작성된 노트가 없습니다.</p>
                  <button
                    onClick={startNewNote}
                    className="text-blue-600 hover:text-blue-700 text-base font-semibold mt-4 px-6 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all shadow-sm"
                  >
                    첫 번째 노트 작성하기
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
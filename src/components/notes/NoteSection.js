import React from 'react';
import Button from '../common/Button';
import { FileText, Eye, PenTool, Save, Plus, Hash, Brain, Target, ChevronRight } from 'lucide-react';

export default function NoteSection({
  currentNote,
  setCurrentNote,
  noteMode,
  setNoteMode,
  activeNoteTab,
  setActiveNoteTab,
  saveNote,
  startNewNote,
  existingNotes,
  setExistingNotes,
  selectedNote,
  setSelectedNote,
  setHoveredNote,
  hoveredNote
}) {
  return (
    <div className="h-full flex flex-col">
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
                  <Button
                    onClick={() => setNoteMode('view')}
                    variant={noteMode === 'view' ? 'primary' : 'ghost'}
                    size="sm"
                    className="px-3 py-1 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    읽기
                  </Button>
                  <Button
                    onClick={() => setNoteMode('edit')}
                    variant={noteMode === 'edit' ? 'primary' : 'ghost'}
                    size="sm"
                    className="px-3 py-1 text-sm font-medium"
                  >
                    <PenTool className="w-4 h-4 inline mr-1" />
                    편집
                  </Button>
                </div>
                {noteMode === 'edit' && (
                  <Button
                    onClick={saveNote}
                    variant="primary"
                    className="flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>저장</span>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex border-b border-gray-100">
          <Button
            onClick={() => setActiveNoteTab('write')}
            variant={activeNoteTab === 'write' ? 'primary' : 'ghost'}
            size="sm"
            className="px-5 py-3 text-sm font-medium border-b-2 border-transparent"
          >
            노트 작성
          </Button>
          <Button
            onClick={() => setActiveNoteTab('list')}
            variant={activeNoteTab === 'list' ? 'primary' : 'ghost'}
            size="sm"
            className="px-5 py-3 text-sm font-medium border-b-2 border-transparent"
          >
            노트 목록 ({existingNotes.filter(note => note.chapter === 'Chapter 3').length})
          </Button>
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
                    <Button
                      onClick={startNewNote}
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>새 노트</span>
                    </Button>
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
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    🤖 AI 추천 키워드: PCB, Context Switching, 프로세스 상태
                  </span>
                  <Button variant="ghost" size="sm" className="text-xs text-emerald-600 hover:underline">
                    복습 알림 설정
                  </Button>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  <span>🤖 AI 추천(참고용): </span>
                  <span>이 키워드는 AI가 자동으로 제안한 내용입니다.</span>
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
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    🤖 AI 추천 키워드: PCB, Context Switching, 프로세스 상태
                  </span>
                  <button className="text-xs text-emerald-600 hover:underline">
                    복습 알림 설정
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  <span>🤖 AI 추천(참고용): </span>
                  <span>이 키워드는 AI가 자동으로 제안한 내용입니다.</span>
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
  );
} 
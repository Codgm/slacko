import React from 'react';
import { BookOpen, Target, BookmarkIcon, PenTool, ChevronLeft, ChevronRight, NotebookPen, MessageSquare, X } from 'lucide-react';
import HighlightableText from '../common/HighlightableText';
import NotePanel from '../notes/NotePanel';

const TextbookContentView = ({
  textbookContent,
  highlights,
  onTextSelect,
  onHighlightClick,
  currentPage,
  setCurrentPage,
  isNotePanelVisible,
  toggleNotePanel,
  allNotes,
  selectedText,
  shouldOpenEditor,
  handleNotePanelSave,
  onEditorOpened,
  showQuickActions,
  selectionPosition,
  highlightColors,
  handleAddHighlight,
  handleAddNote,
  handleOpenNotePanel,
  setShowQuickActions,
  showNoteDialog,
  setShowNoteDialog,
  noteContent,
  setNoteContent,
  highlightColor,
  setHighlightColor,
  handleSaveNote
}) => {
  return (
    <>
      {/* 원서 본문/노트패널 영역 */}
      <div className={`transition-all duration-300 ${isNotePanelVisible ? 'w-3/5' : 'w-full'} p-8`}>
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* 챕터 헤더 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">Chapter 3: Process Management</h1>
                  <p className="text-lg text-gray-600 mb-4">Process Control Block과 Context Switching</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>페이지 95-102</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Target className="w-4 h-4" />
                      <span>예상 학습시간 25분</span>
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                    <BookmarkIcon className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                    <PenTool className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
            {/* 본문 내용 */}
            <div className="p-8">
              <div className="prose prose-lg max-w-none">
                <HighlightableText
                  text={textbookContent}
                  highlights={highlights}
                  onTextSelect={onTextSelect}
                  onHighlightClick={onHighlightClick}
                />
              </div>
            </div>
            {/* 페이지 네비게이션 */}
            <div className="flex items-center justify-between p-8 pt-6 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="flex items-center space-x-3 px-6 py-3 bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl border border-gray-200 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">이전 페이지</span>
              </button>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  페이지 {currentPage} of 400
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 rounded-full h-2" style={{width: `${(currentPage/400)*100}%`}}></div>
                </div>
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(400, prev + 1))}
                className="flex items-center space-x-3 px-6 py-3 bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl border border-gray-200 transition-all"
              >
                <span className="font-medium">다음 페이지</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* 노트 패널 */}
      <NotePanel
        isVisible={isNotePanelVisible}
        onToggle={toggleNotePanel}
        notes={allNotes}
        selectedText={selectedText}
        currentPage={currentPage}
        shouldOpenEditor={isNotePanelVisible && selectedText && selectedText.length > 0}
        onEditorOpened={onEditorOpened}
        onNoteSave={handleNotePanelSave}
      />

      {/* 플로팅 노트 패널 토글 버튼 (오른쪽 하단) */}
      {!isNotePanelVisible && (
        <button
          onClick={toggleNotePanel}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
          title="노트 패널 열기"
        >
          <NotebookPen className="w-7 h-7" />
        </button>
      )}
      {/* 빠른 액션 툴팁 */}
      {showQuickActions && selectionPosition && (
        <div 
          className="fixed z-50 bg-white rounded-xl shadow-lg border border-gray-200 p-2"
          style={{
            left: selectionPosition.x,
            top: selectionPosition.y - 60,
            transform: 'translateX(-50%)'
          }}
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
            <button
              onClick={handleAddNote}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="메모 추가"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={handleOpenNotePanel}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="노트 추가"
            >
              <NotebookPen className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowQuickActions(false)}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {/* 메모 추가 모달 */}
      {showNoteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">메모 추가</h3>
              <button
                onClick={() => setShowNoteDialog(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">선택한 텍스트</label>
                <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 border border-gray-200">
                  "{selectedText}"
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">하이라이트 색상</label>
                <div className="flex space-x-2">
                  {highlightColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setHighlightColor(color.class)}
                      className={`w-8 h-8 rounded-lg ${color.preview} border-2 transition-colors ${
                        highlightColor === color.class ? 'border-gray-900' : 'border-gray-300 hover:border-gray-400'
                      }`}
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
              <button
                onClick={handleSaveNote}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                저장
              </button>
              <button
                onClick={() => setShowNoteDialog(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-medium"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TextbookContentView; 
import { useState } from 'react';
import { ArrowLeft, BookOpen, Target, FileText, Settings, X, Brain } from 'lucide-react';
import CornellNotesUI from '../components/CornellNotes';
import StudyPlanComponent from '../components/StudyPlanComponent';
import ConceptStudyComponent from '../components/ConceptStudyComponent';

const TextbookDetailPage = () => {
  const [activeTab, setActiveTab] = useState('concept');
  const [showCornellEditor, setShowCornellEditor] = useState(false);
  const [showConceptModal, setShowConceptModal] = useState(false);
  const [currentCornellNote, setCurrentCornellNote] = useState({
    title: '',
    pageRange: '',
    overview: '',
    questions: [''],
    summary: '',
    keyPoints: ''
  });

  // 샘플 원서 데이터
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
              <h4 className="font-medium text-gray-900 mb-3">복습 필요 항목</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <span className="text-sm">Memory Management</span>
                  <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">복습 필요</span>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <span className="text-sm">Virtual Memory</span>
                  <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">재복습</span>
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
            <CornellNotesUI/>
        );
      default:
        return null;
    }
  };

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
            {/* 책 표지 */}
            <div className="flex-shrink-0">
              <img
                src={textbook.coverImage}
                alt={textbook.title}
                className="w-32 h-40 object-cover rounded-lg shadow-md"
              />
            </div>
            {/* 책 정보 */}
            <div className="flex-1">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{textbook.title}</h2>
                <p className="text-gray-600 mb-1">저자: {textbook.author}</p>
                <p className="text-gray-600 mb-1">출판사: {textbook.publisher}</p>
                <p className="text-gray-600">총 {textbook.totalPages}페이지</p>
              </div>
              {/* 진도율 표시 */}
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
              {/* 통계 정보 */}
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

      {/* 코넬식 노트 작성 모달 */}
      {showCornellEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">코넬식 노트 작성</h3>
                  <p className="text-sm text-gray-600">체계적인 학습 노트를 작성해보세요</p>
                </div>
                <button
                  onClick={() => setShowCornellEditor(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="flex h-full">
              {/* 좌측: 질문/키워드 작성 영역 */}
              <div className="w-1/3 bg-yellow-50 p-6 border-r border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Brain className="w-4 h-4 mr-2" />
                  질문 & 키워드 영역
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">핵심 질문들</label>
                    <div className="space-y-2">
                      {currentCornellNote.questions.map((question, index) => (
                        <div key={index} className="relative">
                          <textarea
                            className="w-full p-3 border border-yellow-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            rows="2"
                            value={question}
                            onChange={(e) => {
                              const newQuestions = [...currentCornellNote.questions];
                              newQuestions[index] = e.target.value;
                              setCurrentCornellNote({...currentCornellNote, questions: newQuestions});
                            }}
                            placeholder="질문을 입력하세요..."
                          />
                          {currentCornellNote.questions.length > 1 && (
                            <button
                              onClick={() => {
                                const newQuestions = currentCornellNote.questions.filter((_, i) => i !== index);
                                setCurrentCornellNote({...currentCornellNote, questions: newQuestions});
                              }}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          setCurrentCornellNote({
                            ...currentCornellNote, 
                            questions: [...currentCornellNote.questions, '']
                          });
                        }}
                        className="w-full p-2 border-2 border-dashed border-yellow-300 rounded-lg text-yellow-600 hover:border-yellow-400 hover:text-yellow-700 text-sm"
                      >
                        + 질문 추가
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">핵심 키워드</label>
                    <textarea
                      className="w-full p-3 border border-yellow-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      rows="3"
                      value={currentCornellNote.keyPoints}
                      onChange={(e) => setCurrentCornellNote({...currentCornellNote, keyPoints: e.target.value})}
                      placeholder="중요한 키워드들을 입력하세요..."
                    />
                  </div>
                </div>
              </div>
              {/* 우측: 노트 내용 작성 영역 */}
              <div className="flex-1 p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  노트 내용 영역
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">개념명</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={currentCornellNote.title}
                        onChange={(e) => setCurrentCornellNote({...currentCornellNote, title: e.target.value})}
                        placeholder="개념명을 입력하세요"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">페이지 범위</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={currentCornellNote.pageRange}
                        onChange={(e) => setCurrentCornellNote({...currentCornellNote, pageRange: e.target.value})}
                        placeholder="예: p.95-97"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">개요 및 상세 내용</label>
                    <textarea
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="12"
                      value={currentCornellNote.overview}
                      onChange={(e) => setCurrentCornellNote({...currentCornellNote, overview: e.target.value})}
                      placeholder="개념의 상세한 설명을 작성하세요..."
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* 하단: 요약 영역 */}
            <div className="bg-blue-50 p-6 border-t border-gray-200">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                핵심 요약
              </h4>
              <textarea
                className="w-full text-sm text-blue-800 bg-white p-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                value={currentCornellNote.summary}
                onChange={(e) => setCurrentCornellNote({...currentCornellNote, summary: e.target.value})}
                placeholder="핵심 내용을 한줄로 요약하세요..."
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowCornellEditor(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    setShowCornellEditor(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  저장하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 개념 등록 모달 */}
      {showConceptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">새 개념 등록</h3>
              <p className="text-sm text-gray-600">새로운 개념을 체계적으로 정리해보세요</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">개념명 *</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: Process Control Block"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">정의 *</label>
                <textarea
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="개념의 정확한 정의를 입력하세요"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: Process Management"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">페이지 참조</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: p.95-97"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">태그 (쉼표로 구분)</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: OS, Process, Data Structure"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">예시 코드</label>
                <textarea
                  rows="6"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="관련 코드 예시를 입력하세요"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowConceptModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => setShowConceptModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                등록하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 하단 여백 (탭 네비게이션 공간 확보) */}
      <div className="h-20"></div>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default TextbookDetailPage;

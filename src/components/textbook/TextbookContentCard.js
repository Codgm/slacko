import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TextbookContentCard({ title, content, page, onPrev, onNext, onTextSelect, onAddNote }) {
  return (
    <div className="w-full bg-white/90 backdrop-blur-sm border-b md:border-b-0 md:border-r border-gray-200 flex flex-col transition-all duration-300">
      {/* 페이지 네비게이션 */}
      <div className="border-b border-gray-100 p-6 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button 
            onClick={onPrev}
            className="flex items-center space-x-2 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
            aria-label="이전 페이지"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-medium">이전</span>
          </button>
          <div className="flex items-center space-x-4">
            <span className="font-bold text-gray-900 px-6 py-3 bg-white rounded-xl border border-gray-200 shadow-lg">
              📄 페이지 {page}
            </span>
            <div className="text-sm text-gray-500">
              Chapter 3 • Process Control Block
            </div>
          </div>
          <button 
            onClick={onNext}
            className="flex items-center space-x-2 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
            aria-label="다음 페이지"
          >
            <span className="font-medium">다음</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* 교재 본문 */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {/* 챕터 헤더 */}
            <div className="mb-8 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                  <p className="text-gray-600 mt-1">Process Control Block의 핵심 개념</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  🔑 핵심 개념
                </span>
                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  📚 기초 지식
                </span>
              </div>
            </div>
            
            {/* 본문 내용 */}
            <div
              className="prose prose-lg max-w-none selection:bg-blue-100 selection:text-blue-900"
              onMouseUp={() => {
                if (!onTextSelect) return;
                const selection = window.getSelection();
                const text = selection ? selection.toString() : '';
                if (text) onTextSelect(text);
              }}
            >
              {content.split('\n').map((paragraph, index) => {
                if (paragraph.trim() === '') return <br key={index} />;
                
                // 제목 스타일
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <h3 key={index} className="text-2xl font-bold text-gray-900 mt-10 mb-6 flex items-center">
                      <span className="w-2 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mr-4"></span>
                      {paragraph.slice(2, -2)}
                    </h3>
                  );
                }
                
                // 리스트 스타일
                if (paragraph.trim().startsWith('- ')) {
                  return (
                    <div key={index} className="flex items-start mb-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed text-lg">{paragraph.slice(2)}</p>
                    </div>
                  );
                }
                
                // 번호 리스트
                if (paragraph.trim().match(/^\d+\./)) {
                  return (
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6 border-l-4 border-blue-500">
                      <p className="font-bold text-gray-900 text-lg">{paragraph}</p>
                    </div>
                  );
                }
                
                // 일반 문단
                return (
                  <p key={index} className="mb-6 text-gray-700 leading-relaxed text-lg">
                    {paragraph}
                  </p>
                );
              })}
            </div>
            {/* 노트에 추가 버튼 */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={onAddNote}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition-all duration-200"
              >
                📝 노트에 추가
              </button>
            </div>
            {/* 페이지 하단 정보 */}
            <div className="mt-12 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>📖 학습 진행률: 30%</span>
                <span>⏱️ 예상 읽기 시간: 15분</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
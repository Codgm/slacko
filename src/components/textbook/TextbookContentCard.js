import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TextbookContentCard({ title, content, page, onPrev, onNext, onTextSelect }) {
  return (
    <div className="w-full bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col transition-all duration-300">
      {/* 페이지 네비게이션 */}
      <div className="border-b border-gray-100 p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <button 
            onClick={onPrev}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="이전 페이지"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>이전</span>
          </button>
          <span className="font-medium text-gray-900 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">페이지 {page}</span>
          <button 
            onClick={onNext}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="다음 페이지"
          >
            <span>다음</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* 교재 본문 */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
          <div
            className="prose prose-lg max-w-none"
            onMouseUp={() => {
              if (!onTextSelect) return;
              const selection = window.getSelection();
              const text = selection ? selection.toString() : '';
              if (text) onTextSelect(text);
            }}
          >
            {content.split('\n').map((paragraph, index) => {
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
  );
} 
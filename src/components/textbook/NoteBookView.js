import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, BookOpen, Target, TrendingUp, Tag, Calendar } from 'lucide-react';

const NoteBookView = ({ notes }) => {
  const [page, setPage] = useState(0);
  
  // 예시 데이터
  const defaultNotes = [
    {
      id: 1,
      title: "JavaScript 변수와 스코프",
      content: `var, let, const의 차이점을 명확히 이해하자.

- var: 함수 스코프, 호이스팅 발생
- let: 블록 스코프, 호이스팅 발생하지만 초기화 전까지 접근 불가
- const: 블록 스코프, 재할당 불가능

실제 프로젝트에서는 const를 기본으로 사용하고, 재할당이 필요한 경우만 let을 사용하는 것이 좋다.`,
      page: 15,
      color: "blue",
      tags: ["JavaScript", "기초", "변수"],
      date: "2024-07-20"
    },
    {
      id: 2,
      title: "React Hook 사용 패턴",
      content: `useState와 useEffect의 효율적 사용법

1. useState는 관련된 상태들을 객체로 묶어서 관리
2. useEffect는 의존성 배열을 정확히 설정
3. 커스텀 훅으로 로직을 재사용 가능하게 만들기

성능 최적화를 위해 useMemo, useCallback도 적절히 활용하자.`,
      page: 87,
      color: "green",
      tags: ["React", "Hook", "최적화"],
      date: "2024-07-19"
    },
    {
      id: 3,
      title: "비동기 처리 패턴 정리",
      content: `Promise와 async/await의 차이점

Promise 체이닝:
- .then(), .catch(), .finally() 사용
- 콜백 지옥 문제 해결

async/await:
- 동기 코드처럼 작성 가능
- try-catch로 에러 처리
- Promise보다 직관적

실무에서는 async/await를 주로 사용하되, Promise.all() 같은 유틸리티는 적절히 활용하자.`,
      page: 142,
      color: "purple",
      tags: ["JavaScript", "비동기", "Promise"],
      date: "2024-07-18"
    }
  ];

  const noteData = notes || defaultNotes;
  
  if (!noteData || noteData.length === 0) {
    return (
      <div className="max-w mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">아직 작성된 노트가 없습니다</h3>
          <p className="text-gray-500">학습하면서 중요한 내용들을 노트로 정리해보세요!</p>
        </div>
      </div>
    );
  }

  const note = noteData[page];
  const colorMap = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', accent: 'text-blue-600' },
    green: { bg: 'bg-green-50', border: 'border-green-200', accent: 'text-green-600' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', accent: 'text-purple-600' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', accent: 'text-orange-600' },
    red: { bg: 'bg-red-50', border: 'border-red-200', accent: 'text-red-600' }
  };
  
  const currentColor = colorMap[note.color] || colorMap.blue;

  return (
    <div className="max-w p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gray-50 border-b border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">{page + 1} / {noteData.length}</div>
                <div className="text-xs text-gray-500">학습 노트</div>
              </div>
              
              <button
                onClick={() => setPage(p => Math.min(noteData.length - 1, p + 1))}
                disabled={page === noteData.length - 1}
                className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{note.date}</span>
            </div>
          </div>
        </div>

        {/* 노트 내용 */}
        <div className="p-8">
          <div className={`${currentColor.bg} ${currentColor.border} rounded-xl p-6 border-l-4`}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 leading-tight">{note.title}</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                <BookOpen className="w-3 h-3" />
                <span>p.{note.page}</span>
              </div>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {note.content}
              </div>
            </div>
            
            {note.tags && note.tags.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">태그</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className={`px-3 py-1 ${currentColor.bg} ${currentColor.accent} rounded-full text-sm font-medium border ${currentColor.border}`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 페이지 인디케이터 */}
          <div className="flex justify-center mt-6 space-x-2">
            {noteData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === page ? 'bg-indigo-500' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteBookView; 
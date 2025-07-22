import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Tag, Calendar } from 'lucide-react';

const NoteBookView = ({ notes }) => {
  const [page, setPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  
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
  
  const handlePageChange = (newPage) => {
    if (newPage === page || isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setPage(newPage);
      setTimeout(() => setIsFlipping(false), 300);
    }, 150);
  };
  
  if (!noteData || noteData.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="relative">
          {/* 노트북 커버 */}
          <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-lg shadow-2xl border border-amber-200 p-12 text-center transform rotate-1">
            <div className="absolute top-4 left-8">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            </div>
            <div className="absolute top-4 left-14">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            </div>
            <div className="absolute top-4 left-20">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            </div>
            
            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-amber-800 mb-3" style={{fontFamily: 'cursive'}}>
              My Learning Notebook
            </h3>
            <p className="text-amber-600" style={{fontFamily: 'cursive'}}>
              아직 작성된 노트가 없습니다<br/>
              학습하면서 중요한 내용들을 노트로 정리해보세요!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const note = noteData[page];
  const colorMap = {
    blue: { 
      accent: '#3b82f6', 
      light: '#dbeafe', 
      highlight: '#93c5fd',
      ink: '#1e40af'
    },
    green: { 
      accent: '#10b981', 
      light: '#d1fae5', 
      highlight: '#6ee7b7',
      ink: '#047857'
    },
    purple: { 
      accent: '#8b5cf6', 
      light: '#ede9fe', 
      highlight: '#c4b5fd',
      ink: '#6d28d9'
    },
    orange: { 
      accent: '#f59e0b', 
      light: '#fed7aa', 
      highlight: '#fdba74',
      ink: '#d97706'
    },
    red: { 
      accent: '#ef4444', 
      light: '#fecaca', 
      highlight: '#f87171',
      ink: '#dc2626'
    }
  };
  
  const currentColor = colorMap[note.color] || colorMap.blue;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Permanent+Marker&display=swap');
        
        .notebook-paper {
          background-image: 
            linear-gradient(to right, #f8f9fa 20px, transparent 20px),
            repeating-linear-gradient(
              transparent,
              transparent 30px,
              #e2e8f0 30px,
              #e2e8f0 32px
            );
          background-size: 100% 32px;
        }
        
        .handwritten {
          font-family: 'Kalam', cursive;
          line-height: 2.2;
        }
        
        .title-handwritten {
          font-family: 'Permanent Marker', cursive;
        }
        
        .page-flip {
          transform-style: preserve-3d;
          transition: transform 0.6s ease-in-out;
        }
        
        .page-flip.flipping {
          transform: rotateY(-15deg);
        }
        
        .paper-shadow {
          box-shadow: 
            0 1px 3px rgba(0, 0, 0, 0.1),
            0 4px 6px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        
        .hole-punch {
          position: absolute;
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 50%;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .hole-punch:nth-child(2) { top: 30%; }
        .hole-punch:nth-child(3) { top: 70%; }
        
        .highlight-marker {
          background: linear-gradient(120deg, transparent 0%, ${currentColor.highlight}40 10%, ${currentColor.highlight}80 50%, ${currentColor.highlight}40 90%, transparent 100%);
          padding: 2px 4px;
          margin: 0 -4px;
          transform: rotate(-0.5deg);
          display: inline-block;
        }
        
        .underline-wavy {
          background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            ${currentColor.accent} 2px,
            ${currentColor.accent} 4px
          );
          background-size: 8px 3px;
          background-repeat: repeat-x;
          background-position: 0 100%;
          padding-bottom: 4px;
        }
      `}</style>

      <div className="relative">
        
        {/* 메인 노트북 */}
        <div className={`bg-white rounded-lg shadow-2xl overflow-hidden transform transition-all duration-300 ${isFlipping ? 'page-flip flipping' : 'page-flip'} hover:shadow-3xl`}>
          {/* 구멍 */}
          <div className="hole-punch"></div>
          <div className="hole-punch"></div>
          <div className="hole-punch"></div>
          
          {/* 헤더 - 노트북 상단 */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handlePageChange(Math.max(0, page - 1))}
                  disabled={page === 0 || isFlipping}
                  className="p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                  style={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)' }}
                >
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-slate-700 handwritten">
                    Page {page + 1} of {noteData.length}
                  </div>
                  <div className="text-sm text-slate-500 handwritten">Learning Notes</div>
                </div>
                
                <button
                  onClick={() => handlePageChange(Math.min(noteData.length - 1, page + 1))}
                  disabled={page === noteData.length - 1 || isFlipping}
                  className="p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                  style={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)' }}
                >
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600 handwritten">{note.date}</span>
              </div>
            </div>
          </div>

          {/* 노트 페이지 */}
          <div className="notebook-paper min-h-[600px] p-8 pl-12">
            {/* 제목 영역 */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 
                  className="text-3xl font-bold title-handwritten transform -rotate-1"
                  style={{ color: currentColor.ink }}
                >
                  <span className="highlight-marker">{note.title}</span>
                </h1>
                <div 
                  className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border transform rotate-1"
                  style={{ borderColor: currentColor.accent }}
                >
                  <BookOpen className="w-4 h-4" style={{ color: currentColor.accent }} />
                  <span className="text-sm font-bold handwritten" style={{ color: currentColor.ink }}>
                    p.{note.page}
                  </span>
                </div>
              </div>
              
              {/* 구분선 - 손으로 그은 듯한 */}
              <div 
                className="h-1 rounded-full transform -rotate-1"
                style={{ 
                  background: `linear-gradient(90deg, transparent 0%, ${currentColor.accent} 10%, ${currentColor.accent} 90%, transparent 100%)`,
                  filter: 'blur(0.5px)'
                }}
              ></div>
            </div>
            
            {/* 내용 영역 */}
            <div className="mb-8">
              <div 
                className="handwritten text-lg leading-relaxed whitespace-pre-line"
                style={{ color: '#374151' }}
              >
                {note.content.split('\n').map((line, idx) => {
                  if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
                    return (
                      <div key={idx} className="flex items-start ml-8 mb-2">
                        <span 
                          className="text-2xl mr-3 transform -rotate-12"
                          style={{ color: currentColor.accent }}
                        >
                          ✓
                        </span>
                        <span>{line.replace(/^[-•]\s*/, '')}</span>
                      </div>
                    );
                  } else if (line.match(/^\d+\./)) {
                    return (
                      <div key={idx} className="flex items-start ml-8 mb-2">
                        <span 
                          className="font-bold mr-3 px-2 py-1 rounded-full text-sm"
                          style={{ 
                            backgroundColor: currentColor.light,
                            color: currentColor.ink 
                          }}
                        >
                          {line.match(/^\d+/)[0]}
                        </span>
                        <span>{line.replace(/^\d+\.\s*/, '')}</span>
                      </div>
                    );
                  } else if (line.trim() && !line.includes(':')) {
                    // 중요한 문장에 밑줄 효과
                    const isImportant = line.length > 30;
                    return (
                      <p key={idx} className={`mb-3 ${isImportant ? 'underline-wavy font-semibold' : ''}`}>
                        {line}
                      </p>
                    );
                  }
                  return <p key={idx} className="mb-3">{line}</p>;
                })}
              </div>
            </div>
            
            {/* 태그 영역 */}
            {note.tags && note.tags.length > 0 && (
              <div className="border-t-2 border-dashed border-slate-300 pt-6 mt-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Tag className="w-5 h-5 text-slate-400 transform rotate-12" />
                  <span className="text-lg font-bold handwritten text-slate-600">Tags</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {note.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-4 py-2 rounded-full text-sm font-bold handwritten shadow-sm transform hover:scale-105 transition-transform cursor-default border-2"
                      style={{ 
                        backgroundColor: currentColor.light,
                        color: currentColor.ink,
                        borderColor: currentColor.accent,
                        transform: `rotate(${(idx % 2 === 0 ? 1 : -1) * 2}deg)`
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* 페이지 하단 - 낙서 영역 */}
            <div className="mt-12 pt-6 border-t border-dashed border-slate-300">
              <div className="flex justify-between items-center opacity-60">
                <div 
                  className="text-xs handwritten transform rotate-2"
                  style={{ color: currentColor.accent }}
                >
                  ★ Keep Learning! ★
                </div>
                <div 
                  className="text-xs handwritten transform -rotate-1"
                  style={{ color: currentColor.accent }}
                >
                  {note.date}
                </div>
              </div>
            </div>
          </div>
          
          {/* 하단 페이지 인디케이터 */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 p-4">
            <div className="flex justify-center space-x-3">
              {noteData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx)}
                  disabled={isFlipping}
                  className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                    idx === page 
                      ? 'shadow-lg transform scale-110' 
                      : 'hover:opacity-80'
                  }`}
                  style={{ 
                    backgroundColor: idx === page ? currentColor.accent : '#cbd5e1'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* 노트북 그림자 */}
        <div className="absolute -bottom-4 -right-4 w-full h-full bg-slate-200/30 rounded-lg -z-10 transform rotate-1"></div>
      </div>
    </div>
  );
};

export default NoteBookView;
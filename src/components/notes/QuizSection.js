import React from 'react';
import { Brain } from 'lucide-react';

export default function QuizSection({ quizList, wrongNotes }) {
  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4">📝 자동 퀴즈</h3>
        <p className="text-gray-700 mb-4">AI가 자동으로 생성한 퀴즈로 복습해보세요!</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-800">
          {quizList.map((q, i) => <li key={i}>{q}</li>)}
        </ul>
        <div className="mt-4 text-xs text-gray-400">
          🤖 AI가 자동으로 생성한 문제입니다. 실제 시험과 다를 수 있습니다.
        </div>
        {/* 오답노트/복습 필요 UI */}
        <div className="mt-6">
          <h4 className="text-sm font-bold text-red-700 mb-2">오답노트</h4>
          <ul className="list-disc pl-5 text-sm text-red-800">
            {wrongNotes.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
          <div className="mt-2 text-xs text-gray-500">
            복습 필요: {wrongNotes.length}개
          </div>
        </div>
      </div>
    </div>
  );
} 
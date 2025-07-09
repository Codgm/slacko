import React from 'react';

export default function ChapterPreview({ objectives, aiSummary, keywords }) {
  return (
    <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-300 rounded">
      <h3 className="text-sm font-bold text-yellow-800 mb-2">이 챕터에서 배울 것</h3>
      <ul className="list-disc pl-5 text-sm text-yellow-900">
        {objectives.map((obj, i) => <li key={i}>{obj}</li>)}
      </ul>
      <div className="mt-2 text-xs text-gray-500">🤖 AI 요약: {aiSummary}</div>
      <div className="mt-2 text-xs text-blue-700">주요 용어: {keywords.join(', ')}</div>
    </div>
  );
} 
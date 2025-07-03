import React from 'react';

export default function ProgressBar({ current, total, percent, goal, goalRate, remain, goalMessage }) {
  // percent, goal, goalRate, remain, goalMessage가 없으면 기존 방식대로 계산
  const progressPercent = percent !== undefined ? percent : Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">학습 진도</span>
        <span className="text-sm text-gray-600">
          {current} / {total} 페이지 ({progressPercent}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
      </div>
      {goal && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-green-600 font-semibold">
            이번 주 목표: {goal}페이지 (달성률 {goalRate}%)
          </span>
          <span className="text-xs text-blue-500 font-semibold">
            목표 달성까지 {remain}페이지 남음! {goalMessage}
          </span>
        </div>
      )}
    </div>
  );
} 
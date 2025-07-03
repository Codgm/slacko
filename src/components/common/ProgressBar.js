import React from 'react';

export default function ProgressBar({ current, total, percent, goal = 0, goalRate = 0, remain = 0, goalMessage = '' }) {
  const progressPercentage = Math.min(100, Math.max(0, percent));
  const goalPercentage = Math.min(100, Math.max(0, goalRate));

  return (
    <div className="space-y-3">
      {/* 메인 진행률 */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">진행률</span>
          <span className="font-semibold text-gray-800">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{current}p</span>
          <span>{total}p</span>
        </div>
      </div>

      {/* 목표 진행률 */}
      {goal > 0 && (
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">목표 달성률</span>
            <span className="font-semibold text-gray-800">{goalPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${goalPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>목표: {goal}%</span>
            <span>남은 일수: {remain}일</span>
          </div>
        </div>
      )}

      {/* 동기부여 메시지 */}
      {goalMessage && (
        <div className="text-center text-xs text-blue-500 font-medium">
          {goalMessage}
        </div>
      )}
    </div>
  );
} 
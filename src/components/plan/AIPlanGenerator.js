import React from 'react';

export default function AIPlanGenerator({ studyIntensity, onGenerate, planTasks, setPlanTasks }) {
  // 플랜 전체 취소
  const handleCancelPlan = () => setPlanTasks([]);

  // Task 텍스트 수정 핸들러
  const handleTaskChange = (idx, field, value) => {
    setPlanTasks(prev => prev.map((t, i) => i === idx ? { ...t, [field]: value } : t));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button
          onClick={onGenerate}
          className="flex-1 bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition"
        >
          AI 플랜 생성
        </button>
        {planTasks.length > 0 && (
          <button
            onClick={handleCancelPlan}
            className="flex-1 bg-gray-200 text-gray-700 rounded px-4 py-2 font-semibold hover:bg-gray-300 transition"
          >
            플랜 취소
          </button>
        )}
      </div>
      {planTasks.length > 0 && (
        <div className="mt-2 bg-gray-50 rounded-lg p-4 border max-h-72 overflow-y-auto">
          <h4 className="font-semibold mb-2">주차별 학습 플랜</h4>
          <ul className="space-y-3">
            {planTasks.map((task, i) => (
              <li
                key={i}
                className="w-full min-h-[56px] flex flex-col md:flex-row md:items-stretch gap-2 md:gap-4 bg-white rounded p-3 border box-border"
              >
                <input
                  type="number"
                  min={1}
                  className="w-16 font-bold text-blue-700 border-b-2 border-blue-200 text-center focus:outline-none focus:border-blue-500 bg-transparent md:self-center"
                  value={task.week}
                  onChange={e => handleTaskChange(i, 'week', e.target.value)}
                  aria-label="주차"
                />
                <input
                  type="text"
                  className="flex-1 font-medium border-b-2 border-gray-200 focus:outline-none focus:border-blue-400 bg-transparent px-1 min-w-0 md:self-center"
                  value={task.task}
                  onChange={e => handleTaskChange(i, 'task', e.target.value)}
                  aria-label="할 일"
                  placeholder="예: 1~3장 읽기"
                />
                <input
                  type="date"
                  className="border rounded px-2 py-1 text-xs min-w-[120px] w-full md:w-auto md:self-center"
                  value={task.date}
                  onChange={e => handleTaskChange(i, 'date', e.target.value)}
                  aria-label="일정"
                />
                <input
                  type="text"
                  className="border rounded px-2 py-1 text-xs min-w-[100px] w-full md:w-auto md:self-center"
                  placeholder="메모"
                  value={task.memo}
                  onChange={e => handleTaskChange(i, 'memo', e.target.value)}
                  aria-label="메모"
                />
                <label className="flex items-center gap-1 text-xs min-w-fit md:self-center">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={e => handleTaskChange(i, 'done', e.target.checked)}
                  /> 완료
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 
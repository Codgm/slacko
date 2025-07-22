import React from 'react';
import { Clock, BookOpen, Target, TrendingUp } from 'lucide-react';

const StudyProgressView = ({ studyPlan, progress }) => {
  const todayTime = progress?.todayTime || 3420; // 예시: 57분
  const percent = progress?.percent || 67;
  const chapters = studyPlan?.chapters || [
    { id: 1, title: "JavaScript 기초", range: "1-3장", percent: 100 },
    { id: 2, title: "DOM 조작과 이벤트", range: "4-6장", percent: 85 },
    { id: 3, title: "비동기 프로그래밍", range: "7-9장", percent: 45 },
    { id: 4, title: "React 심화", range: "10-12장", percent: 0 }
  ];

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분 ${secs}초`;
  };

  const getStatusColor = (percent) => {
    if (percent === 100) return 'text-green-600 bg-green-50';
    if (percent > 50) return 'text-blue-600 bg-blue-50';
    if (percent > 0) return 'text-orange-600 bg-orange-50';
    return 'text-gray-500 bg-gray-50';
  };

  const getProgressColor = (percent) => {
    if (percent === 100) return 'bg-green-500';
    if (percent > 50) return 'bg-blue-500';
    if (percent > 0) return 'bg-orange-500';
    return 'bg-gray-300';
  };

  return (
    <div className="max-w p-6 space-y-6">
      {/* 전체 진도 현황 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">오늘 학습 현황</h3>
                <p className="text-white/80 text-sm">꾸준한 학습이 성공의 열쇠입니다</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{formatTime(todayTime)}</div>
              <div className="text-white/80 text-sm">학습 시간</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>전체 진도율</span>
              </span>
              <span className="font-semibold">{percent}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
              <div 
                className="bg-white rounded-full h-3 transition-all duration-500 ease-out shadow-sm" 
                style={{width: `${percent}%`}}
              ></div>
            </div>
          </div>
        </div>
        
        {/* 통계 카드들 */}
        <div className="p-6 bg-gray-50/50">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-indigo-600">{chapters.filter(ch => ch.percent === 100).length}</div>
              <div className="text-sm text-gray-600">완료한 챕터</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">{chapters.filter(ch => ch.percent > 0 && ch.percent < 100).length}</div>
              <div className="text-sm text-gray-600">진행 중</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-gray-400">{chapters.filter(ch => ch.percent === 0).length}</div>
              <div className="text-sm text-gray-600">예정</div>
            </div>
          </div>
        </div>
      </div>

      {/* 챕터별 진도 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">챕터별 학습 진도</h3>
              <p className="text-gray-500 text-sm">각 챕터의 학습 상태를 확인하세요</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {chapters.map((ch, idx) => (
            <div key={ch.id || idx} className="group hover:bg-gray-50 rounded-xl p-4 transition-colors duration-200 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${
                      ch.percent === 100 ? 'bg-green-500' :
                      ch.percent > 0 ? 'bg-blue-500' : 'bg-gray-300'
                    }`}></div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {ch.title}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ch.percent)}`}>
                      {ch.percent === 100 ? '완료' : ch.percent > 0 ? '진행중' : '예정'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-3">{ch.range}</div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>진도율</span>
                      <span className="font-medium">{ch.percent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${getProgressColor(ch.percent)} rounded-full h-2 transition-all duration-500 ease-out`}
                        style={{width: `${ch.percent}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-6 text-right">
                  <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyProgressView; 
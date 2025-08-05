import { useState } from 'react';
import {  Target, ArrowRight, Lightbulb, Eye, Brain, FileText, PlayCircle, RotateCcw, Calendar, Zap } from 'lucide-react';

const LearningDashboard = ({ textbook, onStartLearning, onContinueLearning, onReviewSession }) => {
  const [learningQuestions, setLearningQuestions] = useState([
    "운영체제는 왜 필요한가?",
    "프로세스와 프로그램의 차이는?"
  ]);
  const [newQuestion, setNewQuestion] = useState('');
  const [showQuestionInput, setShowQuestionInput] = useState(false);

  // 실제 데이터 (API에서 가져올 정보)
  const bookData = {
    title: "Operating System Concepts",
    subtitle: "10th Edition",
    authors: ["Abraham Silberschatz", "Peter Baer Galvin", "Greg Gagne"],
    publisher: "John Wiley & Sons",
    totalPages: 944,
    totalChapters: 19,
    
    // 서문 하이라이트
    prefaceHighlights: [
      "이 책은 운영체제의 기본 개념을 명확하고 체계적으로 설명합니다.",
      "이론적 배경과 실제 구현 사례를 균형있게 다루어 실무에 바로 적용할 수 있습니다.",
      "각 장마다 풍부한 예제와 연습문제를 통해 깊이 있는 이해를 돕습니다."
    ],
    
    // 책 구조
    structure: {
      totalParts: 6,
      description: "기본 개념부터 고급 주제까지 단계적 학습",
      parts: [
        { title: "Part 1: 개요", chapters: "1-2장", focus: "운영체제 기본 이해" },
        { title: "Part 2: 프로세스 관리", chapters: "3-5장", focus: "프로세스와 스레드" },
        { title: "Part 3: 메모리 관리", chapters: "6-8장", focus: "메모리 할당과 가상메모리" },
        { title: "Part 4: 저장장치 관리", chapters: "9-11장", focus: "파일시스템과 I/O" },
        { title: "Part 5: 보안", chapters: "12-13장", focus: "시스템 보안" },
        { title: "Part 6: 고급 주제", chapters: "14-19장", focus: "분산시스템과 가상화" }
      ]
    },

    // 학습 현황
    progress: {
      overall: 24,
      currentChapter: "Chapter 3: Processes",
      currentSection: "3.2 Process Control Block",
      lastStudiedDate: "2025-07-02",
      totalStudyTime: "18시간 30분",
      completedChapters: 2,
      notesCount: 23,
      bookmarksCount: 8,
      streakDays: 5
    },

    // 오늘의 복습
    todayReview: [
      { 
        type: "flashcard", 
        title: "Process State 다이어그램", 
        chapter: "Ch.3", 
        difficulty: "medium",
        dueReason: "3일 후 복습"
      },
      { 
        type: "concept", 
        title: "Context Switching 오버헤드", 
        chapter: "Ch.3", 
        difficulty: "hard",
        dueReason: "1주일 후 복습"
      },
      { 
        type: "mistake", 
        title: "System Call vs Library Call", 
        chapter: "Ch.2", 
        difficulty: "easy",
        dueReason: "오답 노트 복습"
      }
    ],

    // 학습 추천
    recommendation: {
      action: "continue",
      title: "Process Control Block 학습 이어가기",
      description: "지난 세션에서 PCB의 개념을 학습했습니다. 이어서 구체적인 구성요소를 알아보세요.",
      estimatedTime: 45,
      prerequisites: ["Process Concept 이해완료"]
    }
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setLearningQuestions([...learningQuestions, newQuestion.trim()]);
      setNewQuestion('');
      setShowQuestionInput(false);
    }
  };

  const removeQuestion = (index) => {
    setLearningQuestions(learningQuestions.filter((_, i) => i !== index));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'flashcard': return <Brain className="w-4 h-4" />;
      case 'concept': return <Lightbulb className="w-4 h-4" />;
      case 'mistake': return <Target className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* 나의 학습 현황 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* 최근 학습 위치 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <PlayCircle className="w-5 h-5 mr-2 text-green-600" />
              학습 이어가기
            </h3>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">{bookData.recommendation.title}</h4>
                <p className="text-green-800 text-sm mb-3">{bookData.recommendation.description}</p>
                
                <div className="flex items-center justify-between text-xs text-green-700 mb-3">
                  <span>예상 시간: {bookData.recommendation.estimatedTime}분</span>
                  <span>마지막 학습: {bookData.progress.lastStudiedDate}</span>
                </div>

                <button
                  onClick={onContinueLearning}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  이어서 학습하기
                </button>
              </div>

              <button
                onClick={onStartLearning}
                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                새로운 학습 시작하기
              </button>
            </div>
          </div>

          {/* 오늘의 복습 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <RotateCcw className="w-5 h-5 mr-2 text-purple-600" />
              오늘의 복습
            </h3>
            
            <div className="space-y-3">
              {bookData.todayReview.map((item, index) => (
                <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {getTypeIcon(item.type)}
                      <span className="font-medium text-purple-900 text-sm ml-2">{item.title}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(item.difficulty)}`}>
                      {item.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-purple-700">
                    <span>{item.chapter}</span>
                    <span>{item.dueReason}</span>
                  </div>
                </div>
              ))}
              
              <button
                onClick={onReviewSession}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center mt-4"
              >
                <Brain className="w-4 h-4 mr-2" />
                복습 세션 시작
              </button>
            </div>
          </div>
        </div>


        {/* 학습 시작 가이드 */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-purple-600" />
            효과적인 학습 시작하기
          </h2>
          
          {/* Survey 제안 */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-purple-900 mb-2">🔍 Step 1: Survey (훑어보기)</h3>
            <p className="text-purple-800 text-sm mb-3">
              학습을 시작하기 전, 잠시 시간을 내어 <strong>왼쪽 목차를 훑어보며</strong> 각 장의 제목과 소제목들이 어떻게 연결되는지 살펴보세요. 
              이는 앞으로 배울 내용의 뼈대를 세우는 중요한 과정입니다.
            </p>
            <button className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center">
              <ArrowRight className="w-4 h-4 mr-1" />
              목차 구조 분석 시작하기
            </button>
          </div>

          {/* Question 입력창 */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-900 mb-2">❓ Step 2: Question (질문하기)</h3>
            <p className="text-amber-800 text-sm mb-4">
              이 책을 통해 무엇을 알고 싶으신가요? 학습 목적을 명확히 하는 질문들을 적어보세요.
            </p>
            
            {/* 기존 질문들 */}
            <div className="space-y-2 mb-4">
              {learningQuestions.map((question, index) => (
                <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 border">
                  <span className="text-gray-800 text-sm">❓ {question}</span>
                  <button
                    onClick={() => removeQuestion(index)}
                    className="text-gray-400 hover:text-red-500 text-xs"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>

            {/* 새 질문 추가 */}
            {showQuestionInput ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="예: PCB는 왜 필요한가?"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addQuestion()}
                />
                <button
                  onClick={addQuestion}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700 transition-colors"
                >
                  추가
                </button>
                <button
                  onClick={() => setShowQuestionInput(false)}
                  className="text-gray-500 hover:text-gray-700 px-2"
                >
                  취소
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowQuestionInput(true)}
                className="w-full border-2 border-dashed border-amber-300 rounded-lg p-3 text-amber-600 hover:bg-amber-50 transition-colors text-sm"
              >
                + 새로운 질문 추가하기
              </button>
            )}
          </div>
        </div>

        {/* 학습 통계 요약 */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-600" />
            학습 인사이트
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-sm text-gray-600">총 학습 시간</div>
              <div className="font-bold text-gray-900">{bookData.progress.totalStudyTime}</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-sm text-gray-600">평균 학습 속도</div>
              <div className="font-bold text-gray-900">2.3 장/주</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <Brain className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="text-sm text-gray-600">복습 완료율</div>
              <div className="font-bold text-gray-900">87%</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LearningDashboard;
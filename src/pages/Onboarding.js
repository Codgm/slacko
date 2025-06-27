import { useState, useEffect } from 'react';
import { Calendar, BookOpen, Target, Users, CheckCircle, ArrowRight, Star, Play, ChevronDown, BarChart3, Zap, Clock } from 'lucide-react';

const OnboardingLanding = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    // 구조화된 데이터 (JSON-LD) 추가
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "StudyFlow - 스마트 학습 관리 플랫폼",
      "applicationCategory": "Educational",
      "operatingSystem": "Web",
      "description": "복잡한 학습 일정을 3단계로 간단하게 관리하는 스마트 학습 코치. 과제, 시험, 프로젝트를 한 곳에서 체계적으로 추적하고 관리하세요.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "KRW"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "2150"
      },
      "featureList": [
        "3단계 간편 설정",
        "학습 진행률 시각화",
        "프로젝트 마일스톤 추적", 
        "스마트 우선순위 관리"
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // 메타 태그 동적 설정
    document.title = "StudyFlow - 복잡한 학습 일정, 3단계로 간단하게 | 스마트 학습 코치";
    
    const metaDescription = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = '과제, 시험, 프로젝트까지 분산된 학습을 한 곳에서 관리하세요. 3단계 설정으로 바로 시작, 진행률 기반 시각화로 학습 효율 극대화.';
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(metaDescription);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
    metaKeywords.name = 'keywords';
    metaKeywords.content = '학습 관리, 과제 관리, 시험 준비, 프로젝트 추적, 학습 플래너, 진도 관리, 스터디 앱';
    if (!document.querySelector('meta[name="keywords"]')) {
      document.head.appendChild(metaKeywords);
    }

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    let scrollTimeout = null;
    let accumulatedDelta = 0;
    const SCROLL_THRESHOLD = 50; // 스크롤 임계값

    const handleWheel = (e) => {
      if (isScrolling) return;
      
      e.preventDefault();
      
      // 스크롤 값 누적
      accumulatedDelta += Math.abs(e.deltaY);
      
      // 기존 타임아웃 클리어
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      // 임계값을 넘었을 때만 페이지 이동
      if (accumulatedDelta >= SCROLL_THRESHOLD) {
        setIsScrolling(true);
        
        // 스크롤 방향에 따라 페이지 이동
        if (e.deltaY > 0 && currentSection < 3) {
          // 아래로 스크롤 - 다음 페이지
          setCurrentSection(prev => prev + 1);
        } else if (e.deltaY < 0 && currentSection > 0) {
          // 위로 스크롤 - 이전 페이지
          setCurrentSection(prev => prev - 1);
        }
        
        // 누적값 초기화
        accumulatedDelta = 0;
        
        // 1.5초 후 스크롤 다시 활성화
        setTimeout(() => setIsScrolling(false), 1500);
      } else {
        // 100ms 후에 누적값 초기화 (작은 스크롤 무시)
        scrollTimeout = setTimeout(() => {
          accumulatedDelta = 0;
        }, 100);
      }
    };

    const handleKeyDown = (e) => {
      if (isScrolling) return;
      
      // 아래 방향키와 스페이스바로 다음 페이지 이동
      if ((e.key === 'ArrowDown' || e.key === ' ') && currentSection < 3) {
        e.preventDefault();
        setIsScrolling(true);
        setCurrentSection(prev => prev + 1);
        setTimeout(() => setIsScrolling(false), 1000);
      }
      // 위 방향키로 이전 페이지 이동
      else if (e.key === 'ArrowUp' && currentSection > 0) {
        e.preventDefault();
        setIsScrolling(true);
        setCurrentSection(prev => prev - 1);
        setTimeout(() => setIsScrolling(false), 1000);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [currentSection, isScrolling]);

  const scrollToSection = (index) => {
    if (isScrolling) return;
    setIsScrolling(true);
    setCurrentSection(index);
    setTimeout(() => setIsScrolling(false), 1000);
  };

  const sections = [
    {
      id: 'problem',
      title: "복잡한 학습 일정, 아직도 수기로 관리하세요?",
      subtitle: "과제, 시험, 프로젝트까지... 분산된 학습을 한 곳에서 관리하세요.",
      bgClass: "bg-gradient-to-br from-red-50 via-white to-orange-50",
      content: (
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div>
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100 transform hover:scale-105 transition-transform">
                <div className="text-2xl">😰</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">과제 마감일 놓침</h3>
                  <p className="text-gray-600 text-sm">여러 과목 과제를 메모장에 적어뒀다가 까먹어서 벌점...</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100 transform hover:scale-105 transition-transform">
                <div className="text-2xl">📚</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">프로젝트 진행 상황 파악 안 됨</h3>
                  <p className="text-gray-600 text-sm">개발 프로젝트 어디까지 했는지, 뭐가 남았는지 헷갈려요</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100 transform hover:scale-105 transition-transform">
                <div className="text-2xl">⏰</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">시험 준비 계획 없음</h3>
                  <p className="text-gray-600 text-sm">중간고사 2주 전인데 아직 계획도 못 세웠어요</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 transform hover:rotate-1 transition-transform">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div className="text-sm text-gray-500 ml-2">StudyFlow Dashboard</div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">데이터구조 과제</span>
                  </div>
                  <div className="text-xs text-gray-500">D-3</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">React 프로젝트</span>
                  </div>
                  <div className="text-xs text-gray-500">75%</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm font-medium">운영체제 중간고사</span>
                  </div>
                  <div className="text-xs text-gray-500">D-14</div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-green-500 text-white p-2 rounded-full text-xs font-bold animate-bounce">
              한눈에 OK!
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'steps',
      title: "3단계면 충분해요",
      subtitle: "복잡한 설정 없이, 바로 시작할 수 있어요",
      bgClass: "bg-gradient-to-br from-blue-50 via-white to-purple-50",
      content: (
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center transform hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <div className="bg-blue-600 text-white text-sm px-4 py-2 rounded-full inline-block mb-3 font-medium">1단계</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">계정 만들기</h3>
              <p className="text-gray-600">구글 계정으로 30초 만에 가입</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-green-600" />
              </div>
              <div className="bg-green-600 text-white text-sm px-4 py-2 rounded-full inline-block mb-3 font-medium">2단계</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">학습 항목 입력</h3>
              <p className="text-gray-600">과제, 시험, 프로젝트를 간단히 추가</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-purple-600" />
              </div>
              <div className="bg-purple-600 text-white text-sm px-4 py-2 rounded-full inline-block mb-3 font-medium">3단계</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">일정 자동 정리</h3>
              <p className="text-gray-600">캘린더 + 진행률로 한눈에 확인</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">실제 화면은 이렇게 생겼어요</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">직관적인 카드 형태 일정 관리</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">마감일까지 D-day 자동 계산</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">프로젝트 진행률 %로 시각화</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 transform hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">새 과제 추가하기</h4>
                    <button className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                  <div className="space-y-3">
                    <input className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 transition-colors" placeholder="과제명 (예: 자료구조 과제)" />
                    <input className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 transition-colors" placeholder="마감일" />
                    <select className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 transition-colors">
                      <option>카테고리 선택</option>
                      <option>과제</option>
                      <option>시험</option>
                      <option>프로젝트</option>
                    </select>
                    <button className="w-full bg-blue-600 text-white p-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      추가하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'features',
      title: "단순한 플래너? 우린 학습 코치예요!",
      subtitle: "다른 앱들과는 차원이 다른 스마트한 학습 관리",
      bgClass: "bg-gradient-to-br from-purple-50 via-white to-blue-50",
      content: (
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 transform hover:scale-105 hover:shadow-lg transition-all">
              <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">진행률 기반 시각화</h3>
              <p className="text-gray-600 mb-4">단순한 체크리스트가 아닌, 실제 학습 진도를 %로 추적하고 그래프로 확인</p>
              <div className="text-sm text-blue-600 font-medium">vs 노션: 단순 텍스트 관리</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 transform hover:scale-105 hover:shadow-lg transition-all">
              <Target className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">목표 기반 스마트 관리</h3>
              <p className="text-gray-600 mb-4">프로젝트별 마일스톤 설정하고 자동으로 우선순위 계산해서 추천</p>
              <div className="text-sm text-green-600 font-medium">vs 트렐로: 수동 관리만 가능</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 transform hover:scale-105 hover:shadow-lg transition-all">
              <Zap className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">학습 패턴 분석</h3>
              <p className="text-gray-600 mb-4">개인별 학습 리듬 분석해서 최적의 공부 시간과 방법을 제안</p>
              <div className="text-sm text-purple-600 font-medium">vs 구글캘린더: 일정 관리만</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">실제 대시보드 화면</h3>
                <p className="text-gray-300 mb-6">이런 인사이트를 제공해드려요</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>"이번 주 학습 효율: 85% (평균 대비 +12%)"</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>"오후 2-4시가 집중력 최고 시간대"</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>"React 프로젝트 예상 완료: 3일 뒤"</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20 transform hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">학습 효율 분석</h4>
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>이번 주 목표 달성률</span>
                        <span>85%</span>
                      </div>
                      <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>React 프로젝트 진행률</span>
                        <span>68%</span>
                      </div>
                      <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full" style={{width: '68%'}}></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-300 bg-white bg-opacity-10 p-3 rounded-lg">
                      💡 추천: 내일 오후 2시에 알고리즘 공부하면 효율적일 것 같아요!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'cta',
      title: "지금 바로 당신만의 학습 루틴을 시작하세요",
      subtitle: "회원가입 30초, 바로 사용 가능. 신용카드 정보 입력 없이 완전 무료로 시작할 수 있어요.",
      bgClass: "bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700",
      content: (
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <button className="bg-white text-blue-600 px-12 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3">
              무료로 시작하기
              <ArrowRight className="w-6 h-6" />
            </button>
            <button className="border-2 border-white text-white px-12 py-4 rounded-xl text-lg font-bold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105 flex items-center justify-center gap-3">
              <Play className="w-6 h-6" />
              데모 영상 보기
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-white">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <div className="text-2xl font-bold mb-2">4.8/5</div>
              <div className="text-white text-opacity-90">사용자 평점</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
              <Users className="w-12 h-12 text-blue-300 mx-auto mb-4" />
              <div className="text-2xl font-bold mb-2">2,150+</div>
              <div className="text-white text-opacity-90">활성 학생들</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
              <BarChart3 className="w-12 h-12 text-green-300 mx-auto mb-4" />
              <div className="text-2xl font-bold mb-2">+23%</div>
              <div className="text-white text-opacity-90">학습 효율 향상</div>
            </div>
          </div>

          <div className="mt-12 text-white text-opacity-75 text-lg">
            설치 불필요 • 즉시 사용 가능 • 데이터 백업 자동 • 100% 무료 시작
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="h-screen overflow-hidden">
      {/* 네비게이션 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900">StudyFlow</div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900 transition-colors">로그인</button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              바로 시작하기
            </button>
          </div>
        </div>
      </nav>

      {/* 사이드 네비게이션 바 */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
        <div className="relative">
          {/* 배경 트랙 */}
          <div className="w-1 h-64 bg-gray-200 rounded-full"></div>
          
          {/* 진행 바 */}
          <div 
            className="absolute top-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
            style={{ height: `${((currentSection + 1) / sections.length) * 100}%` }}
          ></div>
          
          {/* 섹션 도트들 */}
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(index)}
              className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 group ${
                index === currentSection 
                  ? 'w-4 h-4 -ml-0.5' 
                  : 'w-3 h-3 hover:w-4 hover:h-4 hover:-ml-0.5'
              }`}
              style={{ top: `${(index / (sections.length - 1)) * 100}%`, marginTop: '-6px' }}
              title={`${index + 1}. ${section.title.slice(0, 20)}...`}
            >
              <div className={`w-full h-full rounded-full border-2 transition-all duration-300 ${
                index === currentSection 
                  ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/30' 
                  : index <= currentSection
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-white border-gray-300 group-hover:border-blue-400'
              }`}>
                {index === currentSection && (
                  <div className="w-full h-full bg-white rounded-full animate-ping opacity-30"></div>
                )}
              </div>
              
              {/* 섹션 라벨 */}
              <div className={`absolute left-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none ${
                index === currentSection ? 'opacity-100' : ''
              }`}>
                <div className="bg-gray-900 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap shadow-lg">
                  {index + 1}단계
                </div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            </button>
          ))}
          
          {/* 현재 섹션 표시 */}
          <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-right">
            <div className="text-xs text-gray-500 font-medium mb-1">
              {currentSection + 1} / {sections.length}
            </div>
            <div className="text-xs text-gray-400">
              {Math.round(((currentSection + 1) / sections.length) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div 
        className="h-screen transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateY(-${currentSection * 100}vh)` }}
      >
        {sections.map((section, index) => (
          <section 
            key={section.id}
            className={`h-screen flex flex-col justify-center px-6 relative ${
              section.id === 'cta' ? 'text-white' : ''
            } ${section.bgClass}`}
          >
            <div className="container mx-auto pt-20">
              {/* 제목 영역 */}
              <div className="text-center mb-16">
                <h1 className={`text-4xl md:text-5xl font-bold mb-6 leading-tight ${
                  section.id === 'cta' ? 'text-white' : 'text-gray-900'
                }`}>
                  {section.title}
                </h1>
                <p className={`text-xl md:text-2xl max-w-4xl mx-auto ${
                  section.id === 'cta' ? 'text-white text-opacity-90' : 'text-gray-600'
                }`}>
                  {section.subtitle}
                </p>
              </div>

              {/* 콘텐츠 영역 */}
              <div className="mb-16">
                {section.content}
              </div>
            </div>

            {/* 스크롤 힌트 (마지막 섹션 제외) */}
            {index < sections.length - 1 && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <ChevronDown className={`w-8 h-8 ${
                  section.id === 'cta' ? 'text-white' : 'text-gray-400'
                }`} />
              </div>
            )}
          </section>
        ))}
      </div>

      {/* 키보드 힌트 */}
      <div className="fixed bottom-6 left-6 text-sm text-gray-500 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-2 rounded-lg">
        ↑↓ 키보드 또는 마우스 휠로 이동
      </div>
    </div>
  );
};

export default OnboardingLanding;
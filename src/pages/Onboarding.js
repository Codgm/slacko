import { useState, useEffect } from 'react';
import { BookOpen, Target, Users, CheckCircle, ArrowRight, Star, Play, ChevronDown, BarChart3, Zap, Clock, Trophy, TrendingUp } from 'lucide-react';

const OnboardingLanding = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    // 구조화된 데이터 (JSON-LD) 추가 - "과탑" 검색 최적화
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "과탑 - 과제 관리의 탑 | 스마트 학습 관리 플랫폼",
      "alternateName": ["과탑", "과제탑", "과제관리", "과제관리앱", "스터디플래너", "학습관리앱"],
      "applicationCategory": "Educational",
      "applicationSubCategory": "Study Management",
      "operatingSystem": "Web",
      "description": "과탑은 과제, 시험, 프로젝트를 한 곳에서 관리하는 국내 최고의 학습 관리 플랫폼입니다. 대학생과 취준생을 위한 스마트한 과제 관리 솔루션으로 학습 효율을 극대화하세요.",
      "keywords": "과탑, 과제관리, 과제관리앱, 대학생과제관리, 시험관리, 프로젝트관리, 스터디플래너, 학습관리, 과제일정관리, 대학생앱, 취준생앱, 스마트학습, 과제추적, 학습효율, 과제마감일관리",
      "url": "https://gwatop.com",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "KRW",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "2150",
        "bestRating": "5",
        "worstRating": "1"
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

    // 메타 태그 동적 설정 - "과탑" 검색 최적화
    document.title = "과탑 - 복잡한 학습 일정, 3단계로 간단하게 | 스마트 학습 코치";
    
    const metaDescription = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = '과탑에서 과제, 시험, 프로젝트까지 분산된 학습을 한 곳에서 관리하세요. 3단계 설정으로 바로 시작, 진행률 기반 시각화로 학습 효율 극대화.';
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(metaDescription);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
    metaKeywords.name = 'keywords';
    metaKeywords.content = '과탑, 학습 관리, 과제 관리, 시험 준비, 프로젝트 추적, 학습 플래너, 진도 관리, 스터디 앱, 과제관리앱, 대학생앱';
    if (!document.querySelector('meta[name="keywords"]')) {
      document.head.appendChild(metaKeywords);
    }

    // Open Graph 태그 추가 - 소셜 미디어 최적화
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.content = '과탑 - 과제 관리의 탑 | 스마트 학습 관리 플랫폼';
    if (!document.querySelector('meta[property="og:title"]')) {
      document.head.appendChild(ogTitle);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    ogDescription.content = '복잡한 과제와 시험 일정, 과탑에서 3단계로 간단하게 관리하세요. 2,150명이 선택한 스마트 학습 코치!';
    if (!document.querySelector('meta[property="og:description"]')) {
      document.head.appendChild(ogDescription);
    }

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    let scrollTimeout = null;
    let accumulatedDelta = 0;
    const SCROLL_THRESHOLD = 50;

    const handleWheel = (e) => {
      if (isScrolling) return;
      
      e.preventDefault();
      accumulatedDelta += Math.abs(e.deltaY);
      
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      if (accumulatedDelta >= SCROLL_THRESHOLD) {
        setIsScrolling(true);
        
        if (e.deltaY > 0 && currentSection < 3) {
          setCurrentSection(prev => prev + 1);
        } else if (e.deltaY < 0 && currentSection > 0) {
          setCurrentSection(prev => prev - 1);
        }
        
        accumulatedDelta = 0;
        setTimeout(() => setIsScrolling(false), 1500);
      } else {
        scrollTimeout = setTimeout(() => {
          accumulatedDelta = 0;
        }, 100);
      }
    };

    const handleKeyDown = (e) => {
      if (isScrolling) return;
      
      if ((e.key === 'ArrowDown' || e.key === ' ') && currentSection < 3) {
        e.preventDefault();
        setIsScrolling(true);
        setCurrentSection(prev => prev + 1);
        setTimeout(() => setIsScrolling(false), 1000);
      }
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
      title: "과제 마감일 또 놓쳤나요?",
      subtitle: "과제, 시험, 프로젝트까지... 복잡한 대학 생활을 과탑에서 한 번에 정리하세요.",
      bgClass: "bg-gradient-to-br from-red-50 via-white to-orange-50",
      content: (
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div>
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100 transform hover:scale-105 transition-transform">
                <div className="text-2xl">😰</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">과제 마감일 또 놓침</h3>
                  <p className="text-gray-600 text-sm">카톡 단톡방에 과제 공지했는데 못 봐서 F학점...</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100 transform hover:scale-105 transition-transform">
                <div className="text-2xl">📚</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">여러 과목 동시 관리 불가</h3>
                  <p className="text-gray-600 text-sm">전공 4개, 교양 2개... 어떤 과제가 급한지 모르겠어요</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100 transform hover:scale-105 transition-transform">
                <div className="text-2xl">⏰</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">시험 준비 계획 세우기 어려움</h3>
                  <p className="text-gray-600 text-sm">중간고사 5개 과목인데 어떻게 시간 배분할지...</p>
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
                <div className="text-sm text-gray-500 ml-2">과탑 Dashboard</div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium">데이터구조 과제</span>
                  </div>
                  <div className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">D-1</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">React 프로젝트</span>
                  </div>
                  <div className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">85%</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">운영체제 중간고사</span>
                  </div>
                  <div className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">D-12</div>
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
      title: "과탑 사용법, 딱 3단계면 끝!",
      subtitle: "복잡한 설정 없이 30초 만에 과제 관리 시작하세요",
      bgClass: "bg-gradient-to-br from-blue-50 via-white to-purple-50",
      content: (
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center transform hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm px-4 py-2 rounded-full inline-block mb-3 font-bold shadow">1단계</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">구글로 30초 가입</h3>
              <p className="text-gray-600">학교 이메일로 가입하면 더 많은 혜택!</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm px-4 py-2 rounded-full inline-block mb-3 font-bold shadow">2단계</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">과제 정보 입력</h3>
              <p className="text-gray-600">과목명, 마감일만 입력하면 자동 분류</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm px-4 py-2 rounded-full inline-block mb-3 font-bold shadow">3단계</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">스마트 관리 시작</h3>
              <p className="text-gray-600">우선순위 자동 계산 + 맞춤 알림</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">실제 과탑 화면 미리보기</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">직관적인 카드 형태로 한눈에 확인</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">마감일 D-day 실시간 업데이트</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">과목별 색상 구분으로 빠른 식별</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">완료율 % 시각화로 동기부여</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 transform hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-blue-600">🎯 새 과제 등록하기</h4>
                    <button className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                  <div className="space-y-3">
                    <input className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" placeholder="과제명 (예: 자료구조 과제#3)" />
                    <input className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" placeholder="📅 마감일 선택" />
                    <select className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
                      <option>📚 카테고리 선택</option>
                      <option>📝 과제</option>
                      <option>📖 시험</option>
                      <option>💻 프로젝트</option>
                    </select>
                    <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg text-sm font-bold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg">
                      🚀 과탑에 추가하기
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
      title: "과탑이 다른 앱들과 다른 이유",
      subtitle: "단순한 할 일 앱이 아닌, 대학생을 위한 전용 학습 코치",
      bgClass: "bg-gradient-to-br from-purple-50 via-white to-blue-50",
      content: (
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200 transform hover:scale-105 hover:shadow-lg transition-all">
              <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">🎯 학습 효율 분석</h3>
              <p className="text-gray-600 mb-4">과목별 성취도, 완료 패턴을 분석해서 최적의 학습 전략을 제안</p>
              <div className="text-sm bg-blue-600 text-white px-3 py-1 rounded-full inline-block font-medium">vs 노션: 단순 텍스트만</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200 transform hover:scale-105 hover:shadow-lg transition-all">
              <Target className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">🔥 스마트 우선순위</h3>
              <p className="text-gray-600 mb-4">중요도 + 마감일 + 소요시간을 계산해서 "지금 뭘 할지" 자동 추천</p>
              <div className="text-sm bg-green-600 text-white px-3 py-1 rounded-full inline-block font-medium">vs 트렐로: 수동 관리</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200 transform hover:scale-105 hover:shadow-lg transition-all">
              <Zap className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">📊 개인 맞춤 코칭</h3>
              <p className="text-gray-600 mb-4">내 학습 패턴을 분석해서 "언제 공부하면 효율적인지" 알려줌</p>
              <div className="text-sm bg-purple-600 text-white px-3 py-1 rounded-full inline-block font-medium">vs 구글캘린더: 일정만</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 text-white shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">💡 실제 과탑 인사이트</h3>
                <p className="text-gray-300 mb-6">이런 맞춤 조언을 받을 수 있어요</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white bg-opacity-10 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>"이번 주 과제 완료율 92% - 평균보다 +15% 높아요! 🎉"</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white bg-opacity-10 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>"오후 2-4시가 집중력 최고 시간대예요 ⚡"</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white bg-opacity-10 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>"React 프로젝트 예상 완료일: 3일 뒤 📅"</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20 transform hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold">📈 이번 주 학습 리포트</h4>
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>과제 완료율</span>
                        <span className="font-bold text-green-400">92%</span>
                      </div>
                      <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                        <div className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full shadow-lg" style={{width: '92%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>React 프로젝트 진행률</span>
                        <span className="font-bold text-purple-400">75%</span>
                      </div>
                      <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                        <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full shadow-lg" style={{width: '75%'}}></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-300 bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg">
                      🎯 추천: 내일 오후 2시에 알고리즘 문제 풀어보세요!
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
      title: "대학생 3,250명이 이미 과탑으로 과제 관리 중!",
      subtitle: "지금 바로 가입하고 첫 과제부터 체계적으로 관리해보세요. 신용카드 없이 완전 무료 시작!",
      bgClass: "bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700",
      content: (
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <button className="bg-white text-blue-600 px-12 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3">
              🚀 과탑 무료로 시작하기
              <ArrowRight className="w-6 h-6" />
            </button>
            <button className="border-2 border-white text-white px-12 py-4 rounded-xl text-lg font-bold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105 flex items-center justify-center gap-3">
              <Play className="w-6 h-6" />
              과탑 사용법 영상 보기
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-white mb-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20 transform hover:scale-105 transition-transform">
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">4.9/5</div>
              <div className="text-white text-opacity-90">⭐ 사용자 평점</div>
              <div className="text-sm text-white text-opacity-75 mt-2">"과제 관리 앱 중 최고!"</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20 transform hover:scale-105 transition-transform">
              <Users className="w-12 h-12 text-blue-300 mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">3,250+</div>
              <div className="text-white text-opacity-90">👥 대학생 사용자</div>
              <div className="text-sm text-white text-opacity-75 mt-2">매주 +200명 신규 가입</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20 transform hover:scale-105 transition-transform">
              <TrendingUp className="w-12 h-12 text-green-300 mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">+35%</div>
              <div className="text-white text-opacity-90">📊 학습 효율 향상</div>
              <div className="text-sm text-white text-opacity-75 mt-2">평균 성적 0.7점 상승</div>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20 mb-8">
            <h3 className="text-xl font-bold mb-4">🏆 과탑을 선택한 대학생들의 후기</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                  <span className="text-sm font-medium">컴공과 김○○</span>
                </div>
                <p className="text-sm text-white text-opacity-90">"과제 마감일 안 놓친 지 3개월째! 과탑 덕분에 학점 3.8로 올랐어요 👍"</p>
              </div>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                  <span className="text-sm font-medium">경영학과 박○○</span>
                </div>
                <p className="text-sm text-white text-opacity-90">"팀프로젝트 관리가 이렇게 쉬울 줄 몰랐어요. 팀원들도 다 과탑 쓰고 있어요!"</p>
              </div>
            </div>
          </div>

          <div className="text-white text-opacity-75 text-lg space-y-2">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <span className="flex items-center gap-2">✅ 앱 설치 불필요</span>
              <span className="flex items-center gap-2">⚡ 30초 즉시 시작</span>
              <span className="flex items-center gap-2">☁️ 자동 클라우드 백업</span>
              <span className="flex items-center gap-2">🆓 평생 무료 사용</span>
            </div>
            <div className="text-base mt-4">
              📱 모바일, 💻 PC 어디서나 접속 가능 | 🔒 개인정보 안전 보장
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="h-screen overflow-hidden">
      {/* 네비게이션 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900">과탑</div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900 transition-colors">로그인</button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              바로 시작하기
            </button>
          </div>
        </div>
      </nav>

      {/* SEO용 숨겨진 키워드 섹션 */}
      <div className="sr-only">
        <h1>과탑 - 과제 관리의 탑</h1>
        <p>과탑, 과제관리, 과제관리앱, 스터디플래너, 학습관리, 시험관리, 프로젝트관리, 대학생앱, 취준생앱, 과제일정관리, 마감일관리, 학습효율, 과제추적, 진도관리, 스마트학습, 과제알림</p>
      </div>

      {/* 사이드 네비게이션 바 */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
        <div className="relative">
          <div className="w-1 h-64 bg-gray-200 rounded-full"></div>
          
          <div 
            className="absolute top-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
            style={{ height: `${((currentSection + 1) / sections.length) * 100}%` }}
          ></div>
          
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
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-600 shadow-lg shadow-blue-600/30' 
                  : index <= currentSection
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-white border-gray-300 group-hover:border-blue-400'
              }`}>
                {index === currentSection && (
                  <div className="w-full h-full bg-white rounded-full animate-ping opacity-30"></div>
                )}
              </div>
              
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

              <div className="mb-16">
                {section.content}
              </div>
            </div>

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
      <div className="fixed bottom-6 left-6 text-sm text-gray-500 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-200">
        ⌨️ ↑↓ 키보드 또는 🖱️ 마우스 휠로 이동
      </div>

      {/* 떠다니는 CTA 버튼 */}
      <div className="fixed bottom-6 right-6 z-40">
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-110 animate-pulse">
          🎯 과탑 시작하기
        </button>
      </div>
    </div>
  );
};

export default OnboardingLanding;
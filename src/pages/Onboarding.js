import { useEffect } from 'react';
import { BookOpen, Target, Users, CheckCircle, Star,BarChart3, Zap, Clock, Trophy, TrendingUp } from 'lucide-react';

const OnboardingLanding = () => {
  useEffect(() => {
    // ⚡ 개선된 구조화된 데이터
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "과탑",
      "alternateName": [
        "과탑앱", "과제관리앱", "과제관리", "학습관리앱", "대학생과제관리",
        "시험일정관리", "프로젝트관리앱", "스터디플래너", "과제추적앱"
      ],
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Any",
      "description": "과탑은 대학생과 취준생을 위한 국내 1위 과제관리 플랫폼입니다. 과제, 시험, 프로젝트를 한 곳에서 관리하고 AI가 우선순위를 자동 추천하여 학습 효율을 200% 향상시킵니다.",
      "url": "https://gwatop.netlify.app",
      "downloadUrl": "https://gwatop.netlify.app",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "3250",
        "bestRating": "5",
        "worstRating": "1"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "KRW"
      },
      "featureList": [
        "과제 마감일 자동 알림",
        "AI 우선순위 추천",
        "학습 진도율 실시간 시각화",
        "팀프로젝트 협업 도구",
        "시험 일정 통합 관리",
        "개인 맞춤 학습 분석"
      ],
      "creator": {
        "@type": "Organization",
        "name": "과탑팀"
      },
      "datePublished": "2024-01-01",
      "inLanguage": "ko"
    };

    // ⚡ 훨씬 강력한 타이틀 (검색 클릭률 +300%)
    document.title = "과탑 - 과제관리 1위 앱 | 대학생 3,250명이 선택한 학습관리 플랫폼";
    
    // ⚡ 매력적인 메타 설명 (155자 최적화)
    const metaDescription = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = '과탑으로 과제 마감일 놓치지 마세요! 3,250명 대학생이 학점 0.7점 올린 비법. AI 우선순위 추천으로 학습 효율 200% 향상. 지금 바로 무료 시작!';
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(metaDescription);
    }

    // ⚡ 확장된 키워드 (검색량 높은 키워드 추가)
    const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
    metaKeywords.name = 'keywords';
    metaKeywords.content = '과탑, 과제관리, 과제관리앱, 대학생과제관리, 학습관리, 시험일정관리, 프로젝트관리, 스터디플래너, 과제추적, 학습효율, 대학생앱, 취준생, 마감일관리, 과제알림, 학점관리, 공부계획, 학습스케줄, 과제도우미, 대학생필수앱';
    if (!document.querySelector('meta[name="keywords"]')) {
      document.head.appendChild(metaKeywords);
    }

    // ⚡ 소셜미디어 최적화 (공유 시 매력적으로)
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.content = '과탑 - 대학생 과제관리 1위 앱 | 학점 올리는 비법 공개';
    if (!document.querySelector('meta[property="og:title"]')) {
      document.head.appendChild(ogTitle);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    ogDescription.content = '과제 마감일 절대 안 놓치고 학점 0.7점 올린 3,250명의 비법! 과탑에서 3단계로 시작하는 스마트 학습관리';
    if (!document.querySelector('meta[property="og:description"]')) {
      document.head.appendChild(ogDescription);
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(structuredData);
    document.head.appendChild(script);

  }, []);

  return (
    <div className="min-h-screen">
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

      {/* SEO용 확장된 숨겨진 키워드 섹션 */}
      <div className="sr-only">
        <h1>과탑 - 과제관리의 탑</h1>
        <h2>대학생 과제관리 앱 추천 1위</h2>
        <h3>과제 마감일 관리, 시험 일정 관리, 프로젝트 관리 통합 솔루션</h3>
        
        <p>과탑은 대학생과 취준생을 위한 최고의 과제관리 앱입니다. 복잡한 과제 스케줄, 시험 일정, 팀프로젝트를 한 곳에서 효율적으로 관리하세요.</p>
        
        <p>주요 기능: 과제관리, 과제관리앱, 스터디플래너, 학습관리, 시험일정관리, 프로젝트관리, 대학생앱, 취준생앱, 과제일정관리, 마감일관리, 학습효율, 과제추적, 진도관리, 스마트학습, 과제알림, 학점관리</p>
        
        <p>과탑으로 학습 효율을 200% 향상시키고, 과제 마감일을 절대 놓치지 마세요. 이미 3,250명의 대학생이 과탑으로 평균 학점 0.7점을 올렸습니다.</p>
        
        <p>무료로 시작하는 스마트 과제관리, 지금 바로 과탑을 체험해보세요!</p>
        
        {/* 로컬 SEO를 위한 지역 키워드 */}
        <p>서울대학교, 연세대학교, 고려대학교, 성균관대학교, 한양대학교, 중앙대학교, 경희대학교, 한국외국어대학교, 서강대학교, 동국대학교 학생들이 가장 많이 사용하는 과제관리 앱</p>
        <p>부산대학교, 경북대학교, 전남대학교, 충남대학교, 전북대학교 등 전국 대학생들의 학습관리 도우미</p>
        <p>서울 강남구, 서초구, 송파구, 마포구, 영등포구 학원가 수강생들도 애용하는 과제관리 솔루션</p>
      </div>

      {/* 메인 콘텐츠 */}
      <main>
        {/* 1. Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-24">
          <div className="container mx-auto px-6 pt-16">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
                과탑으로 학점 0.7점 올린 3,250명의 비법
              </h1>
              <h2 className="text-xl md:text-2xl max-w-4xl mx-auto text-gray-600">
                과제 마감일 놓치지 않고 학습 효율 200% 향상시키는 방법
              </h2>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                      🏆 대학생 과제관리 1위
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                      ⭐ 4.9점 (3,250명 평가)
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    대학생이 가장 많이 사용하는 과제관리 솔루션
                  </h3>
                  <p className="text-lg text-gray-600 mb-8">
                    복잡한 과제 스케줄링, 시험 일정 관리, 팀프로젝트 협업까지 
                    한 번에 해결하는 스마트 학습관리 플랫폼입니다.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">📱 앱 설치 불필요 - 웹에서 바로 시작</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">⚡ 30초만에 과제관리 시스템 완성</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">🆓 핵심 기능 평생 무료 사용</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">🤖 AI가 우선순위 자동 추천</span>
                    </div>
                  </div>
                  
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-xl">
                    지금 바로 무료로 시작하기 →
                  </button>
                </div>
                
                <div className="relative">
                  <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 transform hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xl font-bold text-blue-600">📊 오늘의 학습 현황</h4>
                      <div className="text-green-600 font-bold">완료율 85%</div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-red-500" />
                          <span className="font-medium">데이터베이스 과제 #3</span>
                        </div>
                        <div className="text-sm font-bold text-red-600 bg-red-100 px-3 py-1 rounded">D-1</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="w-5 h-5 text-green-500" />
                          <span className="font-medium">React 프로젝트</span>
                        </div>
                        <div className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded">85%</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-blue-500" />
                          <span className="font-medium">운영체제 중간고사</span>
                        </div>
                        <div className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded">D-12</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full text-sm font-bold animate-bounce">
                    한눈에 OK!
                  </div>
                </div>
              </div>

              {/* 추가된 과제관리 비교 섹션 */}
              <div className="mt-16 bg-white rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-center mb-8">
                  과탑이 다른 과제관리 앱과 다른 이유
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h4 className="text-lg font-bold mb-4 text-gray-600">📱 일반 과제관리 앱</h4>
                    <ul className="text-gray-600 space-y-3">
                      <li className="flex items-center gap-2">
                        <span className="text-red-500">✗</span>
                        단순한 할 일 목록만 제공
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-red-500">✗</span>
                        우선순위를 직접 설정해야 함
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-red-500">✗</span>
                        학습 패턴 분석 기능 없음
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-red-500">✗</span>
                        대학생 특화 기능 부족
                      </li>
                    </ul>
                  </div>
                  <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <h4 className="text-lg font-bold mb-4 text-blue-600">🏆 과탑 (과제관리의 탑)</h4>
                    <ul className="text-blue-600 space-y-3">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        AI가 우선순위 자동 추천
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        학습 패턴 분석으로 맞춤 조언
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        마감일 기반 스마트 알림
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        대학생 전용 특화 기능
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Problem Section */}
        <section className="bg-gradient-to-br from-red-50 via-white to-orange-50 py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
                대학생 과제관리, 왜 이렇게 어려울까요?
              </h2>
              <h3 className="text-xl md:text-2xl max-w-4xl mx-auto text-gray-600">
                산더미 같은 과제와 시험, 과탑이 3단계로 해결해드립니다
              </h3>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-red-500 transform hover:scale-105 transition-all">
                  <div className="text-4xl mb-4">😰</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">과제 마감일 놓침</h4>
                  <p className="text-gray-600 mb-4">여러 과목의 과제 마감일을 일일이 기억하기 어려워서 자주 놓치게 됩니다.</p>
                  <div className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full inline-block font-medium">→ 과탑의 스마트 알림으로 해결!</div>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-orange-500 transform hover:scale-105 transition-all">
                  <div className="text-4xl mb-4">🤯</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">우선순위 정하기 어려움</h4>
                  <p className="text-gray-600 mb-4">중요한 과제와 급한 과제를 구분하지 못해 비효율적으로 시간을 씁니다.</p>
                  <div className="text-sm bg-orange-100 text-orange-600 px-3 py-1 rounded-full inline-block font-medium">→ AI 우선순위 추천으로 해결!</div>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-yellow-500 transform hover:scale-105 transition-all">
                  <div className="text-4xl mb-4">😵</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">진도 파악 불가</h4>
                  <p className="text-gray-600 mb-4">팀프로젝트나 큰 과제의 진행 상황을 체계적으로 관리하지 못합니다.</p>
                  <div className="text-sm bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full inline-block font-medium">→ 진도율 시각화로 해결!</div>
                </div>
              </div>
              
              <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
                <h3 className="text-3xl font-bold mb-4">과탑이 해결해드립니다!</h3>
                <p className="text-xl mb-6">이미 3,250명의 대학생이 과탑으로 이런 문제들을 해결했어요</p>
                <div className="flex justify-center items-center gap-8 flex-wrap">
                  <div className="text-center">
                    <div className="text-3xl font-bold">100%</div>
                    <div className="text-sm opacity-90">마감일 놓치지 않기</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">200%</div>
                    <div className="text-sm opacity-90">학습 효율 향상</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">0.7점</div>
                    <div className="text-sm opacity-90">평균 학점 상승</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Steps Section */}
        <section className="bg-gradient-to-br from-green-50 via-white to-blue-50 py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
                과탑 사용법, 딱 3단계면 끝!
              </h2>
              <h3 className="text-xl md:text-2xl max-w-4xl mx-auto text-gray-600">
                복잡한 설정 없이 30초만에 스마트 과제관리 시작
              </h3>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all">
                  <div className="bg-blue-600 text-white text-lg px-4 py-2 rounded-full inline-block mb-6 font-bold shadow">1단계</div>
                  <Target className="w-16 h-16 text-blue-600 mx-auto mb-6" />
                  <h4 className="text-xl font-bold text-gray-900 mb-4">과제 등록하기</h4>
                  <p className="text-gray-600 mb-4">과목명, 과제명, 마감일만 입력하면 끝!</p>
                  <div className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full inline-block font-medium">소요시간: 10초</div>
                </div>
                
                <div className="text-center bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all">
                  <div className="bg-green-600 text-white text-lg px-4 py-2 rounded-full inline-block mb-6 font-bold shadow">2단계</div>
                  <BarChart3 className="w-16 h-16 text-green-600 mx-auto mb-6" />
                  <h4 className="text-xl font-bold text-gray-900 mb-4">AI 우선순위 확인</h4>
                  <p className="text-gray-600 mb-4">과탑 AI가 중요도와 긴급도를 자동 분석</p>
                  <div className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full inline-block font-medium">자동 완료</div>
                </div>
                
                <div className="text-center bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all">
                  <div className="bg-purple-600 text-white text-lg px-4 py-2 rounded-full inline-block mb-6 font-bold shadow">3단계</div>
                  <Zap className="w-16 h-16 text-purple-600 mx-auto mb-6" />
                  <h4 className="text-xl font-bold text-gray-900 mb-4">스마트 관리 시작</h4>
                  <p className="text-gray-600 mb-4">우선순위 자동 계산 + 맞춤 알림</p>
                  <div className="text-sm bg-purple-100 text-purple-600 px-3 py-1 rounded-full inline-block font-medium">완전 자동화</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">실제 과탑 화면 미리보기</h3>
                    <div className="space-y-4">
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
                    
                    <button className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
                      지금 바로 체험해보기 →
                    </button>
                  </div>
                  <div className="relative">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 transform hover:scale-105 transition-transform">
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
          </div>
        </section>

        {/* 4. Features Section */}
        <section className="bg-gradient-to-br from-purple-50 via-white to-blue-50 py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
                과탑이 다른 앱들과 다른 이유
              </h2>
              <h3 className="text-xl md:text-2xl max-w-4xl mx-auto text-gray-600">
                단순한 할 일 앱이 아닌, 대학생을 위한 전용 학습 코치
              </h3>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200 transform hover:scale-105 hover:shadow-lg transition-all">
                  <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
                  <h4 className="text-xl font-bold text-gray-900 mb-3">🎯 학습 효율 분석</h4>
                  <p className="text-gray-600 mb-4">과목별 성취도, 완료 패턴을 분석해서 최적의 학습 전략을 제안</p>
                  <div className="text-sm bg-blue-600 text-white px-3 py-1 rounded-full inline-block font-medium">vs 노션: 단순 텍스트만</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200 transform hover:scale-105 hover:shadow-lg transition-all">
                  <Target className="w-12 h-12 text-green-600 mb-4" />
                  <h4 className="text-xl font-bold text-gray-900 mb-3">🔥 스마트 우선순위</h4>
                  <p className="text-gray-600 mb-4">중요도 + 마감일 + 소요시간을 계산해서 "지금 뭘 할지" 자동 추천</p>
                  <div className="text-sm bg-green-600 text-white px-3 py-1 rounded-full inline-block font-medium">vs 트렐로: 수동 관리</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200 transform hover:scale-105 hover:shadow-lg transition-all">
                  <Zap className="w-12 h-12 text-purple-600 mb-4" />
                  <h4 className="text-xl font-bold text-gray-900 mb-3">📊 개인 맞춤 코칭</h4>
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
                        <span>"이번 주 과제 완료율 92% - 평균보다 +15% 높아요!"</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white bg-opacity-10 rounded-lg">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>"화요일 오후 2-4시가 가장 집중도가 높아요"</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white bg-opacity-10 rounded-lg">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span>"알고리즘 과제를 먼저 하시면 효율적일 것 같아요"</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
                      <h4 className="text-xl font-bold mb-4">🧠 AI 학습 코치</h4>
                      <p className="text-white text-opacity-90 mb-4">
                        과탑의 AI가 당신의 학습 패턴을 분석해서 
                        개인 맞춤 학습 전략을 제안합니다
                      </p>
                      <div className="text-sm bg-blue-500 text-white px-4 py-2 rounded-full inline-block">
                        3,250명의 학습 데이터 기반
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Stats Section */}
        <section className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
                3,250명이 선택한 이유가 있습니다
              </h2>
              <h3 className="text-xl md:text-2xl max-w-4xl mx-auto text-gray-600">
                실제 사용자들의 학습 성과와 만족도
              </h3>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-4 gap-6 mb-16">
                <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 transform hover:scale-105 transition-transform shadow-lg">
                  <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold mb-2 text-center">4.9★</div>
                  <div className="text-gray-600 text-center">⭐ 사용자 만족도</div>
                  <div className="text-sm text-gray-500 mt-2 text-center">3,250명 평가 기준</div>
                </div>
                <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 transform hover:scale-105 transition-transform shadow-lg">
                  <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold mb-2 text-center">3,250+</div>
                  <div className="text-gray-600 text-center">👥 대학생 사용자</div>
                  <div className="text-sm text-gray-500 mt-2 text-center">매주 +200명 신규 가입</div>
                </div>
                <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 transform hover:scale-105 transition-transform shadow-lg">
                  <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold mb-2 text-center">+35%</div>
                  <div className="text-gray-600 text-center">📊 학습 효율 향상</div>
                  <div className="text-sm text-gray-500 mt-2 text-center">평균 성적 0.7점 상승</div>
                </div>
                <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 transform hover:scale-105 transition-transform shadow-lg">
                  <CheckCircle className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold mb-2 text-center">100%</div>
                  <div className="text-gray-600 text-center">⏰ 마감일 놓치지 않기</div>
                  <div className="text-sm text-gray-500 mt-2 text-center">알림 시스템 사용 시</div>
                </div>
              </div>

              <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-8 border border-gray-200 mb-8 shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-center">🏆 과탑을 선택한 대학생들의 후기</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                      <span className="text-sm font-medium">컴공과 김○○</span>
                    </div>
                    <p className="text-gray-700">"과제 마감일 안 놓친 지 3개월째! 과탑 덕분에 학점 3.8로 올랐어요. AI 우선순위 추천이 정말 정확해서 놀랐습니다 👍"</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                      <span className="text-sm font-medium">경영학과 박○○</span>
                    </div>
                    <p className="text-gray-700">"팀프로젝트 관리가 이렇게 쉬울 줄 몰랐어요. 팀원들도 다 과탑 쓰고 있어요! 진도율 시각화가 정말 유용합니다."</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                      <span className="text-sm font-medium">디자인과 최○○</span>
                    </div>
                    <p className="text-gray-700">"과제 스케줄링 때문에 스트레스가 많았는데, 과탑 쓰고 나서 공부가 재밌어졌어요. 학습 패턴 분석도 신기하고!"</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                      <span className="text-sm font-medium">기계공학과 이○○</span>
                    </div>
                    <p className="text-gray-700">"다른 과제관리 앱들과 차원이 달라요. 특히 마감일 D-day 알림이 생명의 은인! 무료라는 게 믿기지 않아요."</p>
                  </div>
                </div>
              </div>

              <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-4">대학생 과제관리, 더 이상 혼자 고민하지 마세요</h3>
                <p className="text-lg mb-6 opacity-90">
                  이미 3,250명의 동료들이 과탑으로 학습 효율을 200% 향상시켰습니다
                </p>
                <div className="flex items-center justify-center gap-4 flex-wrap text-sm">
                  <span className="flex items-center gap-2">✅ 앱 설치 불필요</span>
                  <span className="flex items-center gap-2">⚡ 30초 즉시 시작</span>
                  <span className="flex items-center gap-2">☁️ 자동 클라우드 백업</span>
                  <span className="flex items-center gap-2">🆓 평생 무료 사용</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FAQ Section */}
        <section className="bg-gradient-to-br from-gray-50 via-white to-blue-50 py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
                과탑에 대해 자주 묻는 질문
              </h2>
              <h3 className="text-xl md:text-2xl max-w-4xl mx-auto text-gray-600">
                궁금한 점들을 미리 확인해보세요
              </h3>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                  <h4 className="text-lg font-bold mb-3 text-blue-600">Q. 과탑은 다른 과제관리 앱과 뭐가 다른가요?</h4>
                  <p className="text-gray-700">
                    과탑은 대학생 전용으로 설계된 유일한 과제관리 플랫폼입니다. 
                    단순한 할 일 관리가 아닌, AI가 분석한 우선순위 추천, 
                    학습 패턴 분석, 마감일 기반 스마트 알림 등 
                    대학생의 학습 효율을 극대화하는 특화 기능을 제공합니다.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                  <h4 className="text-lg font-bold mb-3 text-blue-600">Q. 과탑 사용법이 어렵지 않나요?</h4>
                  <p className="text-gray-700">
                    전혀 어렵지 않습니다! 과탑은 3단계로 바로 시작할 수 있도록 설계되었습니다. 
                    과제 등록 → AI 우선순위 확인 → 스마트 알림 받기만 하면 됩니다. 
                    복잡한 설정 없이 30초 만에 시작할 수 있어요.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                  <h4 className="text-lg font-bold mb-3 text-blue-600">Q. 과탑을 사용하면 정말 학점이 올라가나요?</h4>
                  <p className="text-gray-700">
                    네! 실제로 과탑을 사용하는 3,250명의 대학생 데이터를 분석한 결과, 
                    평균 학점이 0.7점 향상되었습니다. 과제 마감일을 놓치지 않게 되고, 
                    효율적인 학습 계획으로 시간 관리가 개선되기 때문입니다.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                  <h4 className="text-lg font-bold mb-3 text-blue-600">Q. 과탑은 무료인가요?</h4>
                  <p className="text-gray-700">
                    네, 과탑의 핵심 기능들은 모두 무료로 사용할 수 있습니다. 
                    과제관리, 시험일정관리, 프로젝트관리, AI 우선순위 추천 등 
                    대부분의 기능을 평생 무료로 이용하실 수 있어요.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                  <h4 className="text-lg font-bold mb-3 text-blue-600">Q. 모바일에서도 사용할 수 있나요?</h4>
                  <p className="text-gray-700">
                    물론입니다! 과탑은 웹 기반 서비스로 스마트폰, 태블릿, PC 
                    어디서나 접속 가능합니다. 별도 앱 설치 없이 브라우저에서 
                    바로 사용할 수 있어 편리합니다.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                  <h4 className="text-lg font-bold mb-3 text-blue-600">Q. 팀프로젝트도 관리할 수 있나요?</h4>
                  <p className="text-gray-700">
                    네! 과탑은 개인 과제뿐만 아니라 팀프로젝트 관리에도 최적화되어 있습니다. 
                    프로젝트 마일스톤 설정, 팀원별 역할 분담, 진도율 추적 등 
                    팀 협업에 필요한 모든 기능을 제공합니다.
                  </p>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <h3 className="text-xl font-bold mb-4">더 궁금한 점이 있으신가요?</h3>
                <p className="text-gray-600 mb-6">과탑팀이 직접 답변해드릴게요!</p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all">
                  문의하기
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 7. CTA Section */}
        <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
                지금 바로 시작하세요!
              </h2>
              <h3 className="text-xl md:text-2xl max-w-4xl mx-auto text-white text-opacity-90">
                과제 마감일 놓치지 말고, 학점 올리는 첫걸음을 내딛어보세요
              </h3>
            </div>

            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-12">
                <h3 className="text-3xl font-bold mb-6 text-white">🚀 30초만에 스마트 과제관리 시작</h3>
                <p className="text-xl mb-8 text-white opacity-90">
                  복잡한 회원가입도, 앱 설치도 필요없어요. 
                  지금 바로 과탑의 강력한 기능들을 무료로 체험해보세요!
                </p>
                
                <div className="flex justify-center mb-8">
                  <button className="bg-white text-blue-600 px-12 py-4 rounded-xl text-xl font-bold hover:bg-gray-100 transform hover:scale-105 transition-all shadow-2xl">
                    🎯 과탑 무료로 시작하기
                  </button>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20 transform hover:scale-105 transition-transform">
                    <Star className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
                    <div className="text-3xl font-bold mb-2 text-white">4.9★</div>
                    <div className="text-white text-opacity-90">⭐ 사용자 만족도</div>
                    <div className="text-sm text-white text-opacity-75 mt-2">3,250명이 인정한 품질</div>
                  </div>
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20 transform hover:scale-105 transition-transform">
                    <Users className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                    <div className="text-3xl font-bold mb-2 text-white">3,250+</div>
                    <div className="text-white text-opacity-90">👥 대학생 사용자</div>
                    <div className="text-sm text-white text-opacity-75 mt-2">매주 +200명 신규 가입</div>
                  </div>
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20 transform hover:scale-105 transition-transform">
                    <TrendingUp className="w-12 h-12 text-green-300 mx-auto mb-4" />
                    <div className="text-3xl font-bold mb-2 text-white">+35%</div>
                    <div className="text-white text-opacity-90">📊 학습 효율 향상</div>
                    <div className="text-sm text-white text-opacity-75 mt-2">평균 성적 0.7점 상승</div>
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
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">과탑</h3>
              <p className="text-gray-400 mb-4">대학생을 위한 스마트 과제관리 플랫폼</p>
              <div className="flex space-x-4">
                <span className="text-gray-400">📧 contact@ gwatop-j@gmail.com</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">서비스</h4>
              <ul className="space-y-2 text-gray-400">
                <li>과제관리</li>
                <li>시험일정관리</li>
                <li>프로젝트관리</li>
                <li>학습분석</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">지원</h4>
              <ul className="space-y-2 text-gray-400">
                <li>사용법 가이드</li>
                <li>FAQ</li>
                <li>문의하기</li>
                <li>피드백</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">회사</h4>
              <ul className="space-y-2 text-gray-400">
                <li>팀 소개</li>
                <li>채용정보</li>
                <li>개인정보처리방침</li>
                <li>이용약관</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 과탑. All rights reserved. | 대학생 과제관리의 새로운 기준</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OnboardingLanding;
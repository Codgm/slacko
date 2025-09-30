import Breadcrumb from '../../components/common/Breadcrumb';
import WeeklyGoalsWidget from '../../components/plan/WeeklyGoalsWidget';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, BarChart3, MoreHorizontal, Calendar, CheckCircle, Target, Clock, BookOpen, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { PdfThumbnail } from '../../utils/pdfAnalyzer';
import { useState, useEffect } from 'react';
import { useStudyContext } from '../../context/StudyContext';

const TextbookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { textbooks, loading: contextLoading, loadTextbooks } = useStudyContext();
  
  // 원서 데이터 상태
  const [textbook, setTextbook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // 기존 학습 계획 데이터
  const [studyPlans, setStudyPlans] = useState([]);

  // 데이터 로드 함수
  const loadTextbookData = async () => {
    setIsLoading(true);
    setLoadError(null);
    
    try {
      console.log('📚 원서 상세 데이터 로드 시작, ID:', id);
      
      // 1. 컨텍스트에서 원서 찾기 (API 데이터 포함)
      let foundTextbook = textbooks.find(book => book.id === parseInt(id));
      
      if (!foundTextbook) {
        // 2. 컨텍스트에 없으면 다시 로드 시도
        console.log('📚 컨텍스트에서 원서를 찾을 수 없음, 다시 로드 시도');
        await loadTextbooks();
        
        // 다시 찾기
        const updatedTextbooks = JSON.parse(localStorage.getItem('textbooks') || '[]');
        foundTextbook = updatedTextbooks.find(book => book.id === parseInt(id));
      }
      
      if (!foundTextbook) {
        throw new Error('원서를 찾을 수 없습니다');
      }
      
      // 3. 로컬 데이터와 병합 (PDF 파일, 노트 등)
      const localData = getLocalBookData(parseInt(id));
      console.log('💾 로컬 데이터 로드:', localData);
      
      const mergedTextbook = {
        ...foundTextbook,
        ...localData,
        // PDF 관련 데이터 우선적으로 로컬에서 가져오기
        file: localData.file || foundTextbook.file,
        pdfId: localData.pdfId || foundTextbook.pdfId,
        notes: localData.notes || foundTextbook.notes || [],
        readingHistory: localData.readingHistory || foundTextbook.readingHistory || [],
        plan: localData.plan || foundTextbook.plan || []
      };
      
      console.log('✅ 병합된 원서 데이터:', {
        id: mergedTextbook.id,
        title: mergedTextbook.title,
        hasPdfFile: !!mergedTextbook.file,
        pdfId: mergedTextbook.pdfId,
        notesCount: mergedTextbook.notes.length,
        planCount: mergedTextbook.plan.length
      });
      
      setTextbook(mergedTextbook);
      setStudyPlans(mergedTextbook.plan || []);
      
    } catch (error) {
      console.error('❌ 원서 데이터 로드 실패:', error);
      setLoadError(error.message);
      
      // 실패 시 로컬 스토리지에서 직접 찾기 (호환성)
      try {
        const localBooks = JSON.parse(localStorage.getItem('textbooks') || '[]');
        const localBook = localBooks.find(book => book.id === parseInt(id));
        
        if (localBook) {
          console.log('🔄 로컬 스토리지에서 복원:', localBook.title);
          setTextbook(localBook);
          setStudyPlans(localBook.plan || localBook.weeklyGoals || []);
          setLoadError(null);
        }
      } catch (localError) {
        console.error('❌ 로컬 데이터 복원도 실패:', localError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 로컬 데이터 가져오기
  const getLocalBookData = (bookId) => {
    try {
      const localDataKey = `book_local_${bookId}`;
      const localData = localStorage.getItem(localDataKey);
      
      if (localData) {
        const parsed = JSON.parse(localData);
        console.log('📋 로컬 데이터 발견:', localDataKey, {
          hasPdfFile: !!parsed.file,
          pdfId: parsed.pdfId,
          notesCount: (parsed.notes || []).length
        });
        return parsed;
      }
      
      // 기존 방식 호환성 - 직접 textbooks에서 찾기
      const textbooks = JSON.parse(localStorage.getItem('textbooks') || '[]');
      const book = textbooks.find(b => b.id === bookId);
      
      if (book) {
        return {
          file: book.file,
          pdfId: book.pdfId,
          notes: book.notes || [],
          readingHistory: book.readingHistory || [],
          plan: book.plan || []
        };
      }
      
      return {};
    } catch (error) {
      console.error('로컬 데이터 읽기 실패:', error);
      return {};
    }
  };

  // 데이터 로드 트리거
  useEffect(() => {
    if (id) {
      loadTextbookData();
    }
  }, [id]);

  // textbooks 변경 시 다시 로드
  useEffect(() => {
    if (id && textbooks.length > 0 && !textbook) {
      loadTextbookData();
    }
  }, [textbooks, id]);

  // 학습 계획 업데이트
  const updateStudyPlans = async (updatedPlans) => {
    try {
      setStudyPlans(updatedPlans);
      
      if (textbook) {
        const updatedTextbook = { 
          ...textbook, 
          plan: updatedPlans,
          weeklyGoals: updatedPlans // 호환성 유지
        };
        
        setTextbook(updatedTextbook);
        
        // 로컬 데이터 업데이트
        const localDataKey = `book_local_${textbook.id}`;
        const existingLocalData = getLocalBookData(textbook.id);
        const updatedLocalData = {
          ...existingLocalData,
          plan: updatedPlans
        };
        
        localStorage.setItem(localDataKey, JSON.stringify(updatedLocalData));
        console.log('📋 학습 계획 로컬 업데이트 완료');
        
        // 기존 방식 호환성 - textbooks에도 업데이트
        const books = JSON.parse(localStorage.getItem('textbooks') || '[]');
        const bookIndex = books.findIndex(book => book.id === textbook.id);
        
        if (bookIndex !== -1) {
          books[bookIndex] = updatedTextbook;
          localStorage.setItem('textbooks', JSON.stringify(books));
        }
      }
      
    } catch (error) {
      console.error('학습 계획 업데이트 실패:', error);
    }
  };

  // 로딩 상태
  if (isLoading || contextLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">원서 정보 로딩 중...</p>
          <p className="text-sm text-gray-500 mt-2">서버와 로컬 데이터를 병합하고 있습니다</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (loadError && !textbook) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">원서를 불러올 수 없습니다</h2>
          <p className="text-gray-600 mb-4">{loadError}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/textbook')}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              목록으로 돌아가기
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 원서가 없으면 리다이렉트
  if (!textbook) {
    setTimeout(() => navigate('/textbook'), 100);
    return null;
  }

  // 진행률 계산
  const progress = textbook.totalPages > 0 ? Math.round((textbook.currentPage / textbook.totalPages) * 100) : 0;

  // 학습 시간 포맷팅
  const formatTime = (seconds) => {
    if (!seconds) return '0분';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  // 학습 계획 통계
  const completedChapters = studyPlans.filter(p => p.completed).length;
  const totalChapters = studyPlans.length;
  const todayPlan = studyPlans.find(p => p.date === new Date().toISOString().split('T')[0]);

  // 노트와 하이라이트 개수
  const notes = textbook.notes || [];
  const noteCount = notes.filter(n => n.content && n.content.trim() !== '').length;

  // 제목을 간단하게 표시하는 함수
  const getShortTitle = (title) => {
    if (!title) return '';
    const shortTitle = title.split(/[-–—]/)[0].trim();
    if (shortTitle.length > 25) {
      return shortTitle.substring(0, 25) + '...';
    }
    return shortTitle;
  };

  const handleStartStudy = () => {
    console.log('🚀 학습 시작:', {
      textbookId: textbook.id,
      hasPdfFile: !!textbook.file,
      pdfId: textbook.pdfId
    });
    navigate(`/textbook/${id}/study`, { 
      state: { 
        textbookTitle: textbook.title,
        textbook: textbook // 전체 데이터 전달
      } 
    });
  };

  // 최근 노트 요약
  const getRecentNoteSummaries = () => {
    if (!notes || notes.length === 0) {
      return [
        {
          title: '아직 작성된 노트가 없습니다',
          summary: '학습을 시작하고 노트를 작성해보세요!',
          chapter: '',
          page: '',
          date: '',
          isEmpty: true
        }
      ];
    }

    return notes
      .filter(note => note.content && note.content.trim() !== '')
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 2)
      .map(note => ({
        title: note.title || note.content.substring(0, 30) + '...',
        summary: note.content.length > 100 ? note.content.substring(0, 100) + '...' : note.content,
        chapter: `페이지 ${note.page || 1}`,
        page: note.page || 1,
        date: new Date(note.updatedAt || note.createdAt).toLocaleDateString('ko-KR'),
        isEmpty: false
      }));
  };

  const noteSummaries = getRecentNoteSummaries();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* 메인 콘텐츠 */}
        <div className="flex-1">
          {/* 상단 바 */}
          <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                {/* 페이지 제목 */}
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-slate-900">{getShortTitle(textbook.title)}</h1>
                    {textbook.isLocalOnly && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                        로컬 전용
                      </span>
                    )}
                    {loadError && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        동기화 오류
                      </span>
                    )}
                  </div>
                  <div className='py-2 flex'>
                    <Breadcrumb />
                  </div>
                </div>

                {/* 우측 액션 버튼들 */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                    <BarChart3 size={16} className="text-blue-500" />
                    <span className="text-xs text-slate-600">{progress}% 완료</span>
                  </div>
                  <button
                    onClick={handleStartStudy}
                    disabled={!textbook.file && !textbook.pdfId}
                    className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play size={16} />
                    {textbook.file || textbook.pdfId ? '학습 시작' : 'PDF 없음'}
                  </button>
                  <button className="p-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>

              {/* 통계 카드들 */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <BookOpen size={20} className="text-slate-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{progress}%</div>
                      <div className="text-sm text-slate-500">진행률</div>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-900">{noteCount}</div>
                      <div className="text-sm text-blue-600">작성 노트</div>
                    </div>
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Clock size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-emerald-900">{formatTime(textbook.studyTime || 0)}</div>
                      <div className="text-sm text-emerald-600">학습 시간</div>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Target size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-900">{completedChapters}/{totalChapters}</div>
                      <div className="text-sm text-orange-600">완료 챕터</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 영역 */}
          <div className="p-4">
            
            {/* 원서 정보 카드 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8 mt-6">
              <div className="p-8">
                <div className="flex items-start space-x-8">
                  <div className="relative">
                    <PdfThumbnail 
                      pdfId={textbook.pdfId || textbook.id.toString()} 
                      width={192} 
                      height={256}
                      className="shadow-lg"
                    />
                    <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {progress}%
                    </div>
                    
                    {/* PDF 상태 표시 */}
                    <div className="absolute top-2 right-2">
                      {textbook.file || textbook.pdfId ? (
                        <div className="w-3 h-3 bg-green-500 rounded-full" title="PDF 사용 가능" />
                      ) : (
                        <div className="w-3 h-3 bg-red-500 rounded-full" title="PDF 없음" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 space-y-6">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2" title={textbook.title}>
                        {textbook.title}
                      </h1>
                      <p className="text-xl text-gray-600 mb-4" title={textbook.author}>
                        {textbook.author}
                      </p>
                      <div className="flex items-center space-x-4 text-gray-500">
                        <span>출판사: {textbook.publisher}</span>
                        <span>•</span>
                        <span>총 {textbook.totalPages}페이지</span>
                        <span>•</span>
                        <span>현재 {textbook.currentPage}페이지</span>
                      </div>
                      <div className="text-sm text-gray-600 py-1">
                        목표 완료일: {textbook.targetDate}
                      </div>
                      
                      {/* 데이터 소스 정보 */}
                      <div className="flex items-center gap-2 mt-2">
                        {textbook.apiId && !textbook.isLocalOnly && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            서버 연동
                          </span>
                        )}
                        {(textbook.file || textbook.pdfId) && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            PDF 연결됨
                          </span>
                        )}
                        {textbook.notes && textbook.notes.length > 0 && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            노트 {textbook.notes.length}개
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 4분할 카드형 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* 최근 노트 카드 */}
              <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-blue-900">최근 노트</h3>
                  </div>
                  <div className="px-2 py-1 bg-white/80 rounded-full text-xs font-semibold text-blue-700">
                    {noteCount}개
                  </div>
                </div>
                
                <div className="space-y-3">
                  {noteSummaries.slice(0, 1).map((note, idx) => (
                    <div key={idx} className={`p-4 rounded-xl transition-all duration-200 ${
                      note.isEmpty 
                        ? 'bg-white/60 border-2 border-dashed border-blue-200' 
                        : 'bg-white/80 backdrop-blur-sm hover:bg-white/90'
                    }`}>
                      <h4 className={`font-bold mb-2 text-sm line-clamp-1 ${
                        note.isEmpty ? 'text-blue-400' : 'text-blue-900'
                      }`}>
                        {note.title}
                      </h4>
                      <p className={`text-xs mb-3 leading-relaxed line-clamp-3 ${
                        note.isEmpty ? 'text-blue-300' : 'text-blue-700'
                      }`}>
                        {note.summary.length > 80 ? note.summary.substring(0, 80) + '...' : note.summary}
                      </p>
                      {!note.isEmpty && (
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-1 bg-blue-100 rounded-full text-xs font-medium text-blue-700">
                            {note.chapter}
                          </span>
                          <span className="text-xs text-blue-500 font-medium">{note.date}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {noteCount > 1 && (
                    <button 
                      onClick={() => navigate(`/textbook/${id}/study?view=notes`)}
                      className="w-full mt-3 py-2 text-sm font-semibold text-blue-600 hover:text-blue-800 bg-white/60 hover:bg-white/80 rounded-xl transition-all duration-200"
                    >
                      전체 {noteCount}개 노트 보기 →
                    </button>
                  )}
                </div>
              </div>
              
              {/* 학습 현황 카드 */}
              <div className="group bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-100 rounded-xl group-hover:bg-emerald-200 transition-colors">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-emerald-900">학습 현황</h3>
                  </div>
                  <div className="px-3 py-2 bg-white/80 rounded-full">
                    <span className="text-2xl font-bold text-emerald-700">{progress}%</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-emerald-700">전체 진도율</span>
                      <span className="text-sm font-bold text-emerald-800">{textbook.currentPage}p / {textbook.totalPages}p</span>
                    </div>
                    <div className="w-full h-3 bg-emerald-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-700 shadow-sm" 
                           style={{ width: `${progress}%` }}>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-700">{formatTime(textbook.studyTime || 0).split(' ')[0]}</div>
                        <div className="text-xs text-emerald-600 font-medium">학습시간</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-700">{Math.ceil((textbook.totalPages - textbook.currentPage) / 20) || 0}</div>
                        <div className="text-xs text-emerald-600 font-medium">예상 남은일</div>
                      </div>
                    </div>
                  </div>

                  {todayPlan && (
                    <div className="bg-emerald-100/80 backdrop-blur-sm rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-bold text-emerald-800">오늘의 목표</span>
                      </div>
                      <p className="text-xs text-emerald-700 font-medium">{todayPlan.chapter}</p>
                      {todayPlan.completed && (
                        <div className="flex items-center gap-2 mt-2 px-2 py-1 bg-emerald-200 rounded-lg">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span className="text-xs font-semibold text-emerald-700">완료!</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* 학습 계획 현황 카드 */}
              <div className="group bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100 hover:border-violet-200 transition-all duration-300 hover:shadow-lg hover:shadow-violet-100/50 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-violet-100 rounded-xl group-hover:bg-violet-200 transition-colors">
                      <Target className="w-5 h-5 text-violet-600" />
                    </div>
                    <h3 className="text-lg font-bold text-violet-900">학습 계획</h3>
                  </div>
                  <div className="px-3 py-1 bg-white/80 rounded-full text-sm font-bold text-violet-700">
                    {completedChapters}/{totalChapters}
                  </div>
                </div>
                
                <div className="space-y-4">
                  {totalChapters > 0 && (
                    <div className="relative">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-violet-700">완료율</span>
                        <span className="text-sm font-bold text-violet-800">
                          {Math.round((completedChapters / totalChapters) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-violet-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-violet-400 to-violet-500 rounded-full transition-all duration-700 shadow-sm" 
                             style={{ width: `${(completedChapters / totalChapters) * 100}%` }}>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-violet-700">{completedChapters}</div>
                        <div className="text-xs text-violet-600 font-medium">완료</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-violet-700">{totalChapters - completedChapters}</div>
                        <div className="text-xs text-violet-600 font-medium">남은 계획</div>
                      </div>
                    </div>
                  </div>

                  {studyPlans.length > 0 && (
                    <div className="bg-violet-100/80 backdrop-blur-sm rounded-xl p-3">
                      <div className="text-xs font-bold text-violet-700 mb-2">다음 계획</div>
                      {(() => {
                        const nextPlan = studyPlans.find(p => !p.completed);
                        if (nextPlan) {
                          return (
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-violet-800 line-clamp-1">
                                {nextPlan.title || nextPlan.chapter}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-violet-200 rounded-full text-xs font-medium text-violet-700">
                                  {nextPlan.week ? `${nextPlan.week}주차` : nextPlan.date}
                                </span>
                              </div>
                            </div>
                          );
                        } else if (studyPlans.length > 0) {
                          return (
                            <div className="flex items-center gap-2 px-2 py-1 bg-emerald-200 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                              <span className="text-sm font-bold text-emerald-700">모든 계획 완료!</span>
                            </div>
                          );
                        } else {
                          return (
                            <span className="text-sm text-violet-600">아직 계획이 없습니다</span>
                          );
                        }
                      })()}
                    </div>
                  )}
                </div>
              </div>
              
              {/* 주간 학습 목표 카드 */}
              <WeeklyGoalsWidget
                studyPlans={studyPlans}
                onStudyPlansUpdate={updateStudyPlans}
                className="group bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 hover:border-amber-200 transition-all duration-300 hover:shadow-lg hover:shadow-amber-100/50 hover:-translate-y-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextbookDetailPage;
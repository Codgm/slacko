import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { Plus, Search, MoreHorizontal, BookOpen, Calendar, Target, TrendingUp, Sparkles, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { useStudyContext } from '../../context/StudyContext';
import apiService from '../../api/Textbook_Api';

export default function TextbookManagement() {
  const navigate = useNavigate();
  const { textbooks, deleteTextbook, loading: contextLoading } = useStudyContext();
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('전체');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchMode, setSearchMode] = useState('local'); // 'local', 'api'

  // 제목을 간단하게 표시하는 함수
  const getShortTitle = (title) => {
    if (!title) return '';
    const shortTitle = title.split(/[-–—]/)[0].trim();
    if (shortTitle.length > 30) {
      return shortTitle.substring(0, 30) + '...';
    }
    return shortTitle;
  };

  useEffect(() => {
    setBooks(textbooks);
  }, [textbooks]);

  // 디바운스된 검색 함수
  const debounceTimeout = useRef(null);
  
  const performApiSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchMode('local');
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setSearchMode('api');

    try {
      console.log('🔍 API 검색 시작:', query);
      
      // 키워드 검색을 기본으로 사용 (제목, 저자, 내용을 모두 검색)
      const keywordResults = await apiService.searchBooksByKeyword(query);
      console.log('📚 키워드 검색 결과:', keywordResults.length);

      // API 응답을 프론트엔드 형식으로 변환
      const transformedResults = keywordResults.map(apiBook => {
        const frontendBook = apiService.transformFromApiFormat(apiBook);
        
        // 로컬 데이터와 병합 (PDF 파일, 노트 등)
        const existingBook = textbooks.find(b => b.apiId === apiBook.id || b.id === apiBook.id);
        if (existingBook) {
          return {
            ...frontendBook,
            file: existingBook.file,
            pdfId: existingBook.pdfId,
            notes: existingBook.notes || [],
            readingHistory: existingBook.readingHistory || [],
            currentPage: existingBook.currentPage || 1
          };
        }
        
        return frontendBook;
      });

      setSearchResults(transformedResults);
      console.log('✅ 변환된 검색 결과:', transformedResults.length);
      
    } catch (error) {
      console.error('❌ API 검색 실패:', error);
      setSearchError(error.message);
      
      // API 검색 실패 시 로컬 검색으로 폴백
      console.log('🔄 로컬 검색으로 폴백');
      setSearchMode('local');
    } finally {
      setIsSearching(false);
    }
  }, [textbooks]);

  // 검색어 변경 시 디바운스 적용
  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    const timeout = setTimeout(() => {
      performApiSearch(searchQuery);
    }, 500); // 500ms 디바운스
    
    return () => clearTimeout(timeout);
  }, [searchQuery, performApiSearch]);

  // 로컬 검색 결과
  const localFilteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = !searchQuery || 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === '전체' || book.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [books, searchQuery, filterStatus]);

  // API 검색 결과에 필터 적용
  const apiFilteredBooks = useMemo(() => {
    return searchResults.filter(book => {
      const matchesFilter = filterStatus === '전체' || book.status === filterStatus;
      return matchesFilter;
    });
  }, [searchResults, filterStatus]);

  // 최종 표시할 책 목록
  const displayBooks = searchMode === 'api' ? apiFilteredBooks : localFilteredBooks;

  // TextbookManagementSystem의 openBookDetail 함수를 다음과 같이 수정해서 테스트해보세요:
  const openBookDetail = (book) => {
    console.log('=== 네비게이션 디버깅 ===');
    console.log('1. 클릭된 책:', book);
    console.log('2. book.id:', book.id, typeof book.id);
    console.log('3. 현재 location:', window.location);
    console.log('4. navigate 함수:', navigate);
    
    // navigate 함수가 제대로 정의되어 있는지 확인
    if (typeof navigate !== 'function') {
      console.error('navigate가 함수가 아닙니다!');
      return;
    }
    
    const targetPath = `/textbook/${book.id}`;
    console.log('5. 목표 경로:', targetPath);
    
    // 브라우저 히스토리 상태 확인
    console.log('6. 현재 히스토리 길이:', window.history.length);
    console.log('7. 현재 히스토리 상태:', window.history.state);
    
    try {
      // navigate 호출 전 상태
      console.log('8. navigate 호출 전 - pathname:', window.location.pathname);
      
      // navigate 호출
      navigate(targetPath);
      console.log('9. navigate 호출 완료');
      
      // navigate 호출 직후 상태 (동기적으로는 변하지 않을 수 있음)
      setTimeout(() => {
        console.log('10. 100ms 후 - pathname:', window.location.pathname);
        console.log('11. 100ms 후 - href:', window.location.href);
        console.log('12. 100ms 후 - 히스토리 길이:', window.history.length);
      }, 100);
      
      setTimeout(() => {
        console.log('13. 500ms 후 - pathname:', window.location.pathname);
        console.log('14. 500ms 후 - href:', window.location.href);
      }, 500);
      
    } catch (error) {
      console.error('navigate 실행 중 에러:', error);
      
      // 대체 방법 시도
      console.log('15. window.location.href로 대체 시도');
      window.location.href = targetPath;
    }
  };

  const openAddBookPage = () => {
    navigate('/textbook-add');
  };

  const getProgressPercentage = (currentPage, totalPages) => {
    return Math.round((currentPage / totalPages) * 100);
  };

  const getDaysRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getRecommendedDailyPages = (book) => {
    const remainingPages = book.totalPages - book.currentPage;
    const daysRemaining = getDaysRemaining(book.targetDate);
    if (daysRemaining <= 0) return 0;
    return Math.ceil(remainingPages / daysRemaining);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 통계 데이터 (로컬 데이터 기준)
  const stats = {
    total: books.length,
    reading: books.filter(b => b.status === '읽는 중').length,
    completed: books.filter(b => b.status === '완료').length,
    notStarted: books.filter(b => b.status === '미시작').length
  };

  const BookCard = ({ book }) => {
    const progressPercentage = getProgressPercentage(book.currentPage, book.totalPages);
    const recommendedPages = getRecommendedDailyPages(book);
    const daysRemaining = getDaysRemaining(book.targetDate);
    
    const statusStyles = {
      '읽는 중': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
      '완료': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
      '미시작': { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-400' }
    }[book.status];

    const handleDelete = (e) => {
      e.stopPropagation();
      if (window.confirm('정말 이 원서를 삭제하시겠습니까?')) {
        try {
          deleteTextbook(book.id);
        } catch (error) {
          console.error('원서 삭제 중 오류:', error);
          alert('원서 삭제 중 오류가 발생했습니다.');
        }
      }
    };

    return (
      <div 
        className="group bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden relative"
        onClick={() => openBookDetail(book)}
      >
        {/* API 검색 결과 표시 */}
        {searchMode === 'api' && !books.find(b => b.id === book.id || b.apiId === book.apiId) && (
          <div className="absolute top-2 right-2 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md">
            서버 검색 결과
          </div>
        )}

        {/* 카드 헤더 */}
        <div className="p-5 pb-4 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${statusStyles.dot}`}></div>
                <span className={`text-xs font-medium px-2 py-1 rounded-md ${statusStyles.bg} ${statusStyles.text}`}>
                  {book.status}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 text-lg leading-tight mb-1 group-hover:text-blue-600 transition-colors" title={book.title}>
                {getShortTitle(book.title)}
              </h3>
              <p className="text-sm text-slate-500">{book.author}</p>
            </div>
            <div className="flex items-center gap-1 ml-3">
              <button
                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                onClick={handleDelete}
                title="삭제"
              >
                <Trash2 size={16} />
              </button>
              <button className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-all">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 진행률 */}
        <div className="p-5 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">진행률</span>
            <span className="text-sm text-slate-500">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          {/* 통계 정보 */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">목표일</div>
              <div className="text-sm font-medium text-slate-700">{formatDate(book.targetDate)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">남은 일수</div>
              <div className={`text-sm font-medium ${daysRemaining < 7 ? 'text-red-600' : 'text-slate-700'}`}>
                {daysRemaining}일
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">일일 권장</div>
              <div className="text-sm font-medium text-blue-600">{recommendedPages}p</div>
            </div>
          </div>

          {/* 페이지 정보 */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
            <span>{book.currentPage}p 읽음</span>
            <span>총 {book.totalPages}p</span>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-slate-900 text-white py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                openBookDetail(book);
              }}
            >
              읽기 계속
            </Button>
            <button 
              className="px-3 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              노트
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleDeleteAll = () => {
    if (window.confirm('모든 원서 데이터를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.')) {
      try {
        localStorage.clear();
        setBooks([]);
        alert('모든 데이터가 삭제되었습니다.');
      } catch (error) {
        console.error('데이터 삭제 중 오류:', error);
        alert('데이터 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const cleanupOrphanedData = () => {
    try {
      // IndexedDB에서 고아 데이터 정리 (향후 구현)
      console.log('데이터 정리 기능은 추후 구현 예정');
      return 0;
    } catch (error) {
      console.error('정리 중 오류:', error);
      return 0;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 사이드바 공간 (필요시 추가) */}
      <div className="flex">
        {/* 메인 콘텐츠 */}
        <div className="flex-1">
          {/* 상단 바 */}
          <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
            <div className="px-4 md:px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* 페이지 제목 */}
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-slate-900">원서 관리</h1>
                  <p className="text-xs md:text-sm text-slate-600 mt-0.5">
                    학습 중인 원서를 관리하고 진행상황을 확인하세요
                    {searchMode === 'api' && (
                      <span className="ml-2 text-blue-600 font-medium">• 서버 검색 중</span>
                    )}
                  </p>
                </div>

                {/* 우측 액션 버튼들 */}
                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                  <button
                    className="px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                    onClick={() => {
                      const count = cleanupOrphanedData();
                      alert(count > 0 ? `${count}개 항목을 정리했습니다.` : '정리할 항목이 없습니다.');
                    }}
                  >
                    <Sparkles size={16} className="mr-1.5" />
                    정리
                  </button>
                  <button 
                    className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                    onClick={handleDeleteAll}
                  >
                    <Trash2 size={16} className="mr-1.5" />
                    전체 삭제
                  </button>
                  <Button 
                    onClick={openAddBookPage}
                    className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} />
                    새 원서
                  </Button>
                </div>
              </div>

              {/* 통계 카드들 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <BookOpen size={20} className="text-slate-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                      <div className="text-sm text-slate-500">전체 원서</div>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-900">{stats.reading}</div>
                      <div className="text-sm text-blue-600">읽는 중</div>
                    </div>
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Target size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-emerald-900">{stats.completed}</div>
                      <div className="text-sm text-emerald-600">완료</div>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Calendar size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-900">{stats.notStarted}</div>
                      <div className="text-sm text-orange-600">예정</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 컨트롤 바 */}
          <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* 검색 & 필터 */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="relative w-full sm:w-auto">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  {isSearching && (
                    <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" />
                  )}
                  <input
                    type="text"
                    placeholder="원서 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-10 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {['전체', '읽는 중', '완료', '미시작'].map(status => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        filterStatus === status 
                          ? 'bg-slate-900 text-white' 
                          : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* 결과 수 및 검색 상태 */}
              <div className="flex items-center gap-3 text-sm text-slate-500">
                {searchError && (
                  <div className="flex items-center gap-1 text-red-500">
                    <AlertCircle size={14} />
                    <span>검색 오류</span>
                  </div>
                )}
                <span>
                  {displayBooks.length}개의 원서
                  {searchMode === 'api' && searchQuery && (
                    <span className="ml-1 text-blue-600">(서버 검색)</span>
                  )}
                </span>
              </div>
            </div>
            
            {/* 검색 오류 메시지 */}
            {searchError && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                <strong>서버 검색 실패:</strong> {searchError}
                <div className="text-red-600 mt-1">로컬 검색 결과를 표시합니다.</div>
              </div>
            )}
          </div>

          {/* 메인 콘텐츠 영역 */}
          <div className="p-4 md:p-6">
            {contextLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-slate-400" />
                <span className="ml-2 text-slate-600">원서 목록을 불러오는 중...</span>
              </div>
            ) : displayBooks.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {searchQuery ? '검색 결과가 없습니다' : filterStatus === '전체' ? '아직 등록된 원서가 없습니다' : `${filterStatus} 상태의 원서가 없습니다`}
                </h3>
                <p className="text-slate-600 mb-6">
                  {searchQuery ? (
                    <>
                      "<strong>{searchQuery}</strong>"에 대한 검색 결과가 없습니다.
                      <br />다른 키워드로 검색해보세요.
                    </>
                  ) : '새로운 원서를 추가하여 학습을 시작해보세요.'}
                </p>
                {!searchQuery && filterStatus === '전체' && (
                  <button 
                    onClick={openAddBookPage}
                    className="bg-slate-900 text-white px-6 py-3 rounded-md font-medium hover:bg-slate-800 transition-colors"
                  >
                    첫 원서 추가하기
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayBooks.map(book => (
                  <BookCard key={`${searchMode}-${book.id}`} book={book} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
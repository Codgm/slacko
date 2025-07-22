import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { Plus, Book, Library } from 'lucide-react';

export default function TextbookManagement() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);

  // 컴포넌트 마운트 시 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const savedBooks = JSON.parse(localStorage.getItem('textbooks') || '[]');
    if (savedBooks.length === 0) {
      // 기본 데이터 설정
      const defaultBooks = [
        {
          id: 1,
          title: 'Operating Systems: Three Easy Pieces',
          author: 'Remzi H. Arpaci-Dusseau',
          publisher: 'CreateSpace',
          totalPages: 400,
          currentPage: 120,
          targetDate: '2025-07-30',
          status: '읽는 중',
          startDate: '2025-06-01',
          notes: [
            {
              id: 1,
              pageRange: '120-125',
              content: '컨텍스트 스위칭 설명 중요! CPU 상태 저장과 복원 과정 정리',
              date: '2025-06-20',
              keywords: ['컨텍스트 스위칭', 'CPU 상태']
            },
            {
              id: 2,
              pageRange: '126-135',
              content: 'CPU 스케줄링 정책 - FIFO, SJF, STCF 비교 분석',
              date: '2025-06-21',
              keywords: ['스케줄링', 'FIFO', 'SJF']
            }
          ],
          readingHistory: [
            { date: '2025-06-20', startPage: 100, endPage: 125, pagesRead: 25 },
            { date: '2025-06-21', startPage: 126, endPage: 135, pagesRead: 9 }
          ]
        },
        {
          id: 2,
          title: 'Deep Learning',
          author: 'Ian Goodfellow',
          publisher: 'MIT Press',
          totalPages: 775,
          currentPage: 245,
          targetDate: '2025-08-15',
          status: '읽는 중',
          startDate: '2025-05-15',
          notes: [
            {
              id: 1,
              pageRange: '200-245',
              content: 'Regularization 기법들 - L1, L2, Dropout의 차이점과 적용 사례',
              date: '2025-06-22',
              keywords: ['Regularization', 'L1', 'L2', 'Dropout']
            }
          ],
          readingHistory: [
            { date: '2025-06-22', startPage: 200, endPage: 245, pagesRead: 45 }
          ]
        },
        {
          id: 3,
          title: 'Introduction to Algorithms',
          author: 'Thomas H. Cormen',
          publisher: 'MIT Press',
          totalPages: 1312,
          currentPage: 1312,
          targetDate: '2025-06-01',
          status: '완료',
          startDate: '2025-01-01',
          notes: [
            {
              id: 1,
              pageRange: '전체',
              content: '알고리즘 기초부터 고급까지 완독 완료. 특히 동적 프로그래밍 파트가 유용했음',
              date: '2025-06-01',
              keywords: ['동적 프로그래밍', '그래프', '정렬']
            }
          ],
          readingHistory: []
        }
      ];
      setBooks(defaultBooks);
      localStorage.setItem('textbooks', JSON.stringify(defaultBooks));
    } else {
      setBooks(savedBooks);
    }
  }, []);

  const [filterStatus, setFilterStatus] = useState('전체');

  const openBookDetail = (book) => {
    // 상세 페이지로 이동
    navigate(`/textbook/${book.id}`);
  };

  const openAddBookPage = () => {
    // 새 원서 생성 페이지로 이동
    navigate('/textbook/add');
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

  const filteredBooks = books.filter(book => {
    if (filterStatus === '전체') return true;
    return book.status === filterStatus;
  });

  const BookCard = ({ book }) => {
    const progressPercentage = getProgressPercentage(book.currentPage, book.totalPages);
    const recommendedPages = getRecommendedDailyPages(book);
    const statusColor = {
      '읽는 중': 'bg-blue-100 text-blue-800 border-blue-200',
      '완료': 'bg-green-100 text-green-800 border-green-200',
      '미시작': 'bg-gray-100 text-gray-800 border-gray-200'
    }[book.status];

    const statusIcon = {
      '읽는 중': '📖',
      '완료': '✅',
      '미시작': '📚'
    }[book.status];

    // 원서 삭제 핸들러
    const handleDelete = (e) => {
      e.stopPropagation();
      if (window.confirm('정말 이 원서를 삭제하시겠습니까?')) {
        const savedBooks = JSON.parse(localStorage.getItem('textbooks') || '[]');
        const updatedBooks = savedBooks.filter(b => b.id !== book.id);
        localStorage.setItem('textbooks', JSON.stringify(updatedBooks));
        setBooks(updatedBooks);
      }
    };

    return (
      <div 
        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden hover:border-blue-200"
        onClick={() => openBookDetail(book)}
      >
        {/* 상단 이미지 영역 */}
        <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
          <div className="relative z-10 text-center">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-xs text-gray-600 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1">
              {book.publisher}
            </div>
          </div>
          {/* 상태 배지 */}
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
            <span className="mr-1">{statusIcon}</span>
            {book.status}
          </div>
          {/* 삭제 버튼 */}
          <button
            className="absolute top-3 left-3 bg-red-100 text-red-600 rounded-full px-2 py-1 text-xs font-semibold shadow hover:bg-red-200 transition"
            onClick={handleDelete}
            title="원서 삭제"
          >
            삭제
          </button>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="p-6">
          {/* 제목과 저자 */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-gray-600 flex items-center">
              <span className="mr-2">✍️</span>
              {book.author}
            </p>
          </div>

          {/* 진행률 */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">진행률</span>
              <span className="text-sm text-gray-500">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{book.currentPage}p</span>
              <span>{book.totalPages}p</span>
            </div>
          </div>

          {/* 학습 정보 */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">목표일</span>
              <span className="font-medium text-gray-700">{formatDate(book.targetDate)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">남은 일수</span>
              <span className={`font-medium ${getDaysRemaining(book.targetDate) < 7 ? 'text-red-600' : 'text-gray-700'}`}>
                {getDaysRemaining(book.targetDate)}일
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">일일 권장</span>
              <span className="font-medium text-blue-600">{recommendedPages}p</span>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2">
            <button 
              className="flex-1 bg-blue-50 text-blue-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                openBookDetail(book);
              }}
            >
              📖 읽기
            </button>
            <button 
              className="flex-1 bg-gray-50 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // 노트 보기 기능
              }}
            >
              📝 노트
            </button>
        </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 해더 */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-20 shadow-sm">
        <div className="max-w mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Book size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                원서 관리
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">진행 중인 원서들을 한눈에 관리하세요!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50/80 backdrop-blur px-3 py-2 rounded-xl border border-slate-200/50">
              <Library size={16} className="text-blue-500" />
              <span className="text-sm text-slate-600">총 12권</span>
            </div>
            <button 
              className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2 font-medium"
              onClick={openAddBookPage}
            >
              <Plus size={18} /> 새 원서
            </button>
          </div>
        </div>
      </div>
      
      {/* 메인 컨테이너 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          {/* 필터 */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-gray-700">상태별 필터:</span>
            </div>
            <div className="flex gap-3 flex-wrap">
            {['전체', '읽는 중', '완료', '미시작'].map(status => (
                <button
                key={status}
                onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    filterStatus === status 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-blue-300'
                  }`}
              >
                {status}
                </button>
            ))}
            </div>
          </div>
          
          {/* 원서 카드 리스트 */}
          {filteredBooks.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">아직 등록된 원서가 없습니다</h3>
              <p className="text-gray-500 mb-6">첫 번째 원서를 추가하고 학습을 시작해보세요!</p>
              <Button 
                onClick={openAddBookPage}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                첫 원서 추가하기
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
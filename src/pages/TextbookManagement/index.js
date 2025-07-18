import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { Book, Plus } from 'lucide-react';

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
      '읽는 중': 'bg-blue-100 text-blue-800',
      '완료': 'bg-green-100 text-green-800',
      '미시작': 'bg-gray-100 text-gray-800'
    }[book.status];

    return (
      <div 
        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
        onClick={() => openBookDetail(book)}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <Book className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{book.title}</h3>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColor}`}>
            {book.status}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-2">{book.author}</p>
        <div className="mb-2 text-xs text-gray-500">{book.publisher}</div>
        <div className="mb-2 text-xs text-gray-500">목표일: {formatDate(book.targetDate)}</div>
        <div className="mb-2 text-xs text-gray-500">누적: {book.currentPage}/{book.totalPages}p ({progressPercentage}%)</div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>남은 일수: {getDaysRemaining(book.targetDate)}일</span>
          <span>일일 권장: {recommendedPages}p</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 해더 */}
      <div className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 mb-0">
        <div className="max-w mx-auto px-4 py-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">원서 관리</h1>
            <p className="text-sm text-gray-600">진행 중인 원서들을 한눈에 관리하세요!</p>
          </div>
          <Button onClick={openAddBookPage} icon={<Plus />}>새 원서</Button>
        </div>
      </div>
      {/* 메인 컨테이너 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
          {/* 필터 */}
          <div className="mb-6 flex gap-2 flex-wrap">
            {['전체', '읽는 중', '완료', '미시작'].map(status => (
              <Button
                key={status}
                onClick={() => setFilterStatus(status)}
                variant={filterStatus === status ? 'primary' : 'ghost'}
                size="sm"
              >
                {status}
              </Button>
            ))}
          </div>
          {/* 원서 카드 리스트 */}
          {filteredBooks.length === 0 ? (
            <div className="text-center text-gray-400 py-12">아직 등록된 원서가 없습니다.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
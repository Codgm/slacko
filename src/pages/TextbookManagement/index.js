import { useState } from 'react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import { Book, Plus, X, FileText } from 'lucide-react';

export default function TextbookManagement() {
  const [books, setBooks] = useState([
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
  ]);

  const [selectedBook, setSelectedBook] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('전체');
  const [newReadingLog, setNewReadingLog] = useState({
    startPage: '',
    endPage: '',
    note: '',
    keywords: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const openBookDetail = (book) => {
    setSelectedBook(book);
    setIsDetailOpen(true);
  };

  const closeBookDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedBook(null), 300);
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

  const addReadingLog = (bookId) => {
    if (!newReadingLog.startPage || !newReadingLog.endPage) return;

    const startPage = parseInt(newReadingLog.startPage);
    const endPage = parseInt(newReadingLog.endPage);
    const pagesRead = endPage - startPage + 1;

    const newNote = {
      id: Date.now(),
      pageRange: `${startPage}-${endPage}`,
      content: newReadingLog.note,
      date: new Date().toISOString().split('T')[0],
      keywords: newReadingLog.keywords.split(',').map(k => k.trim()).filter(k => k)
    };

    const newHistory = {
      date: new Date().toISOString().split('T')[0],
      startPage,
      endPage,
      pagesRead
    };

    setBooks(books.map(book => {
      if (book.id === bookId) {
        return {
          ...book,
          currentPage: Math.max(book.currentPage, endPage),
          notes: [...book.notes, newNote],
          readingHistory: [...book.readingHistory, newHistory]
        };
      }
      return book;
    }));

    setNewReadingLog({
      startPage: '',
      endPage: '',
      note: '',
      keywords: ''
    });
    
    setToastMessage('독서 기록이 추가되었습니다!');
    setToastType('success');
    setShowToast(true);
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

  const BookDetail = ({ book }) => {
    if (!book) return null;
    const progressPercentage = getProgressPercentage(book.currentPage, book.totalPages);
    return (
      <div className={`fixed top-0 right-0 h-full w-full md:w-1/2 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isDetailOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">{book.title}</h2>
            <Button 
              onClick={closeBookDetail}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="p-6 space-y-6">
            {/* 기본 정보 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">📋 기본 정보</h3>
              <p className="text-gray-700 mb-2">{book.author} | {book.publisher}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>총 {book.totalPages}p</span>
                <span>목표일: {formatDate(book.targetDate)}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  book.status === '완료' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {book.status}
                </span>
              </div>
            </div>
            {/* 진도/노트 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-500">누적: {book.currentPage}/{book.totalPages}p</span>
                <span className="text-xs text-gray-500">({progressPercentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <h4 className="font-semibold text-sm mb-1">노트</h4>
              <ul className="space-y-2">
                {book.notes.map(note => (
                  <li key={note.id} className="bg-white rounded p-3 border border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span className="text-xs text-gray-700">{note.pageRange}p</span>
                      <span className="text-xs text-gray-400 ml-2">{note.date}</span>
                    </div>
                    <div className="text-sm text-gray-800 mb-1 whitespace-pre-line">{note.content}</div>
                    <div className="flex flex-wrap gap-1">
                      {note.keywords.map((kw, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">#{kw}</span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* 독서 기록 추가 */}
            <div className="mt-4">
              <h4 className="font-semibold text-sm mb-2">독서 기록 추가</h4>
              <div className="flex gap-2 mb-2">
                <input
                  type="number"
                  placeholder="시작 페이지"
                  value={newReadingLog.startPage}
                  onChange={e => setNewReadingLog(prev => ({ ...prev, startPage: e.target.value }))}
                  className="w-1/4 px-2 py-1 border border-gray-300 rounded text-xs"
                />
                <input
                  type="number"
                  placeholder="종료 페이지"
                  value={newReadingLog.endPage}
                  onChange={e => setNewReadingLog(prev => ({ ...prev, endPage: e.target.value }))}
                  className="w-1/4 px-2 py-1 border border-gray-300 rounded text-xs"
                />
                <input
                  type="text"
                  placeholder="노트"
                  value={newReadingLog.note}
                  onChange={e => setNewReadingLog(prev => ({ ...prev, note: e.target.value }))}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                />
                <input
                  type="text"
                  placeholder="키워드(,로 구분)"
                  value={newReadingLog.keywords}
                  onChange={e => setNewReadingLog(prev => ({ ...prev, keywords: e.target.value }))}
                  className="w-1/4 px-2 py-1 border border-gray-300 rounded text-xs"
                />
                <Button
                  onClick={() => addReadingLog(book.id)}
                  variant="primary"
                  size="sm"
                >
                  추가
                </Button>
              </div>
            </div>
            {/* 독서 이력 */}
            <div className="mt-4">
              <h4 className="font-semibold text-sm mb-2">독서 이력</h4>
              <ul className="space-y-1">
                {book.readingHistory.map((log, i) => (
                  <li key={i} className="text-xs text-gray-600">
                    {log.date}: {log.startPage}~{log.endPage} ({log.pagesRead}p)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 mb-8">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">원서 관리</h1>
                <p className="text-sm text-gray-600">진행 중인 원서들을 한눈에 관리하세요!</p>
              </div>
              <Button
                variant="primary"
                className="flex items-center gap-2"
                disabled
              >
                <Plus className="w-4 h-4" />
                새 원서(준비중)
              </Button>
            </div>
          </div>
        </div>
        {/* 필터 */}
        <div className="flex gap-2 mb-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
        {/* 원서 상세 슬라이드 */}
        <BookDetail book={selectedBook} />
      </div>
      
      {/* Toast 알림 */}
      <Toast
        open={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
      >
        {toastMessage}
      </Toast>
    </div>
  );
} 
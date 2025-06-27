import React, { useState } from 'react';
import { Book, Target, Plus, X, BookOpen, Clock, TrendingUp, FileText } from 'lucide-react';

const TextbookManagementSystem = () => {
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
  };

  const filteredBooks = books.filter(book => {
    if (filterStatus === '전체') return true;
    return book.status === filterStatus;
  });

  const BookCard = ({ book }) => {
    const progressPercentage = getProgressPercentage(book.currentPage, book.totalPages);
    const daysRemaining = getDaysRemaining(book.targetDate);
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
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>읽기 진도</span>
            <span>{book.currentPage} / {book.totalPages}p ({progressPercentage}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Target className="w-4 h-4 mr-2" />
            <span>목표: {formatDate(book.targetDate)}까지</span>
            {daysRemaining > 0 && book.status !== '완료' && (
              <span className="ml-2 text-orange-600 font-medium">⏳ D-{daysRemaining}</span>
            )}
          </div>
          
          {book.status === '읽는 중' && recommendedPages > 0 && (
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span>권장: 하루 {recommendedPages}페이지</span>
            </div>
          )}
          
          <div className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            <span>노트: {book.notes.length}개</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            읽기 기록 →
          </button>
        </div>
      </div>
    );
  };

  const BookDetail = ({ book }) => {
    if (!book) return null;

    const progressPercentage = getProgressPercentage(book.currentPage, book.totalPages);
    const daysRemaining = getDaysRemaining(book.targetDate);
    const recommendedPages = getRecommendedDailyPages(book);

    return (
      <div className={`fixed top-0 right-0 h-full w-2/3 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isDetailOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{book.title}</h2>
              <p className="text-gray-600">{book.author}</p>
            </div>
            <button 
              onClick={closeBookDetail}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* 진도 현황 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                진도 현황
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{book.currentPage}</div>
                  <div className="text-sm text-gray-600">현재 페이지</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{progressPercentage}%</div>
                  <div className="text-sm text-gray-600">완료율</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              {book.status === '읽는 중' && (
                <div className="mt-3 flex justify-between text-sm">
                  <span>남은 페이지: {book.totalPages - book.currentPage}p</span>
                  <span>권장 속도: 하루 {recommendedPages}p</span>
                </div>
              )}
            </div>

            {/* 오늘 읽은 범위 입력 */}
            {book.status === '읽는 중' && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3">📖 오늘 읽은 범위 기록</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">시작 페이지</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="예: 120"
                      value={newReadingLog.startPage}
                      onChange={(e) => setNewReadingLog({...newReadingLog, startPage: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">끝 페이지</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="예: 135"
                      value={newReadingLog.endPage}
                      onChange={(e) => setNewReadingLog({...newReadingLog, endPage: e.target.value})}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">요약/노트</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="읽은 내용의 요약이나 중요한 포인트를 기록하세요..."
                    value={newReadingLog.note}
                    onChange={(e) => setNewReadingLog({...newReadingLog, note: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">키워드 (쉼표로 구분)</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 컨텍스트 스위칭, CPU 스케줄링"
                    value={newReadingLog.keywords}
                    onChange={(e) => setNewReadingLog({...newReadingLog, keywords: e.target.value})}
                  />
                </div>
                <button
                  onClick={() => addReadingLog(book.id)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  기록 추가
                </button>
              </div>
            )}

            {/* 읽기 노트 */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                읽기 노트 ({book.notes.length})
              </h3>
              <div className="space-y-3">
                {book.notes.map(note => (
                  <div key={note.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {note.pageRange}p
                        </span>
                        <span className="text-sm text-gray-500">{formatDate(note.date)}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{note.content}</p>
                    {note.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {note.keywords.map((keyword, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            #{keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 읽기 히스토리 */}
            {book.readingHistory.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  읽기 히스토리
                </h3>
                <div className="space-y-2">
                  {book.readingHistory.slice(-5).reverse().map((history, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">{formatDate(history.date)}</span>
                      <span className="text-sm">{history.startPage}p - {history.endPage}p</span>
                      <span className="text-sm font-medium text-green-600">+{history.pagesRead}p</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 배경 오버레이 */}
      {isDetailOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeBookDetail}
        />
      )}

      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📚 원서 관리</h1>
              <p className="text-gray-600">전공 서적 읽기 진도를 관리하세요</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              새 원서 추가
            </button>
          </div>
        </div>
      </div>

      {/* 필터 */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex space-x-2">
          {['전체', '읽는 중', '완료', '미시작'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 원서 카드 목록 */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>

      {/* 원서 상세 슬라이드 패널 */}
      <BookDetail book={selectedBook} />
    </div>
  );
};

export default TextbookManagementSystem;
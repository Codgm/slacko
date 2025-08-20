// TextbookApi.js - 백엔드 API와 통신하는 서비스 모듈

const API_BASE_URL = 'https://cffdb44bbd9c.ngrok-free.app/api';

class TextbookApi {
  
  // HTTP 요청 헬퍼 함수
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('API 요청 URL:', url);
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      console.log('API 응답 상태:', response.status, response.statusText);
      console.log('API 응답 헤더:', response.headers.get('content-type'));
      
      // 응답 텍스트 미리 확인
      const responseText = await response.text();
      console.log('응답 내용 (첫 200자):', responseText.slice(0, 200));
      
      // HTML 응답인지 확인
      if (responseText.trim().startsWith('<!DOCTYPE html>') || responseText.trim().startsWith('<html')) {
        throw new Error(`서버가 HTML 페이지를 반환했습니다. ngrok URL이나 서버 상태를 확인해주세요.`);
      }
      
      // 빈 응답 처리
      if (!responseText.trim()) {
        if (response.ok) {
          return {}; // 성공했지만 빈 응답인 경우
        } else {
          throw new Error(`서버 오류 (${response.status}): 응답 내용이 없습니다.`);
        }
      }
      
      // JSON 파싱 시도
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`JSON 파싱 실패: ${parseError.message}. 응답: ${responseText.slice(0, 100)}...`);
      }
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
      
    } catch (error) {
      console.error(`API 요청 실패 (${endpoint}):`, error);
      
      // 네트워크 오류 구분
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('네트워크 연결 오류: 서버에 접근할 수 없습니다. URL과 서버 상태를 확인해주세요.');
      }
      
      throw error;
    }
  }

  // 1. 원서 등록 (POST /api/books)
  async createBook(bookData) {
    console.log('📚 책 등록 요청:', bookData);
    return await this.request('/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  }

  // 2. 모든 책 조회 (GET /api/books)
  async getAllBooks() {
    console.log('📚 모든 책 조회 요청');
    return await this.request('/books');
  }

  // 3. 특정 책 조회 (GET /api/books/{bookId})
  async getBookById(bookId) {
    console.log('📚 특정 책 조회 요청:', bookId);
    return await this.request(`/books/${bookId}`);
  }

  // 4. 책 수정 (PUT /api/books/{bookId})
  async updateBook(bookId, bookData) {
    console.log('📚 책 수정 요청:', bookId, bookData);
    return await this.request(`/books/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
  }

  // 5. 책 삭제 (DELETE /api/books/{bookId})
  async deleteBook(bookId) {
    console.log('📚 책 삭제 요청:', bookId);
    return await this.request(`/books/${bookId}`, {
      method: 'DELETE',
    });
  }

  // 6. 키워드로 책 검색 (GET /api/books/search?keyword={keyword})
  async searchBooksByKeyword(keyword) {
    console.log('📚 키워드 검색 요청:', keyword);
    return await this.request(`/books/search?keyword=${encodeURIComponent(keyword)}`);
  }

  // 7. 제목으로 책 검색 (GET /api/books/search/title?title={title})
  async searchBooksByTitle(title) {
    console.log('📚 제목 검색 요청:', title);
    return await this.request(`/books/search/title?title=${encodeURIComponent(title)}`);
  }

  // 8. 저자로 책 검색 (GET /api/books/search/author?author={author})
  async searchBooksByAuthor(author) {
    console.log('📚 저자 검색 요청:', author);
    return await this.request(`/books/search/author?author=${encodeURIComponent(author)}`);
  }

  // 9. 현재 학습 중인 책들 조회 (GET /api/books/active)
  async getActiveBooks() {
    console.log('📚 활성 책 조회 요청');
    return await this.request('/books/active');
  }

  // 11. 학습 시작일이 임박한 책들 조회 (GET /api/books/starting-soon?days={days})
  async getBooksStartingSoon(days) {
    if (typeof days !== 'number' || days < 0) {
      throw new Error('days는 0 이상의 숫자여야 합니다.');
    }
    console.log('📚 임박한 책 조회 요청:', days);
    return await this.request(`/books/starting-soon?days=${days}`);
  }

  // 서버 상태 확인 (새로운 메서드)
  async checkServerStatus() {
    try {
      const response = await fetch(API_BASE_URL.replace('/api', ''), {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      
      const text = await response.text();
      console.log('서버 상태 응답:', response.status, text.slice(0, 200));
      
      return {
        status: response.status,
        isHtml: text.trim().startsWith('<!DOCTYPE html>') || text.trim().startsWith('<html'),
        content: text.slice(0, 200)
      };
      
    } catch (error) {
      console.error('서버 상태 확인 실패:', error);
      throw error;
    }
  }

  // URL 유효성 검사
  validateApiUrl() {
    try {
      const url = new URL(API_BASE_URL);
      console.log('API URL 검증:', {
        protocol: url.protocol,
        hostname: url.hostname,
        pathname: url.pathname,
        full: API_BASE_URL
      });
      
      if (!url.hostname.includes('ngrok')) {
        console.warn('⚠️ ngrok URL이 아닌 것 같습니다:', url.hostname);
      }
      
      return true;
    } catch (error) {
      console.error('❌ 잘못된 API URL:', API_BASE_URL, error);
      return false;
    }
  }

  // 프론트엔드 데이터를 백엔드 API 형식으로 변환
  transformToApiFormat(frontendBook) {
    // 플랜 데이터를 챕터 형식으로 변환
    const chapters = frontendBook.plan?.map((planItem, index) => ({
      title: planItem.title || planItem.chapter || `Chapter ${index + 1}`,
      chapterNumber: index + 1,
      sectionNumber: `${index + 1}`,
      startPage: this.calculateChapterStartPage(frontendBook, index),
      endPage: this.calculateChapterEndPage(frontendBook, index),
      estimatedStudyTime: planItem.estimatedTime || 120, // 기본 2시간
      description: planItem.description || planItem.memo || ''
    })) || [];

    return {
      isbn: frontendBook.isbn || this.generateFakeISBN(),
      title: frontendBook.title,
      author: frontendBook.author || 'Unknown Author',
      publisher: frontendBook.publisher || 'Unknown Publisher',
      totalPages: frontendBook.totalPages,
      studyStartDate: frontendBook.startDate,
      studyEndDate: frontendBook.targetDate,
      chapters: chapters
    };
  }

  // 백엔드 API 응답을 프론트엔드 형식으로 변환
  transformFromApiFormat(apiBook) {
    // 챕터 데이터를 플랜 형식으로 변환
    const plan = apiBook.chapters?.map((chapter, index) => ({
      id: `plan-${chapter.id || index}`,
      chapter: chapter.title,
      description: chapter.description,
      date: this.calculatePlanDate(apiBook.studyStartDate, index, apiBook.chapters.length),
      completed: false,
      createdAt: new Date().toISOString(),
      intensity: '보통',
      estimatedTime: chapter.estimatedStudyTime || 120,
      priority: index === 0 ? 'high' : 'normal',
      week: Math.ceil((index + 1) / 2)
    })) || [];

    return {
      id: apiBook.id,
      title: apiBook.title,
      author: apiBook.author,
      publisher: apiBook.publisher,
      totalPages: apiBook.totalPages,
      currentPage: 1,
      targetDate: apiBook.studyEndDate,
      status: apiBook.studyPeriodActive ? '읽는 중' : '미시작',
      startDate: apiBook.studyStartDate,
      notes: [],
      readingHistory: [],
      plan: plan,
      subject: '',
      tableOfContents: [],
      studyTime: 0,
      progress: apiBook.progressPercentage || 0,
      lastStudiedAt: apiBook.updatedAt || new Date().toISOString(),
      createdAt: apiBook.createdAt || new Date().toISOString(),
      totalStudyTime: 0,
      noteCount: 0,
      highlightCount: 0,
      estimatedTotalTime: plan.reduce((acc, item) => acc + item.estimatedTime, 0),
      // API 특정 필드들
      isbn: apiBook.isbn,
      studyDays: apiBook.studyDays,
      apiId: apiBook.id // 원본 API ID 보존
    };
  }

  // 헬퍼 함수들
  calculateChapterStartPage(book, chapterIndex) {
    const pagesPerChapter = Math.ceil(book.totalPages / (book.plan?.length || 1));
    return (chapterIndex * pagesPerChapter) + 1;
  }

  calculateChapterEndPage(book, chapterIndex) {
    const pagesPerChapter = Math.ceil(book.totalPages / (book.plan?.length || 1));
    const endPage = (chapterIndex + 1) * pagesPerChapter;
    return Math.min(endPage, book.totalPages);
  }

  calculatePlanDate(startDate, index, totalChapters) {
    const start = new Date(startDate);
    const daysPerChapter = 7; // 일주일에 한 챕터 기본
    const targetDate = new Date(start);
    targetDate.setDate(start.getDate() + (index * daysPerChapter));
    return targetDate.toISOString().split('T')[0];
  }

  generateFakeISBN() {
    // 간단한 fake ISBN 생성
    const timestamp = Date.now().toString();
    return '978' + timestamp.slice(-10);
  }
}

export default new TextbookApi();
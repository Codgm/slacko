// TextbookApi.js - 백엔드 API와 통신하는 서비스 모듈 (JSON Server Fallback 지원)

class TextbookApi {
  
  constructor() {
    // 환경 변수 확인
    const isDev = process.env.NODE_ENV === 'development';
    const useMock = process.env.REACT_APP_USE_MOCK === 'true';
    const ngrokUrl = process.env.REACT_APP_NGROK_URL || 'https://a1d862e78d7d.ngrok-free.app';
    const jsonServerUrl = process.env.REACT_APP_JSON_SERVER_URL || 'http://localhost:3001';

    // 우선순위: ngrok > JSON Server
    this.primaryURL = ngrokUrl;
    this.fallbackURL = jsonServerUrl;
    this.currentURL = this.primaryURL;
    
    console.log('🔧 API 설정:', {
      primary: this.primaryURL,
      fallback: this.fallbackURL,
      current: this.currentURL,
      isDev,
      useMock
    });
  }
  
  // HTTP 요청 헬퍼 함수 - Fallback 지원
  async request(endpoint, options = {}) {
    // 첫 번째 시도: Primary URL (ngrok)
    try {
      return await this.makeRequest(this.primaryURL, endpoint, options);
    } catch (primaryError) {
      console.warn('⚠️ Primary 서버 연결 실패, Fallback으로 전환:', primaryError.message);
      
      // 두 번째 시도: Fallback URL (JSON Server)
      try {
        this.currentURL = this.fallbackURL;
        const result = await this.makeRequest(this.fallbackURL, endpoint, options);
        console.log('✅ Fallback 서버로 성공적으로 연결됨');
        return result;
      } catch (fallbackError) {
        console.error('❌ 모든 서버 연결 실패');
        throw new Error(`모든 서버에 연결할 수 없습니다. Primary: ${primaryError.message}, Fallback: ${fallbackError.message}`);
      }
    }
  }

  async makeRequest(baseURL, endpoint, options = {}) {
    const url = `${baseURL}${endpoint.startsWith('/api') ? '' : '/api'}${endpoint}`;
    console.log('API 요청 URL:', url);
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    console.log('API 응답 상태:', response.status, response.statusText);
    
    // 응답 텍스트 미리 확인
    const responseText = await response.text();
    console.log('응답 내용 (첫 200자):', responseText.slice(0, 200));
    
    // HTML 응답인지 확인
    if (responseText.trim().startsWith('<!DOCTYPE html>') || responseText.trim().startsWith('<html')) {
      throw new Error(`서버가 HTML 페이지를 반환했습니다. 서버 상태를 확인해주세요.`);
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

  // 서버 상태 확인
  async checkServerStatus() {
    try {
      console.log('🔌 서버 상태 확인 중...');
      
      // Primary 서버 확인
      try {
        const primaryResult = await this.makeRequest(this.primaryURL, '/health', { method: 'GET' });
        return {
          success: true,
          server: 'primary',
          url: this.primaryURL,
          data: primaryResult
        };
      } catch (primaryError) {
        console.log('Primary 서버 연결 실패, Fallback 확인 중...');
        
        // Fallback 서버 확인
        const fallbackResult = await this.makeRequest(this.fallbackURL, '/health', { method: 'GET' });
        this.currentURL = this.fallbackURL;
        return {
          success: true,
          server: 'fallback',
          url: this.fallbackURL,
          data: fallbackResult
        };
      }
      
    } catch (error) {
      console.error('서버 상태 확인 실패:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 연결 테스트 함수
  async testConnection() {
    try {
      console.log('🔌 서버 연결 테스트 시작...');
      
      const response = await this.request('/books?limit=1');
      
      console.log('✅ 서버 연결 성공');
      return { 
        success: true, 
        message: `서버 연결 성공 (${this.currentURL})`,
        server: this.currentURL === this.primaryURL ? 'primary' : 'fallback',
        booksCount: Array.isArray(response) ? response.length : 0
      };
      
    } catch (error) {
      console.error('❌ 서버 연결 실패:', error);
      return { 
        success: false, 
        message: error.message,
        details: error.stack
      };
    }
  }

  // 프론트엔드 데이터를 백엔드 API 형식으로 변환
  transformToApiFormat(frontendBook) {
    console.log('🔄 API 형식 변환 시작:', {
      title: frontendBook.title,
      hasChapters: !!frontendBook.chapters,
      hasPlan: !!frontendBook.plan
    });

    // 챕터 데이터 생성 (plan이나 chapters에서)
    let chapters = [];
    
    if (frontendBook.chapters && frontendBook.chapters.length > 0) {
      chapters = frontendBook.chapters.map((chapter, index) => ({
        title: chapter.title || `Chapter ${index + 1}`,
        chapterNumber: chapter.chapterNumber || (index + 1),
        sectionNumber: chapter.sectionNumber || `${index + 1}`,
        startPage: chapter.startPage || this.calculateChapterStartPage(frontendBook, index),
        endPage: chapter.endPage || this.calculateChapterEndPage(frontendBook, index),
        estimatedStudyTime: chapter.estimatedStudyTime || 120,
        description: chapter.description || chapter.title || `Chapter ${index + 1} 학습`
      }));
    } else if (frontendBook.plan && frontendBook.plan.length > 0) {
      chapters = frontendBook.plan.map((planItem, index) => ({
        title: planItem.chapter || planItem.title || `Chapter ${index + 1}`,
        chapterNumber: index + 1,
        sectionNumber: `${index + 1}`,
        startPage: this.calculateChapterStartPage(frontendBook, index),
        endPage: this.calculateChapterEndPage(frontendBook, index),
        estimatedStudyTime: planItem.estimatedTime || 120,
        description: planItem.description || planItem.memo || `${planItem.chapter || planItem.title} 학습`
      }));
    } else {
      const defaultChapterCount = Math.min(10, Math.ceil(frontendBook.totalPages / 50));
      chapters = Array.from({ length: defaultChapterCount }, (_, index) => ({
        title: `Chapter ${index + 1}`,
        chapterNumber: index + 1,
        sectionNumber: `${index + 1}`,
        startPage: this.calculateChapterStartPage({ ...frontendBook, totalChapters: defaultChapterCount }, index),
        endPage: this.calculateChapterEndPage({ ...frontendBook, totalChapters: defaultChapterCount }, index),
        estimatedStudyTime: 120,
        description: `Chapter ${index + 1} 학습`
      }));
    }

    const apiData = {
      isbn: frontendBook.isbn || this.generateFakeISBN(),
      title: frontendBook.title,
      author: frontendBook.author || 'Unknown Author',
      publisher: frontendBook.publisher || 'Unknown Publisher',
      totalPages: frontendBook.totalPages,
      studyStartDate: frontendBook.startDate,
      studyEndDate: frontendBook.targetDate,
      chapters: chapters
    };

    console.log('✅ API 형식 변환 완료:', {
      title: apiData.title,
      author: apiData.author,
      totalPages: apiData.totalPages,
      chaptersCount: apiData.chapters.length,
      studyPeriod: `${apiData.studyStartDate} ~ ${apiData.studyEndDate}`
    });

    return apiData;
  }

  // 백엔드 API 응답을 프론트엔드 형식으로 변환
  transformFromApiFormat(apiBook) {
    console.log('🔄 프론트엔드 형식 변환 시작:', {
      id: apiBook.id,
      title: apiBook.title,
      chaptersCount: apiBook.chapters?.length || 0
    });

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

    const frontendBook = {
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
      apiId: apiBook.id, // 원본 API ID 보존
      
      // 추가 계산된 필드들
      daysLeft: this.calculateDaysLeft(apiBook.studyEndDate),
      purpose: '전공 학습',
      intensity: '보통'
    };

    console.log('✅ 프론트엔드 형식 변환 완료:', {
      id: frontendBook.id,
      title: frontendBook.title,
      planCount: frontendBook.plan.length,
      estimatedTotalTime: frontendBook.estimatedTotalTime,
      daysLeft: frontendBook.daysLeft
    });

    return frontendBook;
  }

  // 헬퍼 함수들
  calculateChapterStartPage(book, chapterIndex) {
    const totalChapters = book.totalChapters || book.plan?.length || book.chapters?.length || 1;
    const pagesPerChapter = Math.ceil(book.totalPages / totalChapters);
    return (chapterIndex * pagesPerChapter) + 1;
  }

  calculateChapterEndPage(book, chapterIndex) {
    const totalChapters = book.totalChapters || book.plan?.length || book.chapters?.length || 1;
    const pagesPerChapter = Math.ceil(book.totalPages / totalChapters);
    const endPage = (chapterIndex + 1) * pagesPerChapter;
    return Math.min(endPage, book.totalPages);
  }

  calculatePlanDate(startDate, index, totalChapters) {
    const start = new Date(startDate);
    const daysPerChapter = 7;
    const targetDate = new Date(start);
    targetDate.setDate(start.getDate() + (index * daysPerChapter));
    return targetDate.toISOString().split('T')[0];
  }

  calculateDaysLeft(endDate) {
    const today = new Date();
    const target = new Date(endDate);
    const diffTime = target - today;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  generateFakeISBN() {
    const timestamp = Date.now().toString();
    return '978' + timestamp.slice(-10);
  }
}

const textbookApi = new TextbookApi();
export default textbookApi;
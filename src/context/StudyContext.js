import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiService from '../api/Textbook_Api';

const StudyContext = createContext();

export const useStudyContext = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudyContext must be used within a StudyProvider');
  }
  return context;
};

export const StudyProvider = ({ children }) => {
  // 학습 과목 데이터 (기존 유지)
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: '알고리즘',
      category: 'major',
      color: 'blue',
      priority: 'high',
      difficulty: 4,
      totalChapters: 10,
      completedChapters: 6,
      targetCompletionDate: '2025-09-15',
      dailyGoal: 120,
      weeklyGoal: '2챕터 완료',
      totalStudyTime: 1240,
      currentStreak: 7,
      lastStudyDate: '2025-08-02',
      chapters: [
        { id: 1, name: '배열과 문자열', completed: true, memo: '기본 개념 완료', timeSpent: 180, difficulty: 3, lastStudied: '2025-07-28' },
        { id: 2, name: '연결 리스트', completed: true, memo: '구현 연습 완료', timeSpent: 240, difficulty: 4, lastStudied: '2025-07-30' },
        { id: 3, name: '스택과 큐', completed: true, memo: '', timeSpent: 150, difficulty: 3, lastStudied: '2025-07-31' },
        { id: 4, name: '트리 구조', completed: true, memo: '이진트리 중점 학습', timeSpent: 300, difficulty: 5, lastStudied: '2025-08-01' },
        { id: 5, name: '그래프', completed: true, memo: '', timeSpent: 280, difficulty: 5, lastStudied: '2025-08-02' },
        { id: 6, name: '정렬 알고리즘', completed: true, memo: '퀵정렬, 버블정렬 완료', timeSpent: 190, difficulty: 4, lastStudied: '2025-08-02' },
        { id: 7, name: '탐색 알고리즘', completed: false, memo: '', timeSpent: 0, difficulty: 4, lastStudied: null },
        { id: 8, name: '동적 프로그래밍', completed: false, memo: '', timeSpent: 0, difficulty: 5, lastStudied: null },
        { id: 9, name: '그리디 알고리즘', completed: false, memo: '', timeSpent: 0, difficulty: 4, lastStudied: null },
        { id: 10, name: '백트래킹', completed: false, memo: '', timeSpent: 0, difficulty: 5, lastStudied: null }
      ]
    },
    {
      id: 2,
      name: '캡스톤 프로젝트',
      category: 'project',
      color: 'green',
      priority: 'high',
      difficulty: 5,
      totalChapters: 8,
      completedChapters: 3,
      targetCompletionDate: '2025-12-01',
      dailyGoal: 180,
      weeklyGoal: '1단계 완료',
      totalStudyTime: 2160,
      currentStreak: 12,
      lastStudyDate: '2025-08-02',
      chapters: [
        { id: 1, name: '주제 선정', completed: true, memo: 'AI 챗봇 서비스로 결정', timeSpent: 120, difficulty: 2, lastStudied: '2025-07-25' },
        { id: 2, name: '요구사항 분석', completed: true, memo: '사용자 스토리 작성 완료', timeSpent: 480, difficulty: 4, lastStudied: '2025-07-27' },
        { id: 3, name: 'UI/UX 설계', completed: true, memo: 'Figma 프로토타입 완성', timeSpent: 360, difficulty: 4, lastStudied: '2025-07-29' },
        { id: 4, name: '백엔드 설계', completed: false, memo: '', timeSpent: 0, difficulty: 5, lastStudied: null },
        { id: 5, name: '프론트엔드 개발', completed: false, memo: '', timeSpent: 0, difficulty: 5, lastStudied: null },
        { id: 6, name: '백엔드 개발', completed: false, memo: '', timeSpent: 0, difficulty: 5, lastStudied: null },
        { id: 7, name: '테스트 및 배포', completed: false, memo: '', timeSpent: 0, difficulty: 4, lastStudied: null },
        { id: 8, name: '최종 발표 준비', completed: false, memo: '', timeSpent: 0, difficulty: 3, lastStudied: null }
      ]
    },
    {
      id: 3,
      name: '토익 준비',
      category: 'certificate',
      color: 'purple',
      priority: 'medium',
      difficulty: 3,
      totalChapters: 12,
      completedChapters: 4,
      targetCompletionDate: '2025-10-20',
      dailyGoal: 90,
      weeklyGoal: '3파트 완료',
      totalStudyTime: 720,
      currentStreak: 5,
      lastStudyDate: '2025-08-01',
      chapters: [
        { id: 1, name: 'Part 1 사진 묘사', completed: true, memo: '기본 패턴 암기 완료', timeSpent: 120, difficulty: 2, lastStudied: '2025-07-22' },
        { id: 2, name: 'Part 2 응답 선택', completed: true, memo: 'WH 질문 연습', timeSpent: 150, difficulty: 3, lastStudied: '2025-07-24' },
        { id: 3, name: 'Part 3 대화 듣기', completed: true, memo: '키워드 파악 연습', timeSpent: 180, difficulty: 4, lastStudied: '2025-07-26' },
        { id: 4, name: 'Part 4 설명문 듣기', completed: true, memo: '', timeSpent: 160, difficulty: 4, lastStudied: '2025-07-28' },
        { id: 5, name: 'Part 5 문법', completed: false, memo: '', timeSpent: 0, difficulty: 3, lastStudied: null },
        { id: 6, name: 'Part 6 빈칸 추론', completed: false, memo: '', timeSpent: 0, difficulty: 4, lastStudied: null },
        { id: 7, name: 'Part 7 독해', completed: false, memo: '', timeSpent: 0, difficulty: 5, lastStudied: null },
        { id: 8, name: '단어 암기 1000개', completed: false, memo: '', timeSpent: 0, difficulty: 2, lastStudied: null },
        { id: 9, name: '모의고사 1회', completed: false, memo: '', timeSpent: 0, difficulty: 4, lastStudied: null },
        { id: 10, name: '모의고사 2회', completed: false, memo: '', timeSpent: 0, difficulty: 4, lastStudied: null },
        { id: 11, name: '모의고사 3회', completed: false, memo: '', timeSpent: 0, difficulty: 4, lastStudied: null },
        { id: 12, name: '최종 정리', completed: false, memo: '', timeSpent: 0, difficulty: 3, lastStudied: null }
      ]
    }
  ]);

  // 학습 기록 데이터
  const [studyLogs, setStudyLogs] = useState([
    { id: 1, subjectId: 1, chapterId: 6, date: '2025-08-02', duration: 45, content: '정렬 알고리즘 복습 및 문제 풀이' },
    { id: 2, subjectId: 1, chapterId: 5, date: '2025-08-02', duration: 60, content: '그래프 알고리즘 학습' },
    { id: 3, subjectId: 2, chapterId: 3, date: '2025-07-29', duration: 120, content: 'UI/UX 설계 완료' },
    { id: 4, subjectId: 3, chapterId: 4, date: '2025-07-28', duration: 90, content: 'Part 4 설명문 듣기 연습' }
  ]);

  // 목표 데이터
  const [goals, setGoals] = useState([
    { id: 1, type: 'daily', target: 180, current: 105, description: '일일 학습 시간' },
    { id: 2, type: 'weekly', target: 2, current: 1, description: '완료할 챕터 수' },
    { id: 3, type: 'monthly', target: 8, current: 6, description: '완료할 챕터 수' }
  ]);

  // 학습 이벤트 데이터
  const [studyEvents, setStudyEvents] = useState([
    {
      id: 1,
      title: '알고리즘 7강 듣기',
      type: 'study',
      date: '2025-08-03',
      time: '14:00',
      duration: 2,
      repeat: 'none',
      memo: '중요 개념: 탐색 알고리즘',
      completed: false,
      subjectId: 1,
      chapterId: 7
    },
    {
      id: 2,
      title: '토익 Part 5 문법 연습',
      type: 'study',
      date: '2025-08-04',
      time: '10:00',
      duration: 1.5,
      repeat: 'none',
      memo: '문법 패턴 암기',
      completed: false,
      subjectId: 3,
      chapterId: 5
    },
    {
      id: 3,
      title: '캡스톤 백엔드 설계',
      type: 'study',
      date: '2025-08-05',
      time: '15:00',
      duration: 3,
      repeat: 'none',
      memo: 'API 설계 및 데이터베이스 설계',
      completed: false,
      subjectId: 2,
      chapterId: 4
    }
  ]);

  // 원서 학습 데이터 - 하이브리드 방식 (서버 + 로컬)
  const [textbooks, setTextbooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startingSoonBooks, setStartingSoonBooks] = useState([]);
  const [serverConnected, setServerConnected] = useState(null);

  // 로컬 데이터 관리 함수들
  const saveLocalBookData = useCallback((bookId, data) => {
    try {
      const localDataKey = `book_local_${bookId}`;
      localStorage.setItem(localDataKey, JSON.stringify(data));
      console.log('💾 로컬 데이터 저장 완료:', localDataKey);
    } catch (error) {
      console.error('로컬 데이터 저장 실패:', error);
    }
  }, []);

  const getLocalBookData = useCallback((bookId) => {
    try {
      const localDataKey = `book_local_${bookId}`;
      const localData = localStorage.getItem(localDataKey);

      if (localData) {
        const parsed = JSON.parse(localData);
        console.log('📋 로컬 데이터 발견:', localDataKey, {
          hasPdfFile: !!parsed.file,
          pdfId: parsed.pdfId,
          notesCount: (parsed.notes || []).length,
          planCount: (parsed.plan || []).length
        });
        return parsed;
      }

      // 기존 방식 호환성 - 직접 textbooks에서 찾기
      const oldTextbooks = JSON.parse(localStorage.getItem('textbooks') || '[]');
      const book = oldTextbooks.find(b => b.id === bookId);

      if (book && (book.file || book.pdfId || book.notes)) {
        console.log('🔄 기존 방식 데이터 발견, 마이그레이션:', book.title);

        // 새 방식으로 마이그레이션
        const localData = {
          file: book.file,
          pdfId: book.pdfId,
          notes: book.notes || [],
          readingHistory: book.readingHistory || [],
          plan: book.plan || []
        };

        // 인라인으로 저장
        const localDataKey2 = `book_local_${bookId}`;
        localStorage.setItem(localDataKey2, JSON.stringify(localData));
        console.log('💾 마이그레이션 저장 완료:', localDataKey2);
        
        return localData;
      }

      return {};
    } catch (error) {
      console.error('로컬 데이터 읽기 실패:', error);
      return {};
    }
  }, []);

  const removeLocalBookData = useCallback((bookId) => {
    try {
      const localDataKey = `book_local_${bookId}`;
      localStorage.removeItem(localDataKey);

      console.log('🗑️ 로컬 데이터 삭제 완료:', bookId);
    } catch (error) {
      console.error('로컬 데이터 삭제 실패:', error);
    }
  }, []);

  // 서버 연결 상태 확인
  const checkServerConnection = useCallback(async () => {
    try {
      const result = await apiService.testConnection();
      setServerConnected(result.success);
      return result;
    } catch (error) {
      setServerConnected(false);
      return { success: false, message: error.message };
    }
  }, []);

  // 원서 데이터 로드 (서버 + 로컬 병합)
  const loadTextbooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📚 하이브리드 원서 데이터 로드 시작');
      
      // 1. 서버 연결 확인
      const connectionStatus = await checkServerConnection();
      console.log('🔗 서버 연결 상태:', connectionStatus.success ? '성공' : '실패');
      
      let mergedBooks = [];
      
      if (connectionStatus.success) {
        try {
          // 2. 서버에서 원서 목록 가져오기
          console.log('🌐 서버에서 원서 목록 로드 중...');
          const apiBooks = await apiService.getAllBooks();
          console.log('📚 서버 원서 개수:', apiBooks.length);
          
          // 3. API 데이터를 프론트엔드 형식으로 변환하고 로컬 데이터와 병합
          mergedBooks = apiBooks.map(apiBook => {
            const frontendBook = apiService.transformFromApiFormat(apiBook);
            const localData = getLocalBookData(frontendBook.id);
            
            return {
              ...frontendBook,
              ...localData,
              // 중요: API ID 보존
              apiId: apiBook.id,
              isLocalOnly: false
            };
          });
          
          console.log('✅ 서버 데이터 + 로컬 데이터 병합 완료:', mergedBooks.length);
          
        } catch (apiError) {
          console.error('❌ 서버 데이터 로드 실패:', apiError);
          setError(`서버 연결 실패: ${apiError.message}`);
        }
      }
      
      // 4. 로컬 전용 원서도 추가 (서버에 없는 것들)
      const localBooks = JSON.parse(localStorage.getItem('textbooks') || '[]');
      const localOnlyBooks = localBooks.filter(localBook => {
        // 서버에 없는 로컬 전용 원서들
        return !mergedBooks.some(serverBook => 
          serverBook.id === localBook.id || 
          (serverBook.apiId && localBook.apiId === serverBook.apiId)
        );
      });
      
      console.log('📋 로컬 전용 원서 개수:', localOnlyBooks.length);
      
      // 5. 모든 원서 합치기
      const allBooks = [
        ...mergedBooks,
        ...localOnlyBooks.map(book => ({ ...book, isLocalOnly: true }))
      ];
      
      setTextbooks(allBooks);
      console.log('✅ 하이브리드 로드 완료 - 총 원서:', allBooks.length, {
        server: mergedBooks.length,
        localOnly: localOnlyBooks.length
      });

    } catch (error) {
      console.error('❌ 전체 로드 실패:', error);
      setError(error.message);

      // 완전 실패 시 로컬 스토리지에서만 복원
      try {
        const localBooks = JSON.parse(localStorage.getItem('textbooks') || '[]');
        setTextbooks(localBooks.map(book => ({ ...book, isLocalOnly: true })));
        console.log('🔄 로컬 스토리지 복원:', localBooks.length);
      } catch (localError) {
        console.error('❌ 로컬 복원도 실패:', localError);
        setTextbooks([]);
      }
    } finally {
      setLoading(false);
    }
  }, [checkServerConnection, getLocalBookData]);

  // 원서 추가 (하이브리드 방식)
  const addTextbook = async (textbook) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📚 하이브리드 원서 등록 시작:', textbook.title);
      
      let finalBook = { ...textbook };
      let tempId = Date.now(); // 임시 ID
      
      // 1. 임시 ID로 먼저 상태 업데이트 (즉각적인 UI 반응)
      const tempBook = { 
        ...textbook, 
        id: tempId, 
        isLocalOnly: true, 
        isSaving: true 
      };
      setTextbooks(prev => [...prev, tempBook]);
      
      // 2. 서버 등록 시도
      if (serverConnected !== false) {
        try {
          console.log('🌐 서버에 원서 등록 시도...');
          const apiData = apiService.transformToApiFormat(textbook);
          const apiResponse = await apiService.createBook(apiData);
          
          // 서버 등록 성공
          const serverBook = apiService.transformFromApiFormat(apiResponse);
          finalBook = {
            ...serverBook,
            apiId: apiResponse.id,
            isLocalOnly: false,
            isSaving: false
          };
          
          console.log('✅ 서버 등록 성공, 새 ID:', finalBook.id);
          
        } catch (serverError) {
          console.warn('⚠️ 서버 등록 실패, 로컬 전용으로 저장:', serverError.message);
          
          // 서버 실패 시 로컬 전용으로
          finalBook = { 
            ...textbook, 
            id: tempId, 
            isLocalOnly: true,
            isSaving: false 
          };
        }
      } else {
        // 서버 연결 안 됨, 로컬 전용
        finalBook = { 
          ...textbook, 
          id: tempId, 
          isLocalOnly: true,
          isSaving: false 
        };
        console.log('📋 서버 연결 없음, 로컬 전용 저장');
      }
      
      // 3. 로컬 데이터 저장 (PDF 파일, 노트 등)
      const localData = {
        file: textbook.file,
        pdfId: textbook.pdfId,
        notes: textbook.notes || [],
        readingHistory: textbook.readingHistory || [],
        plan: textbook.plan || []
      };
      
      saveLocalBookData(finalBook.id, localData);
      
      // 4. 상태 업데이트 (temp 교체)
      setTextbooks(prev => prev.map(book => 
        book.id === tempId ? { ...finalBook, ...localData } : book
      ));
      
      // 5. 기존 방식 호환성 - localStorage 동기화
      const savedBooks = JSON.parse(localStorage.getItem('textbooks') || '[]');
      const updatedBooks = [...savedBooks, { ...finalBook, ...localData }];
      localStorage.setItem('textbooks', JSON.stringify(updatedBooks));
      
      console.log('📚 하이브리드 원서 등록 완료:', finalBook.title);
      return { ...finalBook, ...localData };
      
    } catch (error) {
      console.error('❌ 원서 등록 실패:', error);
      setError(error.message);
      
      // 완전 실패 시에도 로컬 전용으로 저장
      const fallbackBook = { 
        ...textbook, 
        id: Date.now(), 
        isLocalOnly: true, 
        isSaving: false,
        hasError: true 
      };
      
      setTextbooks(prev => prev.map(book => 
        book.isSaving ? fallbackBook : book
      ));
      
      return fallbackBook;
    } finally {
      setLoading(false);
    }
  };

  // 원서 업데이트 (하이브리드 방식)
  const updateTextbook = async (textbookId, updates) => {
    setLoading(true);
    setError(null);
    
    try {
      const existingBook = textbooks.find(book => book.id === textbookId);
      if (!existingBook) {
        throw new Error('원서를 찾을 수 없습니다');
      }
      
      console.log('🔄 원서 업데이트 시작:', existingBook.title);
      
      // 1. 즉시 로컬 상태 업데이트
      const updatedBook = { ...existingBook, ...updates };
      setTextbooks(prev => prev.map(book => 
        book.id === textbookId ? updatedBook : book
      ));
      
      // 2. 서버 업데이트 시도 (서버 연동 원서인 경우)
      if (!existingBook.isLocalOnly && existingBook.apiId && serverConnected !== false) {
        try {
          console.log('🌐 서버 업데이트 시도...');
          const mergedBook = { ...existingBook, ...updates };
          const apiData = apiService.transformToApiFormat(mergedBook);
          
          await apiService.updateBook(existingBook.apiId, apiData);
          console.log('✅ 서버 업데이트 성공');
          
        } catch (serverError) {
          console.warn('⚠️ 서버 업데이트 실패:', serverError.message);
          // 서버 실패해도 로컬 업데이트는 유지
        }
      }
      
      // 3. 로컬 데이터 업데이트 (PDF, 노트 등)
      const existingLocalData = getLocalBookData(textbookId);
      const newLocalData = {
        ...existingLocalData,
        file: updates.file !== undefined ? updates.file : existingLocalData.file,
        pdfId: updates.pdfId !== undefined ? updates.pdfId : existingLocalData.pdfId,
        notes: updates.notes !== undefined ? updates.notes : existingLocalData.notes,
        readingHistory: updates.readingHistory !== undefined ? updates.readingHistory : existingLocalData.readingHistory,
        plan: updates.plan !== undefined ? updates.plan : existingLocalData.plan
      };
      
      saveLocalBookData(textbookId, newLocalData);
      
      // 4. 기존 방식 호환성 - localStorage 동기화
      const savedBooks = JSON.parse(localStorage.getItem('textbooks') || '[]');
      const bookIndex = savedBooks.findIndex(book => book.id === textbookId);
      
      if (bookIndex !== -1) {
        savedBooks[bookIndex] = { ...updatedBook, ...newLocalData };
        localStorage.setItem('textbooks', JSON.stringify(savedBooks));
      }
      
      console.log('🔄 원서 업데이트 완료:', updatedBook.title);
      
    } catch (error) {
      console.error('❌ 원서 업데이트 실패:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 원서 삭제 (하이브리드 방식)
  const deleteTextbook = async (textbookId) => {
    setLoading(true);
    setError(null);
    
    try {
      const existingBook = textbooks.find(book => book.id === textbookId);
      if (!existingBook) {
        throw new Error('원서를 찾을 수 없습니다');
      }
      
      console.log('🗑️ 원서 삭제 시작:', existingBook.title);
      
      // 1. 서버에서 삭제 (서버 연동 원서인 경우)
      if (!existingBook.isLocalOnly && existingBook.apiId && serverConnected !== false) {
        try {
          console.log('🌐 서버에서 삭제 시도...');
          await apiService.deleteBook(existingBook.apiId);
          console.log('✅ 서버 삭제 성공');
        } catch (serverError) {
          console.warn('⚠️ 서버 삭제 실패:', serverError.message);
          // 서버 실패해도 로컬 삭제는 진행
        }
      }
      
      // 2. 로컬 상태에서 제거
      setTextbooks(prev => prev.filter(book => book.id !== textbookId));
      
      // 3. 로컬 데이터 삭제
      removeLocalBookData(textbookId);
      
      // 4. 기존 방식 호환성 - localStorage 동기화
      const savedBooks = JSON.parse(localStorage.getItem('textbooks') || '[]');
      const updatedBooks = savedBooks.filter(book => book.id !== textbookId);
      localStorage.setItem('textbooks', JSON.stringify(updatedBooks));
      
      console.log('🗑️ 원서 삭제 완료');
      
    } catch (error) {
      console.error('❌ 원서 삭제 실패:', error);
      setError(error.message);
      
      // 실패 시에도 로컬에서는 삭제
      setTextbooks(prev => prev.filter(book => book.id !== textbookId));
    } finally {
      setLoading(false);
    }
  };

  // 원서 조회 (단일)
  const getTextbook = (textbookId) => {
    const book = textbooks.find(book => book.id === parseInt(textbookId));
    if (!book) return null;
    
    // 로컬 데이터와 병합하여 반환
    const localData = getLocalBookData(book.id);
    return { ...book, ...localData };
  };

  // 임박한 원서 로드
  const loadStartingSoonBooks = async (days = 7) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`⏳ ${days}일 내 시작 예정인 원서 목록 로드 중...`);
      
      if (serverConnected !== false) {
        try {
          const apiBooks = await apiService.getBooksStartingSoon(days);
          const transformedBooks = apiBooks.map(apiBook => {
            const frontendBook = apiService.transformFromApiFormat(apiBook);
            const localData = getLocalBookData(frontendBook.id);
            return { ...frontendBook, ...localData };
          });
          
          setStartingSoonBooks(transformedBooks);
          console.log('✅ 서버에서 임박 책 목록 로드 완료:', transformedBooks.length);
          return;
        } catch (serverError) {
          console.warn('⚠️ 서버 임박 책 로드 실패, 로컬에서 계산:', serverError.message);
        }
      }
      
      // 서버 실패 시 로컬에서 계산
      const today = new Date();
      const targetDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
      
      const soonBooks = textbooks.filter(book => {
        const startDate = new Date(book.startDate);
        return startDate >= today && startDate <= targetDate;
      });
      
      setStartingSoonBooks(soonBooks);
      console.log('✅ 로컬에서 임박 책 목록 계산 완료:', soonBooks.length);
      
    } catch (err) {
      console.error('❌ 임박 책 목록 로드 실패:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 통계 계산 함수들
  const getTotalStudyTime = () => {
    return subjects.reduce((total, subject) => total + subject.totalStudyTime, 0);
  };

  const getCompletionRate = () => {
    const totalChapters = subjects.reduce((total, subject) => total + subject.totalChapters, 0);
    const completedChapters = subjects.reduce((total, subject) => total + subject.completedChapters, 0);
    return totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
  };

  const getCurrentStreak = () => {
    return Math.max(...subjects.map(s => s.currentStreak));
  };

  const getTodayRecommendations = () => {
    const today = new Date().toISOString().split('T')[0];
    const recommendations = [];

    subjects.forEach(subject => {
      if (subject.lastStudyDate !== today) {
        const incompleteChapters = subject.chapters.filter(ch => !ch.completed);
        if (incompleteChapters.length > 0) {
          recommendations.push({
            subjectId: subject.id,
            subjectName: subject.name,
            chapterId: incompleteChapters[0].id,
            chapterName: incompleteChapters[0].name,
            priority: subject.priority === 'high' ? 3 : subject.priority === 'medium' ? 2 : 1,
            reason: `다음 챕터: ${incompleteChapters[0].name}`
          });
        }
      }
    });

    return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 3);
  };

  const getWeeklyStudyData = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    const weeklyData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayLogs = studyLogs.filter(log => log.date === dateStr);
      const totalTime = dayLogs.reduce((sum, log) => sum + log.duration, 0);
      
      weeklyData.push({
        day: ['일', '월', '화', '수', '목', '금', '토'][i],
        hours: Math.round((totalTime / 60) * 10) / 10
      });
    }
    
    return weeklyData;
  };

  // 원서 관련 유틸리티 함수들
  const getTextbookProgress = (textbook) => {
    return textbook.totalPages > 0 ? Math.round((textbook.currentPage / textbook.totalPages) * 100) : 0;
  };

  const getTextbookDaysRemaining = (textbook) => {
    const today = new Date();
    const target = new Date(textbook.targetDate);
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getRecommendedDailyPages = (textbook) => {
    const remainingPages = textbook.totalPages - textbook.currentPage;
    const daysRemaining = getTextbookDaysRemaining(textbook);
    if (daysRemaining <= 0) return 0;
    return Math.ceil(remainingPages / daysRemaining);
  };

  // 데이터 업데이트 함수들 (subjects, logs, goals, events)
  const updateStudyTime = (subjectId, chapterId, duration, content) => {
    const today = new Date().toISOString().split('T')[0];
    
    setSubjects(prev => prev.map(subject => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          totalStudyTime: subject.totalStudyTime + duration,
          lastStudyDate: today
        };
      }
      return subject;
    }));

    setSubjects(prev => prev.map(subject => {
      if (subject.id === subjectId) {
        const updatedChapters = subject.chapters.map(chapter => {
          if (chapter.id === chapterId) {
            return {
              ...chapter,
              timeSpent: chapter.timeSpent + duration,
              lastStudied: today
            };
          }
          return chapter;
        });
        return { ...subject, chapters: updatedChapters };
      }
      return subject;
    }));

    const newLog = {
      id: Date.now(),
      subjectId,
      chapterId,
      date: today,
      duration,
      content
    };
    setStudyLogs(prev => [...prev, newLog]);
  };

  const updateGoalProgress = (type, value) => {
    setGoals(prev => prev.map(goal => {
      if (goal.type === type) {
        return { ...goal, current: goal.current + value };
      }
      return goal;
    }));
  };

  const addStudyEvent = (event) => {
    const newEvent = {
      ...event,
      id: Date.now()
    };
    setStudyEvents(prev => [...prev, newEvent]);
  };

  const updateStudyEvent = (eventId, updates) => {
    setStudyEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    ));
  };

  const deleteStudyEvent = (eventId) => {
    setStudyEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const addSubject = (subject) => {
    const newSubject = {
      ...subject,
      id: Date.now(),
      totalChapters: subject.chapters.length,
      completedChapters: 0,
      totalStudyTime: 0,
      currentStreak: 0,
      lastStudyDate: null,
      chapters: subject.chapters.map((name, index) => ({
        id: index + 1,
        name,
        completed: false,
        memo: '',
        timeSpent: 0,
        difficulty: 3,
        lastStudied: null
      }))
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const updateSubject = (subjectId, updates) => {
    setSubjects(prev => prev.map(subject => 
      subject.id === subjectId ? { ...subject, ...updates } : subject
    ));
  };

  const deleteSubject = (subjectId) => {
    setSubjects(prev => prev.filter(subject => subject.id !== subjectId));
  };

  // 초기 데이터 로드
  useEffect(() => {
    const savedSubjects = localStorage.getItem('studySubjects');
    const savedStudyLogs = localStorage.getItem('studyLogs');
    const savedGoals = localStorage.getItem('studyGoals');
    const savedEvents = localStorage.getItem('studyEvents');

    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedStudyLogs) setStudyLogs(JSON.parse(savedStudyLogs));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedEvents) setStudyEvents(JSON.parse(savedEvents));
    
    // 원서 데이터는 하이브리드 방식으로 로드
    loadTextbooks();
  }, [loadTextbooks]);

  // 로컬 스토리지 동기화 (subjects, studyLogs, goals, studyEvents만)
  useEffect(() => {
    localStorage.setItem('studySubjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('studyLogs', JSON.stringify(studyLogs));
  }, [studyLogs]);

  useEffect(() => {
    localStorage.setItem('studyGoals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('studyEvents', JSON.stringify(studyEvents));
  }, [studyEvents]);

  const value = {
    // 데이터
    subjects,
    studyLogs,
    goals,
    studyEvents,
    textbooks,
    loading,
    error,
    startingSoonBooks,
    serverConnected,
    
    // 상태 업데이트 함수들
    setSubjects,
    setStudyLogs,
    setGoals,
    setStudyEvents,
    setTextbooks,
    
    // 계산 함수들
    getTotalStudyTime,
    getCompletionRate,
    getCurrentStreak,
    getTodayRecommendations,
    getWeeklyStudyData,
    getTextbookProgress,
    getTextbookDaysRemaining,
    getRecommendedDailyPages,
    
    // 업데이트 함수들
    updateStudyTime,
    updateGoalProgress,
    addStudyEvent,
    updateStudyEvent,
    deleteStudyEvent,
    addSubject,
    updateSubject,
    deleteSubject,
    
    // 하이브리드 원서 관리 함수들
    addTextbook,
    updateTextbook,
    deleteTextbook,
    getTextbook,
    loadTextbooks,
    loadStartingSoonBooks,
    checkServerConnection,
    
    // 로컬 데이터 관리
    getLocalBookData,
    saveLocalBookData,
    removeLocalBookData
  };

  return (
    <StudyContext.Provider value={value}>
      {children}
    </StudyContext.Provider>
  );
};
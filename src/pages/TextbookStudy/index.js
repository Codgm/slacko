import React, { useState, useEffect } from 'react';
import { useOutletContext, useParams} from 'react-router-dom';
import { Search, Settings, NotebookPen, X, BookOpen, AlertTriangle, FileDown, CheckCircle, ZoomIn, ZoomOut, List, ChevronLeft, ChevronRight, Target, Star } from 'lucide-react';
import Breadcrumb from '../../components/common/Breadcrumb';
import TextbookContentView from '../../components/textbook/TextbookContentView';
import NoteBookView from '../../components/textbook/NoteBookView';
import StudyProgressView from '../../components/textbook/StudyProgressView';
import { createAnnotatedPDF, downloadPDFBlob} from '../../utils/pdfExportUtils';

const TextbookStudyPage = () => {
  const { id } = useParams();
  const context = useOutletContext();
  const activeView = context ? context.activeView : 'content';
  const { setStudyTimer: setLayoutStudyTimer } = context || {};
  const [viewMode, setViewMode] = useState('pdf');
  const [scale, setScale] = useState(1.8);
  const [rotation, setRotation] = useState(0);
  const [tableOfContents, setTableOfContents] = useState([]); // eslint-disable-line no-unused-vars
  const [tocLoading, setTocLoading] = useState(false); // eslint-disable-line no-unused-vars
  const [numPages, setNumPages] = useState(0);

  // 원서 데이터 상태
  const [textbookData, setTextbookData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  // 학습 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [plan, setPlan] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [studyTimer, setStudyTimer] = useState(0);
  const [allNotes, setAllNotes] = useState([]);
  const [isStudying, setIsStudying] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [nextChapter, setNextChapter] = useState(null);

  // PDF 다운로드 상태
  const [isDownloading, setIsDownloading] = useState(false);

  // UI 상태 
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState(null);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [highlightColor, setHighlightColor] = useState('bg-yellow-200');
  const [isNotePanelVisible, setIsNotePanelVisible] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [shouldOpenEditor, setShouldOpenEditor] = useState(false);

  const highlightColors = [
    { name: '노랑', class: 'bg-yellow-200', preview: 'bg-yellow-200' },
    { name: '파랑', class: 'bg-blue-200', preview: 'bg-blue-200' },
    { name: '초록', class: 'bg-green-200', preview: 'bg-green-200' },
    { name: '분홍', class: 'bg-pink-200', preview: 'bg-pink-200' },
    { name: '보라', class: 'bg-purple-200', preview: 'bg-purple-200' }
  ];

  // 데이터 저장을 위한 디바운스 타이머
  const [saveTimeout, setSaveTimeout] = useState(null);

  // 현재 페이지에 해당하는 챕터 찾기
  const findChapterByPage = (page) => {
    if (!plan || plan.length === 0) return null;
    
    // 페이지 범위로 챕터 찾기 (간단한 예시)
    const chapters = plan.filter(p => !p.completed);
    if (chapters.length === 0) return null;
    
    // 페이지 기반으로 챕터 추정 (실제로는 더 정교한 로직 필요)
    const estimatedChapter = Math.ceil(page / 10); // 10페이지당 1챕터로 가정
    return chapters[estimatedChapter - 1] || chapters[0];
  };

  // 다음 챕터 찾기
  const findNextChapter = (currentChapter) => {
    if (!plan || plan.length === 0) return null;
    
    const currentIndex = plan.findIndex(p => p.id === currentChapter?.id);
    if (currentIndex === -1 || currentIndex === plan.length - 1) return null;
    
    return plan[currentIndex + 1];
  };

  // 페이지 변경 시 챕터 체크
  useEffect(() => {
    const newChapter = findChapterByPage(currentPage);
    const prevChapter = currentChapter;
    
    if (newChapter && newChapter.id !== prevChapter?.id) {
      // 챕터 변경 감지
      if (prevChapter && !prevChapter.completed) {
        // 이전 챕터가 완료되지 않았으면 경고 모달
        setShowIncompleteModal(true);
      } else if (newChapter) {
        // 새 챕터로 이동 시 안내 모달
        setNextChapter(findNextChapter(newChapter));
        setShowChapterModal(true);
      }
    }
    
    setCurrentChapter(newChapter);
  }, [currentPage, plan]); // eslint-disable-line react-hooks/exhaustive-deps

  // 타이머 효과 수정 - setLayoutStudyTimer 호출을 별도 effect로 분리
  useEffect(() => {
    // 페이지 가시성 변경 감지
    const handleVisibilityChange = () => {
      setIsStudying(!document.hidden);
    };

    // 페이지 포커스/블러 감지
    const handleFocus = () => setIsStudying(true);
    const handleBlur = () => setIsStudying(false);

    // 초기 상태 설정
    setIsStudying(!document.hidden);

    // 이벤트 리스너 등록
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // 타이머 설정 - 페이지가 보이는 상태일 때만 증가
    let interval = setInterval(() => {
      if (!document.hidden) {
        setStudyTimer(prev => prev + 1);
      }
    }, 1000);
    
    // 클린업 함수
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Layout의 studyTimer 업데이트를 별도 effect로 분리
  useEffect(() => {
    if (setLayoutStudyTimer) {
      setLayoutStudyTimer(studyTimer);
    }
  }, [studyTimer, setLayoutStudyTimer]);

  // 원서 데이터 불러오기 (개선된 버전)
  useEffect(() => {
    const loadTextbookData = async () => {
      setDataLoading(true);
      setDataError(null);
      
      try {
        const books = JSON.parse(localStorage.getItem('textbooks') || '[]');
        const found = books.find(b => String(b.id) === String(id));
        
        if (!found) {
          throw new Error('원서를 찾을 수 없습니다.');
        }

        console.log('📚 원서 데이터 로드:', {
          id: found.id,
          title: found.title,
          pdfId: found.pdfId,
          currentPage: found.currentPage,
          planCount: found.plan?.length || 0,
          notesCount: found.notes?.length || 0
        });

        setTextbookData(found);
        setCurrentPage(found.currentPage || 1);
        
        // 학습 계획 로드 (완전한 구조로)
        const loadedPlan = found.plan || [];
        console.log('📝 로드된 학습 계획:', loadedPlan.length, '개');
        setPlan(loadedPlan);
        
        setStudyTimer(found.studyTime || 0);
        
        // notes를 highlights 형식으로 변환하여 로드 (개선된 변환)
        const convertedHighlights = found.notes ? found.notes.map(n => ({
          id: n.id || `note-${Date.now()}-${Math.random()}`,
          text: n.title || n.content?.substring(0, 50) || '선택된 텍스트',
          color: n.color || 'bg-yellow-200',
          note: n.content || '',
          page: n.page || 1,
          createdAt: n.createdAt || new Date().toISOString(),
          updatedAt: n.updatedAt || new Date().toISOString(),
          type: n.type || 'memo',
          tags: n.tags || [],
        })) : [];
        
        setHighlights(convertedHighlights);
        
        console.log('✅ 원서 데이터 로드 완료:', {
          title: found.title,
          currentPage: found.currentPage || 1,
          planCount: loadedPlan.length,
          highlightsCount: convertedHighlights.length,
          pdfId: found.pdfId,
          studyTime: found.studyTime || 0
        });
        
      } catch (error) {
        console.error('❌ 원서 데이터 로드 실패:', error);
        setDataError(error.message);
      } finally {
        setDataLoading(false);
      }
    };

    if (id) {
      loadTextbookData();
    }
  }, [id]);

  // highlights -> allNotes 동기화 (노트 패널/뷰용 데이터)
  useEffect(() => {
    const notesFromHighlights = highlights
      .filter(h => h.note && h.note.trim() !== '') // 빈 노트 필터링
      .map(h => ({
        id: h.id,
        title: h.text || h.note?.substring(0, 50) || '제목 없음',
        content: h.note,
        page: h.page,
        color: h.color.replace('bg-', '').replace('-200', ''), // 'bg-yellow-200' -> 'yellow'
        createdAt: h.createdAt || new Date().toISOString(),
        updatedAt: h.updatedAt || new Date().toISOString(),
        tags: h.tags || [],
        type: h.type || 'memo',
      }));
    setAllNotes(notesFromHighlights);
  }, [highlights]);
  
  // 데이터 저장 함수 (디바운스 적용, 개선된 버전)
  const saveDataToStorage = () => {
    if (!id || !textbookData) return;
    
    // 이전 타이머 클리어
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    
    // 500ms 후에 저장 (디바운스)
    const newTimeout = setTimeout(() => {
      try {
        const books = JSON.parse(localStorage.getItem('textbooks') || '[]');
        const bookIndex = books.findIndex(b => String(b.id) === String(id));
        
        if (bookIndex !== -1) {
          // 노트 데이터 변환 (개선된 변환)
          const notesData = highlights.map(h => ({
            id: h.id,
            title: h.text,
            content: h.note,
            page: h.page,
            color: h.color,
            createdAt: h.createdAt,
            updatedAt: h.updatedAt,
            type: h.type,
            tags: h.tags,
          }));
          
          // 진행률 계산
          const progress = textbookData.totalPages > 0 ? 
            Math.round((currentPage / textbookData.totalPages) * 100) : 0;
          
          // 원서 데이터 업데이트 (개선된 업데이트)
          const updatedBook = {
            ...books[bookIndex],
            currentPage,
            plan, // 학습 계획 저장
            notes: notesData,
            studyTime: studyTimer,
            progress,
            lastStudiedAt: new Date().toISOString(),
            // 학습 통계 업데이트
            totalStudyTime: studyTimer,
            noteCount: highlights.filter(h => h.note && h.note.trim()).length,
            highlightCount: highlights.length,
            // 추가 메타데이터
            lastActivity: {
              type: 'study',
              page: currentPage,
              timestamp: new Date().toISOString()
            }
          };
          
          books[bookIndex] = updatedBook;
          localStorage.setItem('textbooks', JSON.stringify(books));
          
          console.log('💾 데이터 저장 완료:', {
            id: id,
            currentPage,
            planCount: plan.length,
            highlightsCount: highlights.length,
            notesWithContent: highlights.filter(h => h.note && h.note.trim()).length,
            studyTime: studyTimer,
            progress
          });
        }
      } catch (error) {
        console.error('❌ 데이터 저장 실패:', error);
      }
    }, 500);
    
    setSaveTimeout(newTimeout);
  };

  // 주요 데이터 변경 시 저장 실행
  useEffect(() => {
    if (textbookData && id) {
      saveDataToStorage();
    }
    
    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [currentPage, plan, highlights, studyTimer, id]); // eslint-disable-line react-hooks/exhaustive-deps

  // 학습 계획 업데이트 함수
  const handlePlanUpdate = (updatedPlan) => {
    console.log('📝 학습 계획 업데이트:', updatedPlan.length, '개');
    setPlan(updatedPlan);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTextSelect = (text, position) => {
    setSelectedText(text);
    setSelectionPosition(position);
    setShowQuickActions(true);
  };

  const handleAddHighlight = (color = highlightColor) => {
    if (selectedText) {
      const newHighlight = {
        id: `highlight-${Date.now()}-${Math.random()}`,
        text: selectedText,
        color: color,
        note: '',
        page: currentPage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        type: 'highlight',
        tags: []
      };
      setHighlights(prev => [...prev, newHighlight]);
      setShowQuickActions(false);
      setSelectedText('');
      window.getSelection().removeAllRanges();
    }
  };

  const handleAddNote = () => {
    setShowNoteDialog(true);
  };

  const handleOpenNotePanel = () => {
    setIsNotePanelVisible(true);
    setShowQuickActions(false);
    setShouldOpenEditor(true);
  };

  const onEditorOpened = () => {
    setShouldOpenEditor(false);
  };

  const handleHighlightClick = (highlightId) => {
    console.log('Clicked on highlight:', highlightId);
    // 향후 하이라이트 클릭 시 해당 노트로 이동하는 기능 추가 가능
  };

  const handleSaveNote = () => {
    if (!noteContent.trim()) {
      alert('메모 내용을 입력해주세요.');
      return;
    }
    if (selectedText) {
      const newHighlight = {
        id: `note-${Date.now()}-${Math.random()}`,
        text: selectedText,
        page: currentPage,
        note: noteContent,
        color: highlightColor,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        type: 'memo',
        tags: [],
      };
      setHighlights(prev => [...prev, newHighlight]);
      setShowNoteDialog(false);
      setNoteContent('');
      setSelectedText('');
      setShowQuickActions(false);
    }
  };

  const handleNotePanelSave = (noteData) => {
    const newHighlight = {
      id: noteData.id || `panelnote-${Date.now()}-${Math.random()}`,
      text: noteData.title,
      page: noteData.page,
      note: noteData.content,
      color: `bg-${noteData.color}-200`,
      createdAt: noteData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: noteData.type,
      tags: noteData.tags,
    };

    setHighlights(prev => {
      const existingIndex = prev.findIndex(h => h.id === newHighlight.id);
      if (existingIndex > -1) {
        const updatedHighlights = [...prev];
        updatedHighlights[existingIndex] = newHighlight;
        return updatedHighlights;
      } else {
        return [...prev, newHighlight];
      }
    });
    
    setSelectedText('');
  };

  // 개선된 PDF 다운로드 함수
  const handleDownloadPDF = async () => {
    if (!textbookData?.pdfId) {
      alert('PDF 파일을 찾을 수 없습니다.');
      return;
    }

    setIsDownloading(true);

    try {
      console.log('📥 PDF 다운로드 시작...', {
        pdfId: textbookData.pdfId,
        title: textbookData.title,
        highlightsCount: highlights.length,
        notesCount: allNotes.length
      });
      
      // PDF 메모 데이터 가져오기
      const pdfAnnotations = JSON.parse(localStorage.getItem(`pdf_annotations_${textbookData.pdfId}`) || '[]');
      
      console.log(`📝 데이터 수집: PDF 메모 ${pdfAnnotations.length}개, 하이라이트 노트 ${highlights.filter(h => h.note && h.note.trim()).length}개`);
      
      // 메모가 있는 하이라이트만 필터링
      const highlightNotes = highlights.filter(h => h.note && h.note.trim() !== '');
      
      // pdf-lib이 없으면 fallback으로 원본 다운로드
      let hasPdfLib = false;
      try {
        await import('pdf-lib');
        hasPdfLib = true;
      } catch (error) {
        console.warn('⚠️ pdf-lib 없음, 원본 다운로드로 fallback');
      }

      if (!hasPdfLib || (pdfAnnotations.length === 0 && highlightNotes.length === 0)) {
        // pdf-lib이 없거나 메모가 없으면 원본 PDF 다운로드
        console.log('📄 원본 PDF 다운로드');
        await downloadOriginalPDF();
        return;
      }

      // 메모가 포함된 PDF 생성
      const annotatedPDFBlob = await createAnnotatedPDF(
        textbookData.pdfId, 
        pdfAnnotations, 
        highlightNotes, 
        textbookData
      );
      
      // 파일 다운로드
      const filename = generateSafeFilename(textbookData.title, 'with_notes');
      downloadPDFBlob(annotatedPDFBlob, filename);
      
      setShowSettingsMenu(false);
      
    } catch (error) {
      console.error('❌ PDF 다운로드 실패:', error);
      
      // 에러 발생시 원본 다운로드 시도
      console.log('📄 에러 발생, 원본 PDF 다운로드 시도');
      try {
        await downloadOriginalPDF();
      } catch (fallbackError) {
        console.error('❌ 원본 PDF 다운로드도 실패:', fallbackError);
        alert('PDF 다운로드에 실패했습니다. 브라우저 개발자 도구에서 오류를 확인해주세요.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadOriginalPDF = async () => {
    try {
      // pdfAnalyzer가 없으면 IndexedDB에서 직접 가져오기
      let pdfUrl;
      try {
        const { getPDFFromIndexedDB } = await import('../../utils/pdfAnalyzer');
        pdfUrl = await getPDFFromIndexedDB(textbookData.pdfId);
      } catch (error) {
        console.log('pdfAnalyzer 없음, IndexedDB에서 직접 읽기 시도');
        pdfUrl = await getPDFFromIndexedDBDirect(textbookData.pdfId);
      }
      
      if (pdfUrl) {
        const filename = generateSafeFilename(textbookData.title);
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(pdfUrl);
        
        console.log('✅ 원본 PDF 다운로드 완료');
      } else {
        throw new Error('PDF 파일을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('❌ 원본 PDF 다운로드 실패:', error);
      throw error;
    }
  };

    // IndexedDB에서 직접 PDF 가져오기 (fallback)
  const getPDFFromIndexedDBDirect = async (pdfId) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('PDFStorage', 1);
      
      request.onerror = () => reject(new Error('IndexedDB 열기 실패'));
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['pdfs'], 'readonly');
        const store = transaction.objectStore('pdfs');
        const getRequest = store.get(pdfId);
        
        getRequest.onsuccess = () => {
          if (getRequest.result && getRequest.result.data) {
            const blob = new Blob([getRequest.result.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            resolve(url);
          } else {
            reject(new Error('PDF 데이터를 찾을 수 없습니다.'));
          }
        };
        
        getRequest.onerror = () => reject(new Error('PDF 데이터 읽기 실패'));
      };
    });
  };

  const generateSafeFilename = (title, suffix = '') => {
    if (!title) title = 'textbook';
    
    const safeTitle = title
      .replace(/[<>:"/\\|?*]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);
    
    const suffixText = suffix ? `_${suffix}` : '';
    return `${safeTitle}${suffixText}.pdf`;
  };

  const debugPDFData = () => {
    console.log('🔍 PDF 다운로드 디버깅 정보:');
    console.log('- textbookData:', textbookData);
    console.log('- pdfId:', textbookData?.pdfId);
    console.log('- highlights:', highlights.length);
    console.log('- notes with content:', highlights.filter(h => h.note && h.note.trim()).length);
    console.log('- localStorage keys:', Object.keys(localStorage).filter(k => k.includes('pdf')));
    
    // PDF 어노테이션 확인
    const pdfAnnotations = JSON.parse(localStorage.getItem(`pdf_annotations_${textbookData?.pdfId}`) || '[]');
    console.log('- PDF annotations:', pdfAnnotations.length);
    
    // IndexedDB 확인
    const request = indexedDB.open('PDFStorage', 1);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['pdfs'], 'readonly');
      const store = transaction.objectStore('pdfs');
      const countRequest = store.count();
      
      countRequest.onsuccess = () => {
        console.log('- IndexedDB PDFs count:', countRequest.result);
      };
    };
  };

  const toggleNotePanel = () => setIsNotePanelVisible(!isNotePanelVisible);
  
  // 로딩 상태
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">원서 데이터 로딩 중...</p>
          <p className="text-sm text-gray-500">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (dataError || !textbookData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">원서를 불러올 수 없습니다</p>
          <p className="text-sm text-gray-500 mb-4">{dataError || '원서 데이터를 찾을 수 없습니다'}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 제목을 간단하게 표시하는 함수
  const getShortTitle = (title) => {
    if (!title) return '';
    
    // 파일명에서 추출된 긴 제목을 간단하게 처리
    // 예: "컴파일러-Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman - Compilers - Principles, Techniques, and Tools (2006, Pearson_Addison Wesley) - libgen.li"
    // → "컴파일러"로 표시
    
    // 첫 번째 하이픈이나 대시 이전의 부분만 사용
    const shortTitle = title.split(/[-–—]/)[0].trim();
    
    // 30자 이상이면 "..." 추가
    if (shortTitle.length > 30) {
      return shortTitle.substring(0, 30) + '...';
    }
    
    return shortTitle;
  };

  // 저자 정보도 간단하게 표시하는 함수
  const getShortAuthor = (author) => {
    if (!author) return '';
    
    // 저자가 여러 명인 경우 첫 번째 저자만 표시
    const firstAuthor = author.split(',')[0].trim();
    
    // 25자 이상이면 "..." 추가
    if (firstAuthor.length > 25) {
      return firstAuthor.substring(0, 25) + '...';
    }
    
    return firstAuthor;
  };

  // 출판사 정보도 간단하게 표시하는 함수
  const getShortPublisher = (publisher) => {
    if (!publisher) return '';
    
    // 20자 이상이면 "..." 추가
    if (publisher.length > 20) {
      return publisher.substring(0, 20) + '...';
    }
    
    return publisher;
  };

  // PDF 확대/축소 함수
  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));

  // 페이지 입력 핸들러
  const handlePageInput = (e) => {
    const page = parseInt(e.target.value);
    if (page && page > 0 && page <= numPages) {
      setCurrentPage(page);
    }
  };

  // PDF 문서 로드 성공 핸들러 - PDFTocExtractor 직접 사용
  const handleDocumentLoadSuccess = async (pdf, numPages) => {
    console.log('📚 PDF 문서 로드 성공 (상위 컴포넌트):', { numPages, pdf: !!pdf });
    setNumPages(numPages);
    
    // PDF 문서 객체 직접 저장
    if (pdf && typeof pdf === 'object') {
      console.log('✅ PDF 객체 상태:', {
        numPages: pdf.numPages,
        hasGetOutline: typeof pdf.getOutline === 'function',
        hasGetPage: typeof pdf.getPage === 'function'
      });
    }
  };

  // 페이지 네비게이션
  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(numPages, prev + 1));
  };

  // 현재 페이지의 챕터 정보를 가져오는 함수
  const getChapterInfo = (page) => {
    if (!tableOfContents || tableOfContents.length === 0) {
      return `P.${page}`;
    }
    
    // 페이지에 해당하는 챕터 찾기
    let chapterNumber = 1;
    for (let i = 0; i < tableOfContents.length; i++) {
      const item = tableOfContents[i];
      
      // 최상위 항목만 챕터로 간주 (level이 0인 항목)
      if (item.level === 0) {
        // 다음 챕터의 시작 페이지 찾기
        const nextChapterPage = (i < tableOfContents.length - 1 && tableOfContents[i + 1].level === 0) 
          ? tableOfContents[i + 1].page 
          : Number.MAX_SAFE_INTEGER;
        
        // 현재 페이지가 이 챕터에 속하는지 확인
        if (item.page && page >= item.page && page < nextChapterPage) {
          return `chap${chapterNumber}.p${page}`;
        }
        
        chapterNumber++;
      }
    }
    
    return `P.${page}`;
  };

  const renderContent = () => {
    if (dataLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">원서를 불러오는 중...</p>
          </div>
        </div>
      );
    }

    if (dataError) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-2">원서를 불러올 수 없습니다</p>
            <p className="text-gray-500 text-sm">{dataError}</p>
          </div>
        </div>
      );
    }

    if (!textbookData) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">원서를 찾을 수 없습니다</p>
          </div>
        </div>
      );
    }

    // activeView에 따라 다른 컴포넌트 렌더링
    switch (activeView) {
      case 'notes':
        return (
          <div className="h-full overflow-y-auto">
            <NoteBookView
              textbookData={textbookData}
              allNotes={allNotes}
              setAllNotes={setAllNotes}
              currentPage={currentPage}
              highlights={highlights}
              tableOfContents={tableOfContents}
            />
          </div>
        );
      
      case 'progress':
        return (
          <div className="h-full overflow-y-auto">
            <StudyProgressView
              textbookData={textbookData}
              currentPage={currentPage}
              totalPages={textbookData.totalPages}
              studyTimer={studyTimer}
              isStudying={isStudying}
              highlights={highlights}
              allNotes={allNotes}
              plan={plan}
              onPlanUpdate={handlePlanUpdate}
            />
          </div>
        );
      
      case 'content':
      default:
        return (
          <TextbookContentView
            pdfId={textbookData.pdfId} // 저장된 PDF ID 전달
            textbookData={textbookData}
            highlights={highlights}
            onTextSelect={handleTextSelect}
            onHighlightClick={handleHighlightClick}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isNotePanelVisible={isNotePanelVisible}
            toggleNotePanel={toggleNotePanel}
            allNotes={allNotes}
            selectedText={selectedText}
            shouldOpenEditor={shouldOpenEditor}
            handleNotePanelSave={handleNotePanelSave}
            onEditorOpened={onEditorOpened}
            showQuickActions={showQuickActions}
            selectionPosition={selectionPosition}
            highlightColors={highlightColors}
            handleAddHighlight={handleAddHighlight}
            handleAddNote={handleAddNote}
            handleOpenNotePanel={handleOpenNotePanel}
            setShowQuickActions={setShowQuickActions}
            showNoteDialog={showNoteDialog}
            setShowNoteDialog={setShowNoteDialog}
            noteContent={noteContent}
            setNoteContent={setNoteContent}
            highlightColor={highlightColor}
            setHighlightColor={setHighlightColor}
            handleSaveNote={handleSaveNote}
            // 추가 PDF 컨트롤 관련 props
            viewMode={viewMode}
            setViewMode={setViewMode}
            scale={scale}
            setScale={setScale}
            rotation={rotation}
            setRotation={setRotation}
            numPages={numPages}
            setNumPages={setNumPages}
            onDocumentLoadSuccess={(pdfDoc, pages) => {
              console.log('📚 문서 로드 성공 콜백:', { pages, pdfDoc: !!pdfDoc });
              handleDocumentLoadSuccess(pdfDoc, pages);
            }}
            tableOfContents={tableOfContents}
            tocLoading={tocLoading}
          />
        );
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col overflow-hidden">
      {/* 개선된 통합 헤더 */}
      <div className="w-full bg-white shadow-sm border-b border-gray-100 flex-shrink-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* 왼쪽: 원서 정보 및 학습 상태 */}
            <div className="flex items-center space-x-6">
              {/* 원서 기본 정보 */}
              <div className="flex flex-col">
                <div className="flex items-center space-x-3">
                  <h1 className="text-xl font-bold text-gray-900" title={textbookData.title}>
                    {getShortTitle(textbookData.title)}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                      {getChapterInfo(currentPage)}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {textbookData.progress || Math.round((currentPage / textbookData.totalPages) * 100) || 0}% 완료
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                  {textbookData.author && (
                    <>
                      <span className="truncate max-w-[200px]" title={textbookData.author}>
                        {getShortAuthor(textbookData.author)}
                      </span>
                      <span className="text-gray-400">•</span>
                    </>
                  )}
                  {textbookData.publisher && (
                    <span className="text-gray-500 truncate max-w-[120px]" title={textbookData.publisher}>
                      {getShortPublisher(textbookData.publisher)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* PDF 컨트롤 그룹 */}
              {activeView === 'content' && (
                <div className="flex items-center space-x-1 bg-gray-50 rounded-lg p-1">
                  <button 
                    onClick={zoomOut}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition-colors"
                    title="축소"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-gray-600 px-2 py-1 bg-white rounded-md font-mono min-w-[45px] text-center">
                    {Math.round(scale * 100)}%
                  </span>
                  <button 
                    onClick={zoomIn}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition-colors"
                    title="확대"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* PDF 컨트롤 영역 */}
              {activeView === 'content' && (
                <div className="flex items-center space-x-1 bg-gray-50 rounded-lg p-1">
                  <button 
                    onClick={goToPreviousPage}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition-colors disabled:opacity-50"
                    disabled={currentPage <= 1}
                    title="이전 페이지"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center space-x-1 bg-white rounded-md px-3 py-2">
                    <input
                      type="number"
                      value={currentPage}
                      onChange={handlePageInput}
                      className="w-12 text-xs text-center border-none outline-none font-mono"
                      min="1"
                      max={numPages || 1}
                    />
                    <span className="text-xs text-gray-400">/</span>
                    <span className="text-xs text-gray-600 font-mono">{numPages || '?'}</span>
                  </div>
                  <button 
                    onClick={goToNextPage}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition-colors disabled:opacity-50"
                    disabled={currentPage >= numPages}
                    title="다음 페이지"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* 구분선 */}
              <div className="w-px h-8 bg-gray-200"></div>

              {/* 기능 버튼 그룹 */}
              <div className="flex items-center space-x-1">
                <button 
                  className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="검색"
                >
                  <Search className="w-5 h-5" />
                </button>
                
                {activeView === 'content' && (
                  <button 
                    onClick={() => setViewMode(viewMode === 'toc' ? 'pdf' : 'toc')}
                    className={`p-2.5 rounded-lg transition-colors ${
                      viewMode === 'toc' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    title="목차"
                  >
                    <List className="w-5 h-5" />
                  </button>
                )}

                <button 
                  onClick={toggleNotePanel}
                  className={`p-2.5 rounded-lg transition-colors ${
                    isNotePanelVisible 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title={isNotePanelVisible ? "노트 패널 닫기" : "노트 패널 열기"}
                >
                  <NotebookPen className="w-5 h-5" />
                </button>

                {/* 설정 메뉴 */}
                <div className="relative">
                  <button 
                    onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                    className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title="설정"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  {/* 설정 드롭다운 메뉴 */}
                  {showSettingsMenu && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                      <div className="p-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('📥 다운로드 버튼 클릭됨');
                            debugPDFData();
                            handleDownloadPDF();
                          }}
                          disabled={isDownloading}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDownloading ? (
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <FileDown className="w-4 h-4" />
                          )}
                          <div className="flex-1 text-left">
                            <div className="font-medium">
                              {isDownloading ? '다운로드 중...' : 'PDF 다운로드'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {isDownloading ? 'PDF를 생성하고 있습니다' : '메모와 노트 포함'}
                            </div>
                          </div>
                        </button>
                        
                        <div className="border-t border-gray-100 my-2"></div>
                        
                        <button className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                          <Target className="w-4 h-4" />
                          <div className="flex-1 text-left">
                            <div className="font-medium">학습 목표 설정</div>
                            <div className="text-xs text-gray-500">일일 학습량 조정</div>
                          </div>
                        </button>
                        
                        <button className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                          <Star className="w-4 h-4" />
                          <div className="flex-1 text-left">
                            <div className="font-medium">북마크 관리</div>
                            <div className="text-xs text-gray-500">중요 페이지 저장</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 프로그레스 바 - 매우 얇게 */}
        <div className="h-1 bg-gray-100">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 transition-all duration-300"
            style={{ width: `${textbookData.progress || Math.round((currentPage / textbookData.totalPages) * 100) || 0}%` }}
          />
        </div>
      </div>

      {/* 브레드크럼 */}
      <div className='pl-8 pt-4 flex-shrink-0'>
        <Breadcrumb />
      </div>
      
      {/* 메인 컨텐츠 - 전체 화면 스크롤 가능 */}
      <div className="flex-1 min-h-0">
        {renderContent()}
      </div>

      {/* 설정 메뉴 백그라운드 클릭으로 닫기 */}
      {showSettingsMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowSettingsMenu(false)}
        />
      )}

      {/* 학습 계획 모달 */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">학습 계획 추가</h3>
              <button onClick={() => setShowPlanModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">챕터</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: Chapter 1 - JavaScript 기초"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                  placeholder="학습할 내용을 간단히 설명하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">목표 날짜</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowPlanModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                취소
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 학습 완료 모달 */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">오늘의 학습 완료!</h3>
              <p className="text-gray-600 mb-6">
                {formatTime(studyTimer)} 동안 열심히 학습하셨네요.<br/>
                내일도 화이팅하세요!
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span>학습 시간</span>
                  <span className="font-medium">{formatTime(studyTimer)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>작성한 노트</span>
                  <span className="font-medium">{allNotes?.length || 0}개</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>하이라이트</span>
                  <span className="font-medium">{highlights?.length || 0}개</span>
                </div>
              </div>
              
              <button
                onClick={() => setShowProgressModal(false)}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 챕터 전환 안내 모달 */}
      {showChapterModal && currentChapter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">새로운 챕터 시작!</h3>
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">{currentChapter.chapter}</h4>
                <p className="text-sm text-blue-700">{currentChapter.description}</p>
              </div>
              
              {nextChapter && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-2">다음 챕터:</p>
                  <p className="font-medium text-gray-900">{nextChapter.chapter}</p>
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowChapterModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 학습 계획 미완료 경고 모달 */}
      {showIncompleteModal && currentChapter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">학습 계획 미완료</h3>
              <div className="bg-orange-50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-orange-900 mb-2">{currentChapter.chapter}</h4>
                <p className="text-sm text-orange-700">{currentChapter.description}</p>
                <p className="text-sm text-orange-600 mt-2">이 챕터의 학습이 완료되지 않았습니다.</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span>현재 학습 시간</span>
                  <span className="font-medium">{formatTime(studyTimer)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>작성한 노트</span>
                  <span className="font-medium">{allNotes?.length || 0}개</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowIncompleteModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  계속 학습
                </button>
                <button
                  onClick={() => {
                    setShowIncompleteModal(false);
                    // 챕터 완료로 표시
                    const updatedPlan = plan.map(p => 
                      p.id === currentChapter.id ? { ...p, completed: true, completedAt: new Date().toISOString() } : p
                    );
                    setPlan(updatedPlan);
                  }}
                  className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  완료로 표시
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextbookStudyPage;

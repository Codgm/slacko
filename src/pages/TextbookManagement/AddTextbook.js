import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, Target, Brain } from 'lucide-react';
import Button from '../../components/common/Button';
import FileUpload from '../../components/common/FileUpload';
import AIPlanGenerator from '../../components/plan/AIPlanGenerator';
import Toast from '../../components/common/Toast';

export default function AddTextbook() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    totalPages: '',
    startDate: '',
    endDate: '',
    purpose: '',
    intensity: '보통'
  });
  const [bookFile, setBookFile] = useState(null);
  const [planTasks, setPlanTasks] = useState([]);
  const [daysLeft, setDaysLeft] = useState(null);

  // 학습 강도 옵션
  const intensityOptions = ['낮음', '보통', '높음'];

  // 날짜 변경 핸들러
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 남은 일수 계산
    if (name === 'endDate' && formData.startDate) {
      const start = new Date(formData.startDate);
      const end = new Date(value);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setDaysLeft(diff);
    } else if (name === 'startDate' && formData.endDate) {
      const start = new Date(value);
      const end = new Date(formData.endDate);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setDaysLeft(diff);
    }
  };

  // 파일 변경 핸들러
  const handleFileChange = (file) => {
    setBookFile(file);
    if (file && file.name) {
      const nameParts = file.name.replace(/\.[^/.]+$/, '').split('-');
      setFormData(prev => ({
        ...prev,
        title: nameParts[0] || '',
        publisher: nameParts[1] || '',
        totalPages: nameParts[2] ? parseInt(nameParts[2].replace(/[^0-9]/g, '')) : ''
      }));
    }
  };

  // 플랜 생성 핸들러
  const handleGeneratePlan = () => {
    const samplePlans = {
      '낮음': [
        { week: 1, task: '1~2장 읽기 및 핵심 개념 정리', date: '', done: false, memo: '천천히 이해하며 읽기' },
        { week: 2, task: '3~4장 읽기 및 예제 풀이', date: '', done: false, memo: '실습 위주로 학습' },
        { week: 3, task: '5~6장 읽기 및 복습', date: '', done: false, memo: '이전 내용과 연결' },
      ],
      '보통': [
        { week: 1, task: '1~3장 읽기 및 개념 정리', date: '', done: false, memo: '기초 개념 확립' },
        { week: 2, task: '4~6장 읽기 및 문제풀이', date: '', done: false, memo: '실습과 이론 병행' },
        { week: 3, task: '7~9장 읽기 및 복습', date: '', done: false, memo: '전체적인 흐름 파악' },
        { week: 4, task: '10~12장 읽기 및 심화 학습', date: '', done: false, memo: '심화 개념 도전' },
      ],
      '높음': [
        { week: 1, task: '1~5장 읽기 및 개념 정리', date: '', done: false, memo: '빠른 진도로 기초 확립' },
        { week: 2, task: '6~10장 읽기 및 문제풀이', date: '', done: false, memo: '실습과 이론 병행' },
        { week: 3, task: '11~15장 읽기 및 심화 학습', date: '', done: false, memo: '고급 개념 도전' },
        { week: 4, task: '16~20장 읽기 및 종합 복습', date: '', done: false, memo: '전체 내용 통합' },
        { week: 5, task: '21~25장 읽기 및 실전 연습', date: '', done: false, memo: '실전 문제 풀이' },
      ],
    };
    setPlanTasks(samplePlans[formData.intensity] || samplePlans['보통']);
  };

  // 저장 핸들러
  const handleSave = () => {
    if (!bookFile || !formData.title || !formData.totalPages || !formData.startDate || !formData.endDate || !formData.purpose || planTasks.length === 0) {
      setToastMessage('모든 필드와 플랜을 입력해주세요!');
      setToastType('error');
      setShowToast(true);
      return;
    }

    const newBook = {
      id: Date.now(),
      title: formData.title,
      author: formData.author,
      publisher: formData.publisher,
      totalPages: parseInt(formData.totalPages),
      currentPage: 0,
      targetDate: formData.endDate,
      status: '읽는 중',
      startDate: formData.startDate,
      notes: [],
      readingHistory: [],
      file: bookFile,
      daysLeft: daysLeft,
      purpose: formData.purpose,
      intensity: formData.intensity,
      plan: planTasks,
    };

    // 로컬 스토리지에 저장
    const existingBooks = JSON.parse(localStorage.getItem('textbooks') || '[]');
    const updatedBooks = [...existingBooks, newBook];
    localStorage.setItem('textbooks', JSON.stringify(updatedBooks));
    
    setToastMessage('새 원서가 추가되었습니다!');
    setToastType('success');
    setShowToast(true);
    
    // 잠시 후 원서 관리 페이지로 이동
    setTimeout(() => {
      navigate('/textbook');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w mx-auto px-4 py-2 flex items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/textbook')}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">새 원서 추가</h1>
              <p className="text-sm text-gray-600">단계별로 원서 정보를 입력하세요</p>
            </div>
          </div>
        </div>
      </div>

      {/* 진행 단계 표시 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <span className={`text-sm ${currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                기본 정보
              </span>
            </div>
            <div className="w-8 h-1 bg-gray-200 rounded"></div>
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className={`text-sm ${currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                학습 계획
              </span>
            </div>
          </div>
        </div>

        {/* 단계별 컨텐츠 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {currentStep === 1 && (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Book className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">기본 정보 입력</h2>
              </div>

              {/* 파일 업로드 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">전공 원서 파일</label>
                <FileUpload
                  onFileChange={handleFileChange}
                  accept="application/pdf,image/*"
                  label="PDF, 이미지 파일을 업로드하세요"
                />
              </div>

              {/* 원서 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">원서 제목 *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: Operating Systems"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">저자</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: Remzi H. Arpaci-Dusseau"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">출판사</label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => setFormData(prev => ({ ...prev, publisher: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: MIT Press"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">총 페이지 수 *</label>
                  <input
                    type="number"
                    value={formData.totalPages}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalPages: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 400"
                  />
                </div>
              </div>

              {/* 학습 기간 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">학습 기간 *</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">시작일</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleDateChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">목표 완료일</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleDateChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                {daysLeft !== null && (
                  <div className="text-sm text-blue-600 font-medium">
                    총 {daysLeft}일의 학습 기간이 설정되었습니다
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!formData.title || !formData.totalPages || !formData.startDate || !formData.endDate}
                  className="px-8"
                >
                  다음 단계
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">학습 계획 설정</h2>
              </div>

              {/* 학습 목적 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">학습 목적 *</label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 전공 심화 학습, 자격증 대비, 연구 목적 등"
                />
              </div>

              {/* 학습 강도 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">학습 강도</label>
                <select
                  value={formData.intensity}
                  onChange={(e) => setFormData(prev => ({ ...prev, intensity: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {intensityOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* AI 플랜 생성 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">학습 플랜 생성 *</label>
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={handleGeneratePlan}
                    className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <Brain className="w-4 h-4" />
                    플랜 생성
                  </button>
                  {planTasks.length > 0 && (
                    <button
                      onClick={() => setPlanTasks([])}
                      className="flex-1 bg-gray-200 text-gray-700 rounded-lg px-4 py-2 font-semibold hover:bg-gray-300 transition"
                    >
                      플랜 취소
                    </button>
                  )}
                </div>
                <AIPlanGenerator
                  studyIntensity={formData.intensity}
                  onGenerate={handleGeneratePlan}
                  planTasks={planTasks}
                  setPlanTasks={setPlanTasks}
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  onClick={() => setCurrentStep(1)}
                  variant="secondary"
                  className="px-8"
                >
                  이전 단계
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!formData.purpose || planTasks.length === 0}
                  className="px-8"
                >
                  원서 추가 완료
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast 알림 */}
      <Toast open={showToast} onClose={() => setShowToast(false)} type={toastType}>
        {toastMessage}
      </Toast>
    </div>
  );
} 
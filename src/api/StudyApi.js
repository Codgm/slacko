// api/Study_Api.js
class StudyApiService {
  constructor(baseURL = 'http://localhost:3001/api') {
    this.baseURL = baseURL;
  }

  // =========================
  // UTILITY METHODS
  // =========================
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(`Study API Error [${endpoint}]:`, error);
      throw new Error(`학습 관리 API 요청 실패: ${error.message}`);
    }
  }

  // =========================
  // SUBJECTS ENDPOINTS
  // =========================

  // 모든 과목 조회
  async getAllSubjects() {
    return await this.request('/subjects');
  }

  // 특정 과목 조회
  async getSubject(subjectId) {
    return await this.request(`/subjects/${subjectId}`);
  }

  // 새 과목 생성
  async createSubject(subjectData) {
    return await this.request('/subjects', {
      method: 'POST',
      body: JSON.stringify(subjectData)
    });
  }

  // 과목 정보 수정
  async updateSubject(subjectId, updates) {
    return await this.request(`/subjects/${subjectId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  // 과목 삭제
  async deleteSubject(subjectId) {
    return await this.request(`/subjects/${subjectId}`, {
      method: 'DELETE'
    });
  }

  // 활성 과목 조회
  async getActiveSubjects() {
    return await this.request('/subjects/active');
  }

  // 카테고리별 과목 조회
  async getSubjectsByCategory(category) {
    return await this.request(`/subjects/category/${category}`);
  }

  // 우선순위별 과목 조회
  async getSubjectsByPriority(priority) {
    return await this.request(`/subjects/priority/${priority}`);
  }

  // 챕터 완료 상태 토글
  async toggleChapterCompletion(subjectId, chapterId) {
    return await this.request(`/subjects/${subjectId}/chapter/${chapterId}`, {
      method: 'PATCH'
    });
  }

  // 챕터 메모 업데이트
  async updateChapterMemo(subjectId, chapterId, memo) {
    return await this.request(`/subjects/${subjectId}/chapter/${chapterId}/memo`, {
      method: 'PUT',
      body: JSON.stringify({ memo })
    });
  }

  // =========================
  // LOGS ENDPOINTS
  // =========================

  // 모든 학습 기록 조회
  async getAllStudyLogs() {
    return await this.request('/logs');
  }

  // 새 학습 기록 생성
  async createStudyLog(logData) {
    return await this.request('/logs', {
      method: 'POST',
      body: JSON.stringify(logData)
    });
  }

  // 특정 학습 기록 조회
  async getStudyLog(logId) {
    return await this.request(`/logs/${logId}`);
  }

  // 과목별 학습 기록
  async getStudyLogsBySubject(subjectId) {
    return await this.request(`/logs/subject/${subjectId}`);
  }

  // 날짜별 학습 기록
  async getStudyLogsByDate(date) {
    return await this.request(`/logs/date/${date}`);
  }

  // 주간 학습 통계
  async getWeeklyStudyStats() {
    return await this.request('/logs/weekly');
  }

  // =========================
  // GOALS ENDPOINTS
  // =========================

  // 모든 목표 조회
  async getAllGoals() {
    return await this.request('/goals');
  }

  // 새 목표 생성
  async createGoal(goalData) {
    return await this.request('/goals', {
      method: 'POST',
      body: JSON.stringify(goalData)
    });
  }

  // 목표 진행도 업데이트
  async updateGoalProgress(goalId, increment) {
    return await this.request(`/goals/${goalId}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ increment })
    });
  }

  // 타입별 목표 조회
  async getGoalsByType(type) {
    return await this.request(`/goals/type/${type}`);
  }

  // =========================
  // EVENTS ENDPOINTS
  // =========================

  // 모든 학습 일정 조회
  async getAllEvents() {
    return await this.request('/events');
  }

  // 새 학습 일정 생성
  async createEvent(eventData) {
    return await this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData)
    });
  }

  // 일정 완료 처리
  async completeEvent(eventId) {
    return await this.request(`/events/${eventId}/complete`, {
      method: 'PATCH'
    });
  }

  // 예정된 일정 조회
  async getUpcomingEvents() {
    return await this.request('/events/upcoming');
  }

  // =========================
  // ANALYTICS ENDPOINTS
  // =========================

  // 전체 학습 분석
  async getAnalytics() {
    return await this.request('/analytics');
  }

  // 대시보드 데이터
  async getDashboardData() {
    return await this.request('/analytics/dashboard');
  }

  // 학습 추천
  async getRecommendations() {
    return await this.request('/analytics/recommendations');
  }

  // =========================
  // TIMER ENDPOINTS
  // =========================

  // 타이머 시작
  async startTimer(subjectId, chapterId) {
    return await this.request('/timer/start', {
      method: 'POST',
      body: JSON.stringify({ subjectId, chapterId })
    });
  }

  // 타이머 일시정지
  async pauseTimer() {
    return await this.request('/timer/pause', {
      method: 'POST'
    });
  }

  // 타이머 종료
  async stopTimer(content, efficiency = 3) {
    return await this.request('/timer/stop', {
      method: 'POST',
      body: JSON.stringify({ content, efficiency })
    });
  }

  // 활성 타이머 조회
  async getActiveTimer() {
    return await this.request('/timer/active');
  }

  // =========================
  // CONNECTION TEST
  // =========================

  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, message: data.message || 'Connection successful' };
      } else {
        return { success: false, message: `HTTP ${response.status}` };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

// Export singleton instance
const studyApiService = new StudyApiService();
export default studyApiService;
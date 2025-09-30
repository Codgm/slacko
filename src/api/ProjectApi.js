// ProjectApi.js - 백엔드 API와 통신하는 서비스 모듈 (JSON Server Fallback 지원)

class ProjectApi {
  
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
    
    console.log('🔧 Project API 설정:', {
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

  // ========== 프로젝트 관리 API ==========

  // 1. 모든 프로젝트 조회 (GET /api/projects)
  async getAllProjects() {
    console.log('📋 모든 프로젝트 조회 요청');
    return await this.request('/projects');
  }

  // 2. 특정 프로젝트 조회 (GET /api/projects/{projectId})
  async getProjectById(projectId) {
    console.log('📋 특정 프로젝트 조회 요청:', projectId);
    return await this.request(`/projects/${projectId}`);
  }

  // 3. 프로젝트 생성 (POST /api/projects)
  async createProject(projectData) {
    console.log('📋 프로젝트 생성 요청:', projectData);
    return await this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  // 4. 프로젝트 수정 (PUT /api/projects/{projectId})
  async updateProject(projectId, projectData) {
    console.log('📋 프로젝트 수정 요청:', projectId, projectData);
    return await this.request(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  // 5. 프로젝트 삭제 (DELETE /api/projects/{projectId})
  async deleteProject(projectId) {
    console.log('📋 프로젝트 삭제 요청:', projectId);
    return await this.request(`/projects/${projectId}`, {
      method: 'DELETE',
    });
  }

  // 6. 프로젝트 상태별 조회 (GET /api/projects?status={status})
  async getProjectsByStatus(status) {
    console.log('📋 상태별 프로젝트 조회 요청:', status);
    return await this.request(`/projects?status=${status}`);
  }

  // 7. 프로젝트 우선순위별 조회 (GET /api/projects?priority={priority})
  async getProjectsByPriority(priority) {
    console.log('📋 우선순위별 프로젝트 조회 요청:', priority);
    return await this.request(`/projects?priority=${priority}`);
  }

  // 8. 프로젝트 검색 (GET /api/projects/search?keyword={keyword})
  async searchProjects(keyword) {
    console.log('📋 프로젝트 검색 요청:', keyword);
    return await this.request(`/projects/search?keyword=${encodeURIComponent(keyword)}`);
  }

  // ========== 태스크 관리 API ==========

  // 9. 특정 프로젝트의 모든 태스크 조회 (GET /api/projects/{projectId}/tasks)
  async getTasksByProjectId(projectId) {
    console.log('📝 프로젝트 태스크 조회 요청:', projectId);
    return await this.request(`/projects/${projectId}/tasks`);
  }

  // 10. 태스크 생성 (POST /api/projects/{projectId}/tasks)
  async createTask(projectId, taskData) {
    console.log('📝 태스크 생성 요청:', projectId, taskData);
    return await this.request(`/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  // 11. 태스크 수정 (PUT /api/tasks/{taskId})
  async updateTask(taskId, taskData) {
    console.log('📝 태스크 수정 요청:', taskId, taskData);
    return await this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  // 12. 태스크 삭제 (DELETE /api/tasks/{taskId})
  async deleteTask(taskId) {
    console.log('📝 태스크 삭제 요청:', taskId);
    return await this.request(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  // 13. 태스크 상태 변경 (PATCH /api/tasks/{taskId}/status)
  async updateTaskStatus(taskId, status) {
    console.log('📝 태스크 상태 변경 요청:', taskId, status);
    return await this.request(`/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // 14. 사용자별 태스크 조회 (GET /api/tasks/user/{userId})
  async getTasksByUserId(userId) {
    console.log('📝 사용자별 태스크 조회 요청:', userId);
    return await this.request(`/tasks/user/${userId}`);
  }

  // ========== 팀 관리 API ==========

  // 15. 팀 멤버 조회 (GET /api/teams/{teamId}/members)
  async getTeamMembers(teamId) {
    console.log('👥 팀 멤버 조회 요청:', teamId);
    return await this.request(`/teams/${teamId}/members`);
  }

  // 16. 팀 멤버 추가 (POST /api/teams/{teamId}/members)
  async addTeamMember(teamId, memberData) {
    console.log('👥 팀 멤버 추가 요청:', teamId, memberData);
    return await this.request(`/teams/${teamId}/members`, {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  }

  // 17. 팀 멤버 제거 (DELETE /api/teams/{teamId}/members/{memberId})
  async removeTeamMember(teamId, memberId) {
    console.log('👥 팀 멤버 제거 요청:', teamId, memberId);
    return await this.request(`/teams/${teamId}/members/${memberId}`, {
      method: 'DELETE',
    });
  }

  // ========== 마일스톤 관리 API ==========

  // 18. 프로젝트 마일스톤 조회 (GET /api/projects/{projectId}/milestones)
  async getMilestonesByProjectId(projectId) {
    console.log('🎯 프로젝트 마일스톤 조회 요청:', projectId);
    return await this.request(`/projects/${projectId}/milestones`);
  }

  // 19. 마일스톤 생성 (POST /api/projects/{projectId}/milestones)
  async createMilestone(projectId, milestoneData) {
    console.log('🎯 마일스톤 생성 요청:', projectId, milestoneData);
    return await this.request(`/projects/${projectId}/milestones`, {
      method: 'POST',
      body: JSON.stringify(milestoneData),
    });
  }

  // 20. 마일스톤 수정 (PUT /api/milestones/{milestoneId})
  async updateMilestone(milestoneId, milestoneData) {
    console.log('🎯 마일스톤 수정 요청:', milestoneId, milestoneData);
    return await this.request(`/milestones/${milestoneId}`, {
      method: 'PUT',
      body: JSON.stringify(milestoneData),
    });
  }

  // ========== 활동 및 파일 관리 API ==========

  // 21. 프로젝트 활동 로그 조회 (GET /api/projects/{projectId}/activities)
  async getProjectActivities(projectId) {
    console.log('📊 프로젝트 활동 로그 조회 요청:', projectId);
    return await this.request(`/projects/${projectId}/activities`);
  }

  // 22. 프로젝트 파일 조회 (GET /api/projects/{projectId}/files)
  async getProjectFiles(projectId) {
    console.log('📁 프로젝트 파일 조회 요청:', projectId);
    return await this.request(`/projects/${projectId}/files`);
  }

  // 23. 파일 업로드 (POST /api/projects/{projectId}/files)
  async uploadFile(projectId, fileData) {
    console.log('📁 파일 업로드 요청:', projectId, fileData);
    return await this.request(`/projects/${projectId}/files`, {
      method: 'POST',
      body: JSON.stringify(fileData),
    });
  }

  // ========== 통계 및 분석 API ==========

  // 24. 프로젝트 통계 조회 (GET /api/projects/analytics)
  async getProjectAnalytics() {
    console.log('📈 프로젝트 통계 조회 요청');
    return await this.request('/projects/analytics');
  }

  // 25. 사용자별 프로젝트 통계 (GET /api/users/{userId}/projects/analytics)
  async getUserProjectAnalytics(userId) {
    console.log('📈 사용자별 프로젝트 통계 조회 요청:', userId);
    return await this.request(`/users/${userId}/projects/analytics`);
  }

  // ========== 헬퍼 함수들 ==========

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
      
      const response = await this.request('/projects?limit=1');
      
      console.log('✅ 서버 연결 성공');
      return { 
        success: true, 
        message: `서버 연결 성공 (${this.currentURL})`,
        server: this.currentURL === this.primaryURL ? 'primary' : 'fallback',
        projectsCount: Array.isArray(response) ? response.length : 0
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

  // 프론트엔드 프로젝트 데이터를 백엔드 API 형식으로 변환
  transformToApiFormat(frontendProject) {
    console.log('🔄 프로젝트 API 형식 변환 시작:', {
      name: frontendProject.name,
      hasTasks: !!frontendProject.tasks,
      hasTeam: !!frontendProject.team
    });

    const apiData = {
      name: frontendProject.name,
      description: frontendProject.description,
      status: frontendProject.status,
      priority: frontendProject.priority,
      startDate: frontendProject.startDate,
      endDate: frontendProject.endDate,
      estimatedHours: frontendProject.estimatedHours,
      actualHours: frontendProject.actualHours,
      budget: frontendProject.budget,
      spent: frontendProject.spent,
      visibility: frontendProject.visibility,
      tags: frontendProject.tags || [],
      color: frontendProject.color,
      icon: frontendProject.icon,
      ownerId: frontendProject.owner?.id,
      teamMembers: frontendProject.team?.map(member => ({
        userId: member.id,
        role: member.role,
        name: member.name,
        email: member.email,
        avatar: member.avatar,
        phone: member.phone
      })) || [],
      tasks: frontendProject.tasks?.map(task => ({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assignee?.id,
        dueDate: task.dueDate,
        estimatedHours: task.estimatedHours,
        actualHours: task.actualHours,
        labels: task.labels || [],
        subtasks: task.subtasks?.map(subtask => ({
          title: subtask.title,
          completed: subtask.completed
        })) || []
      })) || [],
      milestones: frontendProject.milestones?.map(milestone => ({
        title: milestone.title,
        date: milestone.date,
        completed: milestone.completed
      })) || []
    };

    console.log('✅ 프로젝트 API 형식 변환 완료:', {
      name: apiData.name,
      status: apiData.status,
      tasksCount: apiData.tasks.length,
      teamMembersCount: apiData.teamMembers.length,
      milestonesCount: apiData.milestones.length
    });

    return apiData;
  }

  // 백엔드 API 응답을 프론트엔드 형식으로 변환
  transformFromApiFormat(apiProject) {
    console.log('🔄 프론트엔드 형식 변환 시작:', {
      id: apiProject.id,
      name: apiProject.name,
      tasksCount: apiProject.tasks?.length || 0
    });

    const frontendProject = {
      id: apiProject.id,
      name: apiProject.name,
      description: apiProject.description,
      status: apiProject.status,
      priority: apiProject.priority,
      startDate: apiProject.startDate,
      endDate: apiProject.endDate,
      estimatedHours: apiProject.estimatedHours,
      actualHours: apiProject.actualHours,
      budget: apiProject.budget,
      spent: apiProject.spent,
      visibility: apiProject.visibility,
      tags: apiProject.tags || [],
      color: apiProject.color,
      icon: apiProject.icon,
      owner: apiProject.owner ? {
        id: apiProject.owner.id || apiProject.ownerId,
        name: apiProject.owner.name,
        email: apiProject.owner.email,
        avatar: apiProject.owner.avatar,
        role: apiProject.owner.role
      } : null,
      team: apiProject.teamMembers?.map(member => ({
        id: member.userId || member.id,
        name: member.name,
        role: member.role,
        email: member.email,
        avatar: member.avatar,
        phone: member.phone
      })) || [],
      tasks: apiProject.tasks?.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee ? {
          id: task.assignee.id || task.assigneeId,
          name: task.assignee.name
        } : null,
        dueDate: task.dueDate,
        estimatedHours: task.estimatedHours,
        actualHours: task.actualHours,
        labels: task.labels || [],
        subtasks: task.subtasks?.map(subtask => ({
          id: subtask.id,
          title: subtask.title,
          completed: subtask.completed
        })) || [],
        comments: task.commentsCount || 0,
        attachments: task.attachmentsCount || 0
      })) || [],
      milestones: apiProject.milestones?.map(milestone => ({
        id: milestone.id,
        title: milestone.title,
        date: milestone.date,
        completed: milestone.completed
      })) || [],
      activity: apiProject.activities?.map(activity => ({
        id: activity.id,
        type: activity.type,
        user: activity.user.name,
        action: activity.action,
        time: activity.createdAt
      })) || [],
      files: apiProject.files?.map(file => ({
        id: file.id,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedBy: file.uploadedBy,
        uploadedAt: file.uploadedAt
      })) || [],
      
      // 계산된 필드들
      progress: this.calculateProgress(apiProject),
      createdAt: apiProject.createdAt || new Date().toISOString(),
      updatedAt: apiProject.updatedAt || new Date().toISOString()
    };

    console.log('✅ 프론트엔드 형식 변환 완료:', {
      id: frontendProject.id,
      name: frontendProject.name,
      tasksCount: frontendProject.tasks.length,
      teamSize: frontendProject.team.length,
      progress: frontendProject.progress
    });

    return frontendProject;
  }

  // 프로젝트 진행률 계산
  calculateProgress(project) {
    if (!project.tasks || project.tasks.length === 0) return 0;
    
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  }

  // 날짜 계산 헬퍼
  calculateDaysLeft(endDate) {
    const today = new Date();
    const target = new Date(endDate);
    const diffTime = target - today;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }
}

const projectApi = new ProjectApi();
export default projectApi;
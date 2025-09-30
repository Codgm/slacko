import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import ProjectApi from '../api/ProjectApi';

const ProjectContext = createContext();

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [userTasks, setUserTasks] = useState([]);

  // 서버 연결 상태 확인
  const checkServerConnection = useCallback(async () => {
    try {
      const status = await ProjectApi.testConnection();
      setServerStatus(status);
      if (!status.success) {
        console.warn('서버 연결 실패:', status.message);
      }
    } catch (error) {
      console.error('서버 상태 확인 중 오류:', error);
      setServerStatus({ success: false, message: error.message });
    }
  }, []);

  // 로컬 목업 데이터
  const getLocalMockData = useCallback(() => {
    return [
      {
        id: 1,
        name: '캡스톤 디자인 프로젝트',
        description: 'AI 기반 학습 도우미 앱 개발',
        status: 'in-progress',
        priority: 'high',
        startDate: '2025-08-01',
        endDate: '2025-10-31',
        estimatedHours: 320,
        actualHours: 156,
        budget: 15000000,
        spent: 7200000,
        visibility: 'team',
        tags: ['AI', 'Mobile', 'Education'],
        color: '#6366f1',
        icon: '🎓',
        progress: 45,
        owner: { id: 1, name: '김현우', avatar: 'https://i.pravatar.cc/40?img=1', email: 'kim@example.com', role: 'PM' },
        team: [
          { id: 1, name: '김현우', role: 'PM', avatar: 'https://i.pravatar.cc/40?img=1', email: 'kim@example.com', phone: '010-1234-5678' },
          { id: 2, name: '이수진', role: 'Designer', avatar: 'https://i.pravatar.cc/40?img=2', email: 'lee@example.com', phone: '010-2345-6789' },
          { id: 3, name: '박준호', role: 'Developer', avatar: 'https://i.pravatar.cc/40?img=3', email: 'park@example.com', phone: '010-3456-7890' },
          { id: 4, name: '최영미', role: 'QA', avatar: 'https://i.pravatar.cc/40?img=4', email: 'choi@example.com', phone: '010-4567-8901' }
        ],
        tasks: [
          {
            id: 1,
            title: '요구사항 분석 및 기획서 작성',
            description: '사용자 요구사항 조사 및 기능 정의',
            status: 'completed',
            priority: 'high',
            assignee: { id: 1, name: '김현우' },
            dueDate: '2025-08-15',
            estimatedHours: 24,
            actualHours: 28,
            labels: ['기획', '문서화'],
            subtasks: [
              { id: 11, title: '사용자 인터뷰 진행', completed: true },
              { id: 12, title: '경쟁사 분석', completed: true },
              { id: 13, title: '기능 정의서 작성', completed: true }
            ],
            comments: 3,
            attachments: 2
          }
        ],
        milestones: [
          { id: 1, title: '프로젝트 킥오프', date: '2025-08-01', completed: true },
          { id: 2, title: '기획 완료', date: '2025-08-15', completed: true }
        ],
        activity: [
          { id: 1, type: 'task_completed', user: '김현우', action: '요구사항 분석 완료', time: '2시간 전' }
        ],
        files: [
          { id: 1, name: '프로젝트_기획서.pdf', size: '2.4MB', type: 'pdf', uploadedBy: '김현우', uploadedAt: '2025-08-10' }
        ],
        createdAt: '2025-07-15T09:00:00.000Z',
        updatedAt: '2025-08-21T14:30:00.000Z'
      }
    ];
  }, []);

  // 모든 프로젝트 로드
  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('📋 프로젝트 데이터 로드 시작...');
      const apiProjects = await ProjectApi.getAllProjects();
      console.log('📋 API에서 받은 프로젝트:', apiProjects);

      const transformedProjects = apiProjects.map(project =>
        ProjectApi.transformFromApiFormat(project)
      );

      setProjects(transformedProjects);
      console.log('📋 변환된 프로젝트 데이터:', transformedProjects);

    } catch (error) {
      console.error('❌ 프로젝트 로드 실패:', error);
      setError(error.message);

      console.log('📋 로컬 목업 데이터로 대체합니다.');
      setProjects(getLocalMockData());
    } finally {
      setLoading(false);
    }
  }, [getLocalMockData]);

  // 분석 및 통계 기능
  const loadAnalytics = useCallback(async () => {
    try {
      const analyticsData = await ProjectApi.getProjectAnalytics();
      setAnalytics(analyticsData);
      return analyticsData;
    } catch (error) {
      console.error('❌ 분석 데이터 로드 실패:', error);
      // 로컬 계산으로 대체
      const localAnalytics = calculateLocalAnalytics();
      setAnalytics(localAnalytics);
      return localAnalytics;
    }
  }, []);

  // 로컬 분석 계산
  const calculateLocalAnalytics = useCallback(() => {
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const inProgressProjects = projects.filter(p => p.status === 'in-progress').length;
    const notStartedProjects = projects.filter(p => p.status === 'not-started').length;
    const overallProgress = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;

    const totalTasks = projects.reduce((acc, p) => acc + (p.tasks?.length || 0), 0);
    const completedTasks = projects.reduce((acc, p) =>
      acc + (p.tasks?.filter(t => t.status === 'completed').length || 0), 0);
    const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
    const totalSpent = projects.reduce((acc, p) => acc + (p.spent || 0), 0);
    const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return {
      totalProjects,
      completedProjects,
      inProgressProjects,
      notStartedProjects,
      overallProgress,
      totalTasks,
      completedTasks,
      taskCompletionRate,
      totalBudget,
      totalSpent,
      budgetUtilization
    };
  }, [projects]);

  useEffect(() => {
    loadProjects();
    checkServerConnection();
    loadAnalytics();
  }, [loadProjects, loadAnalytics, checkServerConnection]);

  // 특정 프로젝트 조회 (새로운 기능)
  const getProjectById = async (projectId) => {
    try {
      const project = await ProjectApi.getProjectById(projectId);
      return ProjectApi.transformFromApiFormat(project);
    } catch (error) {
      console.error('❌ 프로젝트 조회 실패:', error);
      return projects.find(p => p.id === projectId);
    }
  };

  // 서버 기반 검색 (개선된 기능)
  const searchProjects = async (keyword) => {
    if (!keyword.trim()) return projects;
    
    try {
      console.log('🔍 서버 검색:', keyword);
      const searchResults = await ProjectApi.searchProjects(keyword);
      return searchResults.map(project => 
        ProjectApi.transformFromApiFormat(project)
      );
    } catch (error) {
      console.error('❌ 서버 검색 실패, 로컬 검색 사용:', error);
      return projects.filter(project => 
        project.name.toLowerCase().includes(keyword.toLowerCase()) ||
        project.description.toLowerCase().includes(keyword.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
      );
    }
  };

  // 상태별 프로젝트 조회 (새로운 기능)
  const getProjectsByStatus = async (status) => {
    try {
      const results = await ProjectApi.getProjectsByStatus(status);
      return results.map(project => ProjectApi.transformFromApiFormat(project));
    } catch (error) {
      console.error('❌ 상태별 조회 실패, 로컬 필터링 사용:', error);
      return projects.filter(project => project.status === status);
    }
  };

  // 우선순위별 프로젝트 조회 (새로운 기능)
  const getProjectsByPriority = async (priority) => {
    try {
      const results = await ProjectApi.getProjectsByPriority(priority);
      return results.map(project => ProjectApi.transformFromApiFormat(project));
    } catch (error) {
      console.error('❌ 우선순위별 조회 실패, 로컬 필터링 사용:', error);
      return projects.filter(project => project.priority === priority);
    }
  };

  // 프로젝트 추가
  const addProject = async (newProject) => {
    setLoading(true);
    setError(null);
    
    try {
      const apiProjectData = ProjectApi.transformToApiFormat(newProject);
      const createdProject = await ProjectApi.createProject(apiProjectData);
      const transformedProject = ProjectApi.transformFromApiFormat(createdProject);
      
      setProjects(prev => [...prev, transformedProject]);
      return transformedProject;
      
    } catch (error) {
      console.error('❌ 프로젝트 추가 실패:', error);
      setError(error.message);
      
      const localProject = {
        ...newProject,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        progress: 0
      };
      setProjects(prev => [...prev, localProject]);
      return localProject;
    } finally {
      setLoading(false);
    }
  };

  // 프로젝트 수정
  const updateProject = async (projectId, updates) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedProject = await ProjectApi.updateProject(projectId, updates);
      const transformedProject = ProjectApi.transformFromApiFormat(updatedProject);
      
      setProjects(prev => 
        prev.map(project => 
          project.id === projectId 
            ? { ...project, ...transformedProject, updatedAt: new Date().toISOString() }
            : project
        )
      );
      
      return transformedProject;
      
    } catch (error) {
      console.error('❌ 프로젝트 수정 실패:', error);
      setError(error.message);
      
      setProjects(prev => 
        prev.map(project => 
          project.id === projectId 
            ? { ...project, ...updates, updatedAt: new Date().toISOString() }
            : project
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // 프로젝트 삭제
  const deleteProject = async (projectId) => {
    setLoading(true);
    setError(null);
    
    try {
      await ProjectApi.deleteProject(projectId);
      setProjects(prev => prev.filter(project => project.id !== projectId));
    } catch (error) {
      console.error('❌ 프로젝트 삭제 실패:', error);
      setError(error.message);
      setProjects(prev => prev.filter(project => project.id !== projectId));
    } finally {
      setLoading(false);
    }
  };

  // ========== 태스크 관리 기능 ==========

  // 특정 프로젝트의 태스크 조회 (새로운 기능)
  const getTasksByProjectId = async (projectId) => {
    try {
      const tasks = await ProjectApi.getTasksByProjectId(projectId);
      return tasks;
    } catch (error) {
      console.error('❌ 태스크 조회 실패:', error);
      const project = projects.find(p => p.id === projectId);
      return project?.tasks || [];
    }
  };

  // 태스크 추가
  const addTask = async (projectId, newTask) => {
    setLoading(true);
    setError(null);
    
    try {
      const createdTask = await ProjectApi.createTask(projectId, newTask);
      
      setProjects(prev => prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: [...(project.tasks || []), createdTask],
            updatedAt: new Date().toISOString()
          };
        }
        return project;
      }));
      
      return createdTask;
      
    } catch (error) {
      console.error('❌ 태스크 추가 실패:', error);
      setError(error.message);
      
      const localTask = {
        ...newTask,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setProjects(prev => prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: [...(project.tasks || []), localTask],
            updatedAt: new Date().toISOString()
          };
        }
        return project;
      }));
      
      return localTask;
    } finally {
      setLoading(false);
    }
  };

  // 태스크 수정
  const updateTask = async (projectId, taskId, updates) => {
    setLoading(true);
    setError(null);
    
    try {
      await ProjectApi.updateTask(taskId, updates);

      setProjects(prev => prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task =>
              task.id === taskId ? { ...task, ...updates } : task
            ),
            updatedAt: new Date().toISOString()
          };
        }
        return project;
      }));

    } catch (error) {
      console.error('❌ 태스크 수정 실패:', error);
      setError(error.message);
      
      setProjects(prev => prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task => 
              task.id === taskId ? { ...task, ...updates } : task
            ),
            updatedAt: new Date().toISOString()
          };
        }
        return project;
      }));
    } finally {
      setLoading(false);
    }
  };

  // 태스크 삭제 (새로운 기능)
  const deleteTask = async (projectId, taskId) => {
    setLoading(true);
    setError(null);
    
    try {
      await ProjectApi.deleteTask(taskId);
      
      setProjects(prev => prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.filter(task => task.id !== taskId),
            updatedAt: new Date().toISOString()
          };
        }
        return project;
      }));
      
    } catch (error) {
      console.error('❌ 태스크 삭제 실패:', error);
      setError(error.message);
      
      setProjects(prev => prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.filter(task => task.id !== taskId),
            updatedAt: new Date().toISOString()
          };
        }
        return project;
      }));
    } finally {
      setLoading(false);
    }
  };

  // 태스크 상태 변경 (새로운 기능)
  const updateTaskStatus = async (projectId, taskId, status) => {
    try {
      await ProjectApi.updateTaskStatus(taskId, status);
      await updateTask(projectId, taskId, { status });
    } catch (error) {
      console.error('❌ 태스크 상태 변경 실패:', error);
      await updateTask(projectId, taskId, { status });
    }
  };

  // 사용자별 태스크 조회 (새로운 기능)
  const getTasksByUserId = async (userId) => {
    try {
      const tasks = await ProjectApi.getTasksByUserId(userId);
      setUserTasks(tasks);
      return tasks;
    } catch (error) {
      console.error('❌ 사용자 태스크 조회 실패:', error);
      const allTasks = projects.reduce((acc, project) => {
        const userProjectTasks = project.tasks?.filter(task => 
          task.assignee?.id === userId
        ) || [];
        return [...acc, ...userProjectTasks.map(task => ({
          ...task,
          projectName: project.name,
          projectId: project.id
        }))];
      }, []);
      setUserTasks(allTasks);
      return allTasks;
    }
  };

  // ========== 팀 관리 기능 (새로운 기능들) ==========

  const getTeamMembers = async (teamId) => {
    try {
      return await ProjectApi.getTeamMembers(teamId);
    } catch (error) {
      console.error('❌ 팀 멤버 조회 실패:', error);
      return [];
    }
  };

  const addTeamMember = async (teamId, memberData) => {
    try {
      const newMember = await ProjectApi.addTeamMember(teamId, memberData);
      // 관련 프로젝트의 팀원 목록 업데이트
      setProjects(prev => prev.map(project => {
        if (project.team.some(member => member.teamId === teamId)) {
          return {
            ...project,
            team: [...project.team, newMember],
            updatedAt: new Date().toISOString()
          };
        }
        return project;
      }));
      return newMember;
    } catch (error) {
      console.error('❌ 팀 멤버 추가 실패:', error);
      throw error;
    }
  };

  const removeTeamMember = async (teamId, memberId) => {
    try {
      await ProjectApi.removeTeamMember(teamId, memberId);
      // 관련 프로젝트의 팀원 목록 업데이트
      setProjects(prev => prev.map(project => {
        return {
          ...project,
          team: project.team.filter(member => member.id !== memberId),
          updatedAt: new Date().toISOString()
        };
      }));
    } catch (error) {
      console.error('❌ 팀 멤버 제거 실패:', error);
      throw error;
    }
  };

  // ========== 마일스톤 관리 기능 (새로운 기능들) ==========

  const getMilestonesByProjectId = async (projectId) => {
    try {
      return await ProjectApi.getMilestonesByProjectId(projectId);
    } catch (error) {
      console.error('❌ 마일스톤 조회 실패:', error);
      const project = projects.find(p => p.id === projectId);
      return project?.milestones || [];
    }
  };

  const createMilestone = async (projectId, milestoneData) => {
    try {
      const newMilestone = await ProjectApi.createMilestone(projectId, milestoneData);
      
      setProjects(prev => prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            milestones: [...(project.milestones || []), newMilestone],
            updatedAt: new Date().toISOString()
          };
        }
        return project;
      }));
      
      return newMilestone;
    } catch (error) {
      console.error('❌ 마일스톤 생성 실패:', error);
      const localMilestone = {
        ...milestoneData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      
      setProjects(prev => prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            milestones: [...(project.milestones || []), localMilestone],
            updatedAt: new Date().toISOString()
          };
        }
        return project;
      }));
      
      return localMilestone;
    }
  };

  const updateMilestone = async (milestoneId, milestoneData) => {
    try {
      const updatedMilestone = await ProjectApi.updateMilestone(milestoneId, milestoneData);
      
      setProjects(prev => prev.map(project => ({
        ...project,
        milestones: project.milestones?.map(milestone =>
          milestone.id === milestoneId 
            ? { ...milestone, ...milestoneData }
            : milestone
        ) || [],
        updatedAt: new Date().toISOString()
      })));
      
      return updatedMilestone;
    } catch (error) {
      console.error('❌ 마일스톤 수정 실패:', error);
      setProjects(prev => prev.map(project => ({
        ...project,
        milestones: project.milestones?.map(milestone =>
          milestone.id === milestoneId 
            ? { ...milestone, ...milestoneData }
            : milestone
        ) || [],
        updatedAt: new Date().toISOString()
      })));
    }
  };

  // ========== 파일 관리 기능 (새로운 기능들) ==========

  const getProjectFiles = async (projectId) => {
    try {
      return await ProjectApi.getProjectFiles(projectId);
    } catch (error) {
      console.error('❌ 프로젝트 파일 조회 실패:', error);
      const project = projects.find(p => p.id === projectId);
      return project?.files || [];
    }
  };

  const uploadFile = async (projectId, fileData) => {
    try {
      const uploadedFile = await ProjectApi.uploadFile(projectId, fileData);
      
      setProjects(prev => prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            files: [...(project.files || []), uploadedFile],
            updatedAt: new Date().toISOString()
          };
        }
        return project;
      }));
      
      return uploadedFile;
    } catch (error) {
      console.error('❌ 파일 업로드 실패:', error);
      throw error;
    }
  };

  // ========== 활동 로그 기능 (새로운 기능) ==========

  const getProjectActivities = async (projectId) => {
    try {
      return await ProjectApi.getProjectActivities(projectId);
    } catch (error) {
      console.error('❌ 활동 로그 조회 실패:', error);
      const project = projects.find(p => p.id === projectId);
      return project?.activity || [];
    }
  };

  const getUserProjectAnalytics = async (userId) => {
    try {
      return await ProjectApi.getUserProjectAnalytics(userId);
    } catch (error) {
      console.error('❌ 사용자 분석 데이터 조회 실패:', error);
      return null;
    }
  };


  // 에러 초기화
  const clearError = () => {
    setError(null);
  };

  // 데이터 새로고침
  const refreshProjects = () => {
    loadProjects();
    loadAnalytics();
  };

  const value = {
    // 기존 기능
    projects,
    loading,
    error,
    serverStatus,
    analytics,
    userTasks,
    
    // 프로젝트 관리
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    searchProjects,
    getProjectsByStatus,
    getProjectsByPriority,
    
    // 태스크 관리
    getTasksByProjectId,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTasksByUserId,
    
    // 팀 관리
    getTeamMembers,
    addTeamMember,
    removeTeamMember,
    
    // 마일스톤 관리
    getMilestonesByProjectId,
    createMilestone,
    updateMilestone,
    
    // 파일 관리
    getProjectFiles,
    uploadFile,
    
    // 활동 로그
    getProjectActivities,
    
    // 분석 및 통계
    loadAnalytics,
    getUserProjectAnalytics,
    
    // 유틸리티
    clearError,
    refreshProjects,
    checkServerConnection
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
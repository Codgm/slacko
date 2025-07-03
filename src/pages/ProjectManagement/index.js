import { useState } from 'react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import { Calendar, CheckCircle, FileText, Link, Plus, X, Upload, Trash2} from 'lucide-react';

export default function ProjectManagement() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: '캡스톤 디자인',
      description: '졸업작품 프로젝트',
      status: '진행 중',
      startDate: '2025-06-05',
      endDate: '2025-07-30',
      milestones: [
        { id: 1, title: '주제 선정', completed: true, dueDate: '2025-06-05' },
        { id: 2, title: '발표 초안 작성', completed: true, dueDate: '2025-06-12' },
        { id: 3, title: '발표 자료 완성', completed: false, dueDate: '2025-06-20' },
        { id: 4, title: '최종 발표 연습', completed: false, dueDate: '2025-06-25' }
      ],
      files: [
        { id: 1, name: 'proposal.pdf', type: 'file' },
        { id: 2, name: 'design-preview.png', type: 'image' },
        { id: 3, name: 'https://notion.so/project-docs', type: 'link' }
      ],
      notes: '현재 발표 자료 작성 중. UI 디자인 검토 필요.'
    },
    {
      id: 2,
      name: '웹 포트폴리오',
      description: '개인 포트폴리오 웹사이트 제작',
      status: '완료',
      startDate: '2025-05-01',
      endDate: '2025-05-30',
      milestones: [
        { id: 1, title: '디자인 기획', completed: true, dueDate: '2025-05-05' },
        { id: 2, title: '프론트엔드 개발', completed: true, dueDate: '2025-05-20' },
        { id: 3, title: '배포 및 테스트', completed: true, dueDate: '2025-05-30' }
      ],
      files: [
        { id: 1, name: 'wireframe.sketch', type: 'file' },
        { id: 2, name: 'portfolio-screenshot.png', type: 'image' }
      ],
      notes: '성공적으로 배포 완료. 향후 업데이트 예정.'
    }
  ]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: '진행 중',
    milestones: [],
    files: [],
    notes: ''
  });

  const openProjectDetail = (project) => {
    setSelectedProject(project);
    setIsSlideOpen(true);
  };

  const closeProjectDetail = () => {
    setIsSlideOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  const toggleMilestone = (projectId, milestoneId) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          milestones: project.milestones.map(milestone => 
            milestone.id === milestoneId 
              ? { ...milestone, completed: !milestone.completed }
              : milestone
          )
        };
      }
      return project;
    }));
    setToastMessage('마일스톤 상태가 업데이트되었습니다!');
    setToastType('success');
    setShowToast(true);
  };

  const addNewMilestone = (projectId) => {
    const newMilestone = {
      id: Date.now(),
      title: '새 마일스톤',
      completed: false,
      dueDate: new Date().toISOString().split('T')[0]
    };
    
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          milestones: [...project.milestones, newMilestone]
        };
      }
      return project;
    }));
    setToastMessage('새 마일스톤이 추가되었습니다!');
    setToastType('success');
    setShowToast(true);
  };

  const getProgressPercentage = (milestones) => {
    const completed = milestones.filter(m => m.completed).length;
    return Math.round((completed / milestones.length) * 100);
  };

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const ProjectCard = ({ project }) => {
    const progressPercentage = getProgressPercentage(project.milestones);
    const daysRemaining = getDaysRemaining(project.endDate);
    const statusColor = project.status === '완료' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

    return (
      <div 
        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
        onClick={() => openProjectDetail(project)}
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {project.status}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4">{project.description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{formatDate(project.startDate)} ~ {formatDate(project.endDate)}</span>
          {daysRemaining > 0 && project.status !== '완료' && (
            <span className="ml-2 text-orange-600 font-medium">⏳ D-{daysRemaining}</span>
          )}
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>마일스톤 진행률</span>
            <span>{project.milestones.filter(m => m.completed).length}/{project.milestones.length} 완료</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>📂 자료: {project.files.length}개 첨부됨</span>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 font-medium">
            보기 →
          </Button>
        </div>
      </div>
    );
  };

  const ProjectDetail = ({ project }) => {
    if (!project) return null;

    return (
      <div className={`fixed top-0 right-0 h-full w-full md:w-1/2 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isSlideOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">{project.name}</h2>
            <Button 
              onClick={closeProjectDetail}
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
              <p className="text-gray-700 mb-2">{project.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>📅 {formatDate(project.startDate)} ~ {formatDate(project.endDate)}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  project.status === '완료' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>
            {/* 마일스톤 목록 */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">📅 마일스톤</h3>
                <Button 
                  onClick={() => addNewMilestone(project.id)}
                  variant="primary"
                  size="sm"
                >
                  + 새 마일스톤
                </Button>
              </div>
              <ul className="space-y-2">
                {project.milestones.map(milestone => (
                  <li key={milestone.id} className="flex items-center gap-2">
                    <Button
                      onClick={() => toggleMilestone(project.id, milestone.id)}
                      variant="ghost"
                      size="sm"
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center p-0 ${milestone.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
                      aria-label={milestone.completed ? '완료됨' : '미완료'}
                    >
                      {milestone.completed && <CheckCircle className="w-4 h-4 text-white" />}
                    </Button>
                    <span className={milestone.completed ? 'line-through text-gray-400' : ''}>{milestone.title}</span>
                    <span className="text-xs text-gray-500 ml-2">{formatDate(milestone.dueDate)}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* 파일/링크 */}
            <div>
              <h3 className="font-semibold mb-2">📁 첨부 자료</h3>
              <ul className="space-y-2">
                {project.files.map(file => (
                  <li key={file.id} className="flex items-center gap-2">
                    {file.type === 'file' && <FileText className="w-4 h-4 text-blue-500" />}
                    {file.type === 'image' && <Upload className="w-4 h-4 text-purple-500" />}
                    {file.type === 'link' && <Link className="w-4 h-4 text-green-500" />}
                    <span className="text-sm text-gray-700 truncate">{file.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">📎 자료 첨부</h3>
                <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm">
                  <Upload className="w-4 h-4 mr-1" />
                  업로드
                </button>
              </div>
              <div className="space-y-2">
                {project.files.map(file => (
                  <div key={file.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                    {file.type === 'link' ? (
                      <Link className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    ) : file.type === 'image' ? (
                      <span className="text-lg">🖼️</span>
                    ) : (
                      <FileText className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    )}
                    <span className="flex-grow text-sm text-gray-700 truncate">{file.name}</span>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">파일을 드래그하거나 클릭하여 업로드</p>
              </div>
            </div>
            {/* 노트 */}
            <div>
              <h3 className="font-semibold mb-2">📝 프로젝트 노트</h3>
              <p className="text-gray-700 text-sm whitespace-pre-line">{project.notes}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 새 프로젝트 추가
  const handleAddProject = () => {
    if (!newProject.name.trim() || !newProject.startDate || !newProject.endDate) {
      setToastMessage('프로젝트명, 시작일, 종료일을 입력하세요.');
      setToastType('error');
      setShowToast(true);
      return;
    }
    setProjects([
      {
        ...newProject,
        id: Date.now(),
        milestones: [],
        files: [],
        notes: newProject.notes || ''
      },
      ...projects
    ]);
    setShowAddModal(false);
    setNewProject({ name: '', description: '', startDate: '', endDate: '', status: '진행 중', milestones: [], files: [], notes: '' });
    setToastMessage('새 프로젝트가 추가되었습니다!');
    setToastType('success');
    setShowToast(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 mb-8">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">프로젝트 관리</h1>
                <p className="text-sm text-gray-600">진행 중인 프로젝트를 한눈에 관리하세요!</p>
              </div>
              <Button
                variant="primary"
                className="flex items-center gap-2"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="w-4 h-4" />
                새 프로젝트
              </Button>
            </div>
          </div>
        </div>
        {/* 프로젝트 카드 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        {/* 프로젝트 상세 슬라이드 */}
        <ProjectDetail project={selectedProject} />
      </div>
      {/* 새 프로젝트 추가 모달 */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="space-y-4">
          <div className="text-lg font-semibold">새 프로젝트 추가</div>
          <input
            type="text"
            value={newProject.name}
            onChange={e => setNewProject(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="프로젝트명"
            autoFocus
          />
          <input
            type="text"
            value={newProject.description}
            onChange={e => setNewProject(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="설명"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={newProject.startDate}
              onChange={e => setNewProject(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="시작일"
            />
            <input
              type="date"
              value={newProject.endDate}
              onChange={e => setNewProject(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="종료일"
            />
          </div>
          <textarea
            value={newProject.notes}
            onChange={e => setNewProject(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="노트(선택)"
            rows={2}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>취소</Button>
            <Button variant="primary" onClick={handleAddProject} disabled={!newProject.name.trim() || !newProject.startDate || !newProject.endDate}>추가</Button>
          </div>
        </div>
      </Modal>
      {/* Toast 알림 */}
      <Toast open={showToast} onClose={() => setShowToast(false)} type={toastType}>{toastMessage}</Toast>
    </div>
  );
} 
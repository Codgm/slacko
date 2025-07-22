import { useState } from 'react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import ProgressBar from '../../components/common/ProgressBar';
import { Calendar, CheckCircle, FileText, Link, Plus, X, Upload, Trash2, Users, Settings, Filter, List, Layout, Clock, File, StickyNote, FolderOpen } from 'lucide-react';
import ProjectSettingsModal from '../../components/project/ProjectSettingsModal';
import ProjectInviteModal from '../../components/project/ProjectInviteModal';
import ProjectFilterModal from '../../components/project/ProjectFilterModal';
import ProjectAddModal from '../../components/project/ProjectAddModal';

// 팀원 샘플 데이터
const sampleMembers = [
  { id: 1, name: '홍길동', avatar: 'https://i.pravatar.cc/40?img=1' },
  { id: 2, name: '김철수', avatar: 'https://i.pravatar.cc/40?img=2' },
  { id: 3, name: '이영희', avatar: 'https://i.pravatar.cc/40?img=3' },
  { id: 4, name: '박민수', avatar: 'https://i.pravatar.cc/40?img=4' },
];

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
  const [activeTab, setActiveTab] = useState('board'); // board, list, timeline, files, notes
  const [showInvite, setShowInvite] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [members, setMembers] = useState(sampleMembers);
  const [filterState, setFilterState] = useState({});

  // 프로젝트 정보 저장(수정)
  const handleProjectSave = (updatedProject) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    setToastMessage('프로젝트 정보가 저장되었습니다!');
    setToastType('success');
    setShowToast(true);
  };
  // 프로젝트 삭제
  const handleProjectDelete = (project) => {
    setProjects(projects.filter(p => p.id !== project.id));
    setToastMessage('프로젝트가 삭제되었습니다!');
    setToastType('success');
    setShowToast(true);
  };
  // 프로젝트 아카이브
  const handleProjectArchive = (project) => {
    setProjects(projects.map(p => p.id === project.id ? { ...p, archived: true } : p));
    setToastMessage('프로젝트가 아카이브되었습니다!');
    setToastType('info');
    setShowToast(true);
  };
  // 팀원 초대
  const handleInvite = (emailOrName, role) => {
    const newId = Date.now();
    setMembers([...members, { id: newId, name: emailOrName, role }]);
    setToastMessage(`${emailOrName}님을 초대했습니다!`);
    setToastType('success');
    setShowToast(true);
  };
  // 팀원 삭제
  const handleRemoveMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
    setToastMessage('팀원이 삭제되었습니다!');
    setToastType('info');
    setShowToast(true);
  };
  // 팀원 역할 변경
  const handleRoleChange = (id, role) => {
    setMembers(members.map(m => m.id === id ? { ...m, role } : m));
    setToastMessage('팀원 역할이 변경되었습니다!');
    setToastType('info');
    setShowToast(true);
  };
  // 필터 적용
  const handleFilter = (filterObj) => {
    setFilterState(filterObj);
    setToastMessage('필터가 적용되었습니다!');
    setToastType('info');
    setShowToast(true);
  };

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
  const handleAddProject = (projectData) => {
    if (!projectData.name.trim() || !projectData.startDate || !projectData.endDate) {
      setToastMessage('프로젝트명, 시작일, 종료일을 입력하세요.');
      setToastType('error');
      setShowToast(true);
      return;
    }
    setProjects([
      {
        ...projectData,
        id: Date.now(),
        milestones: [],
        files: [],
        notes: projectData.notes || ''
      },
      ...projects
    ]);
    setShowAddModal(false);
    setToastMessage('새 프로젝트가 추가되었습니다!');
    setToastType('success');
    setShowToast(true);
  };

  // 팀원 아바타 직접 구현
  const TeamAvatars = ({ members }) => (
    <div className="flex -space-x-2">
      {members.slice(0, 3).map(m => (
        <img key={m.id} src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full border-2 border-white shadow" />
      ))}
      {members.length > 3 && (
        <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-xs font-bold border-2 border-white">+{members.length - 3}</span>
      )}
    </div>
  );

  // 전체 진행률 계산
  const getTotalProgress = () => {
    if (projects.length === 0) return 0;
    const total = projects.reduce((acc, p) => acc + getProgressPercentage(p.milestones), 0);
    return Math.round(total / projects.length);
  };

  // 탭바를 메인 컨텐츠 상단에 pill 스타일로 표시
  const TabBar = () => (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex flex-row gap-2">
        {[
          { id: 'board', label: '보드', icon: <Layout className="w-4 h-4 mr-1" /> },
          { id: 'list', label: '리스트', icon: <List className="w-4 h-4 mr-1" /> },
          { id: 'timeline', label: '타임라인', icon: <Clock className="w-4 h-4 mr-1" /> },
          { id: 'files', label: '파일', icon: <File className="w-4 h-4 mr-1" /> },
          { id: 'notes', label: '노트', icon: <StickyNote className="w-4 h-4 mr-1" /> },
        ].map(tab => (
          <button
            key={tab.id}
            className={`flex items-center px-4 py-2 rounded-full border transition-all text-sm font-medium
              ${activeTab === tab.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-blue-50 hover:text-blue-700'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  // 보드(칸반) 뷰 구조 (상태별 컬럼, 카드, 빠른 할 일 추가)
  const boardColumns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
    { id: 'inprogress', title: 'In Progress', color: 'bg-blue-50' },
    { id: 'done', title: 'Done', color: 'bg-green-50' },
  ];
  // 프로젝트를 상태별로 분류(샘플: status 필드 활용)
  const getColumnTasks = (colId) => {
    if (colId === 'todo') return projects.filter(p => p.status === '진행 중');
    if (colId === 'inprogress') return [];
    if (colId === 'done') return projects.filter(p => p.status === '완료');
    return [];
  };
  const BoardView = () => (
    <div className="flex gap-6 overflow-x-auto py-8 min-h-[400px]">
      {boardColumns.map(col => (
        <div key={col.id} className={`w-80 flex-shrink-0 rounded-2xl shadow-md border border-gray-200 p-4 ${col.color} flex flex-col`}>
          <div className="flex items-center gap-2 mb-4">
            <span className="font-bold text-lg">{col.title}</span>
            {col.id === 'todo' && <span className="text-xs text-gray-400">(진행 중)</span>}
            {col.id === 'done' && <span className="text-xs text-gray-400">(완료)</span>}
          </div>
          <div className="flex-1 space-y-4">
            {getColumnTasks(col.id).map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          <Button variant="ghost" className="mt-4 w-full">+ 할 일 추가</Button>
        </div>
      ))}
    </div>
  );

  // 리스트 뷰
  const ListView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">프로젝트명</th>
            <th className="px-4 py-2">상태</th>
            <th className="px-4 py-2">담당자</th>
            <th className="px-4 py-2">마감일</th>
            <th className="px-4 py-2">진행률</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.id} className="border-b hover:bg-blue-50 transition">
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${p.status === '완료' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {p.status}
                </span>
              </td>
              <td className="px-4 py-2">{members[0]?.name || '-'}</td>
              <td className="px-4 py-2">{p.endDate}</td>
              <td className="px-4 py-2">{getProgressPercentage(p.milestones)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // 타임라인(간트차트) 뷰 - Linear/UXDesign 스타일
  const TimelineView = () => (
    <div className="py-6 px-2">
      {projects.map(p => (
        <div key={p.id} className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-lg">{p.name}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium
              ${p.status === '완료' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{p.status}</span>
          </div>
          <div className="relative pl-6">
            {/* 세로 타임라인 축 */}
            <div className="absolute left-2 top-0 bottom-0 w-1 bg-gray-200 rounded-full" />
            <ul className="space-y-6">
              {p.milestones.map((m, idx) => (
                <li key={m.id} className="relative flex items-center group">
                  {/* 타임라인 점 */}
                  <span className={`absolute left-[-10px] w-4 h-4 rounded-full border-2
                    ${m.completed ? 'bg-green-500 border-green-500' : 'bg-white border-blue-400 group-hover:bg-blue-100'}`}></span>
                  <div className="flex-1 flex items-center justify-between bg-white rounded-lg shadow-sm px-4 py-3 ml-4">
                    <div>
                      <span className={`font-medium ${m.completed ? 'line-through text-gray-400' : ''}`}>{m.title}</span>
                      <span className="ml-2 text-xs text-gray-500">{m.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full
                        ${m.completed ? 'bg-green-100 text-green-700' : (new Date(m.dueDate) < new Date() ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700')}`}>{m.completed ? '완료' : (new Date(m.dueDate) < new Date() ? '지연' : '진행 중')}</span>
                      <button
                        className={`w-6 h-6 rounded-full border flex items-center justify-center
                          ${m.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-gray-400 hover:bg-blue-50'}`}
                        title={m.completed ? '완료됨' : '완료로 체크'}
                        // onClick={() => ...}
                      >
                        {m.completed ? <CheckCircle className="w-4 h-4" /> : <span className="w-2 h-2 bg-blue-400 rounded-full block" />}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );

  // 노트 뷰 
  const NotesView = () => (
    <div className="py-6 px-2">
      {projects.map(p => (
        <div key={p.id} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-base">{p.name}</span>
            <span className="text-xs text-gray-400">{p.status}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(p.notes ? [p.notes] : []).map((note, idx) => (
              <div key={idx} className="bg-white border border-yellow-200 rounded-xl shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">작성일: {new Date().toLocaleDateString()}</span>
                  {/* <button className="text-gray-400 hover:text-red-500">삭제</button> */}
                </div>
                <div className="text-gray-800 text-sm whitespace-pre-line">{note}</div>
                {/* 태그/담당자 등 추가 가능 */}
              </div>
            ))}
            {!p.notes && (
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400">
                노트가 없습니다.<br />새 노트를 추가해보세요!
              </div>
            )}
          </div>
        </div>
      ))}
      {/* 플로팅 노트 추가 버튼 등도 추가 가능 */}
    </div>
  );

  // 파일 뷰 (FilesView) 구현
  const FilesView = () => (
    <div className="py-6 px-2">
      {projects.map(p => (
        <div key={p.id} className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-lg">{p.name}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium
              ${p.status === '완료' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{p.status}</span>
          </div>
          <div className="space-y-2 mb-4">
            {p.files.length === 0 ? (
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400">
                첨부된 파일이 없습니다.<br />자료를 추가해보세요!
              </div>
            ) : (
              p.files.map(file => (
                <div key={file.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                  {file.type === 'link' ? (
                    <Link className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  ) : file.type === 'image' ? (
                    <span className="text-lg">🖼️</span>
                  ) : (
                    <FileText className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  )}
                  <span className="flex-grow text-sm text-gray-700 truncate">{file.name}</span>
                  <button className="text-red-600 hover:text-red-800" title="삭제">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
          {/* 업로드 영역 (실제 업로드 기능은 추후 구현) */}
          <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">파일을 드래그하거나 클릭하여 업로드</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* 해더 직접 작성 */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-20 shadow-sm">
        <div className="max-w mx-auto px-6 py-0.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* 좌측: 타이틀/설명 */}
          <div className="flex items-center gap-4 min-w-[200px]">
            <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
              <FolderOpen size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                프로젝트 관리
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">진행 중인 프로젝트를 한눈에 관리하세요!</p>
            </div>
          </div>
          {/* 중앙: 진행률/팀원 */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 flex-1 justify-center md:justify-start">
            <div className="flex items-center gap-3 bg-slate-50/80 backdrop-blur px-4 py-2.5 rounded-xl border border-slate-200/50">
              <span className="text-xs font-medium text-slate-600">전체 진행률</span>
              <div className="w-32"><ProgressBar value={getTotalProgress()} /></div>
              <span className="text-sm font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded-lg">
                {getTotalProgress()}%
              </span>
            </div>
            <TeamAvatars members={members} />
          </div>
          {/* 우측: 액션 버튼/새 프로젝트 */}
          <div className="flex gap-2">
            <button 
              className="p-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200"
              onClick={() => { setSelectedProject(projects[0]); setShowSettings(true); }}
            >
              <Settings size={18} />
            </button>
            <button 
              className="p-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200"
              onClick={() => setShowInvite(true)}
            >
              <Users size={18} />
            </button>
            <button 
              className="p-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200"
              onClick={() => setShowFilter(true)}
            >
              <Filter size={18} />
            </button>
            <button 
              className="px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-violet-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 font-medium"
              onClick={() => setShowAdd(true)}
            >
              <Plus size={18} /> 새 프로젝트
            </button>
          </div>
        </div>
        <ProjectSettingsModal
          open={showSettings}
          onClose={() => setShowSettings(false)}
          onSave={handleProjectSave}
          onDelete={handleProjectDelete}
          onArchive={handleProjectArchive}
          project={selectedProject}
        />
        <ProjectInviteModal
          open={showInvite}
          onClose={() => setShowInvite(false)}
          onInvite={handleInvite}
          members={members}
          onRemove={handleRemoveMember}
          onRoleChange={handleRoleChange}
        />
        <ProjectFilterModal
          open={showFilter}
          onClose={() => setShowFilter(false)}
          onFilter={handleFilter}
          filterState={filterState}
          members={members}
        />
        <ProjectAddModal
          open={showAdd}
          onClose={() => setShowAdd(false)}
          onAdd={handleAddProject}
          members={members}
        />
      </div>
      {/* 탭바, 메인 컨텐츠 등 기존 구조 유지 */}
      <TabBar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
          {/* 탭별 뷰 렌더링 */}
          {activeTab === 'board' && <BoardView />}
          {activeTab === 'list' && <ListView />}
          {activeTab === 'timeline' && <TimelineView />}
          {activeTab === 'files' && <FilesView />}
          {activeTab === 'notes' && <NotesView />}
          {/* 프로젝트 상세 슬라이드, Toast 등 기존 코드 유지 */}
          {selectedProject && (
            <div className="mt-8">
              <ProjectDetail project={selectedProject} />
            </div>
          )}
          <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
            {/* ...기존 모달 코드... */}
            <Button onClick={handleAddProject}>추가</Button>
          </Modal>
          {/* <InviteModal /> */}
          <Toast open={showToast} onClose={() => setShowToast(false)} type={toastType}>{toastMessage}</Toast>
        </div>
      </div>
    </div>
  );
} 
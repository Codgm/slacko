import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, Target, Plus, Calendar, CheckCircle2, Circle,
  Edit2, Flag, Clock,
} from 'lucide-react';
import { useProjectContext } from '../../context/ProjectContext';

const MilestoneModal = ({ 
  show, 
  onClose, 
  project,
  onMilestonesUpdate 
}) => {
  const { 
    getMilestonesByProjectId,
    createMilestone, 
    updateMilestone,
    loading 
  } = useProjectContext();

  const [milestones, setMilestones] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    date: '',
    priority: 'medium'
  });

  // 마일스톤 로드 함수를 useCallback으로 래핑
  const loadMilestones = useCallback(async () => {
    if (!project) return;
    
    try {
      const projectMilestones = await getMilestonesByProjectId(project.id);
      setMilestones(projectMilestones);
    } catch (error) {
      console.error('마일스톤 로드 실패:', error);
      // 프로젝트에서 기본 마일스톤 사용
      setMilestones(project.milestones || []);
    }
  }, [project, getMilestonesByProjectId]);

  // 컴포넌트 마운트 시 마일스톤 로드
  useEffect(() => {
    if (show && project) {
      loadMilestones();
    }
  }, [show, project, loadMilestones]);

  // 마일스톤 생성
  const handleCreateMilestone = async (e) => {
    e.preventDefault();
    
    try {
      const milestoneData = {
        ...newMilestone,
        completed: false,
        createdAt: new Date().toISOString()
      };

      const createdMilestone = await createMilestone(project.id, milestoneData);
      const updatedMilestones = [...milestones, createdMilestone];
      setMilestones(updatedMilestones);
      onMilestonesUpdate?.(project.id, updatedMilestones);
      
      // 폼 초기화
      setNewMilestone({ title: '', description: '', date: '', priority: 'medium' });
      setShowCreateForm(false);

    } catch (error) {
      console.error('마일스톤 생성 실패:', error);
      alert('마일스톤 생성에 실패했습니다.');
    }
  };

  // 마일스톤 완료 상태 토글
  const handleToggleCompletion = async (milestone) => {
    try {
      const updatedData = { 
        completed: !milestone.completed,
        completedAt: !milestone.completed ? new Date().toISOString() : null
      };

      await updateMilestone(milestone.id, updatedData);
      
      const updatedMilestones = milestones.map(m => 
        m.id === milestone.id ? { ...m, ...updatedData } : m
      );
      setMilestones(updatedMilestones);
      onMilestonesUpdate?.(project.id, updatedMilestones);

    } catch (error) {
      console.error('마일스톤 상태 업데이트 실패:', error);
      alert('마일스톤 상태 변경에 실패했습니다.');
    }
  };

  // 마일스톤 편집
  const handleEditMilestone = async (milestoneData) => {
    try {
      await updateMilestone(editingMilestone.id, milestoneData);
      
      const updatedMilestones = milestones.map(m => 
        m.id === editingMilestone.id ? { ...m, ...milestoneData } : m
      );
      setMilestones(updatedMilestones);
      onMilestonesUpdate?.(project.id, updatedMilestones);
      setEditingMilestone(null);

    } catch (error) {
      console.error('마일스톤 수정 실패:', error);
      alert('마일스톤 수정에 실패했습니다.');
    }
  };

  // 우선순위 색상
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // 날짜별 정렬된 마일스톤
  const sortedMilestones = [...milestones].sort((a, b) => new Date(a.date) - new Date(b.date));

  // 통계 계산
  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter(m => m.completed).length;
  const overdueMilestones = milestones.filter(m => 
    !m.completed && new Date(m.date) < new Date()
  ).length;
  const upcomingMilestones = milestones.filter(m => 
    !m.completed && new Date(m.date) >= new Date()
  ).length;

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Target className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">마일스톤 관리</h2>
                <p className="text-sm text-slate-600">{project?.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <div className="text-2xl font-bold text-slate-900">{totalMilestones}</div>
              <div className="text-xs text-slate-600">전체</div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3 text-center shadow-sm border border-emerald-100">
              <div className="text-2xl font-bold text-emerald-600">{completedMilestones}</div>
              <div className="text-xs text-emerald-600">완료</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center shadow-sm border border-red-100">
              <div className="text-2xl font-bold text-red-600">{overdueMilestones}</div>
              <div className="text-xs text-red-600">지연</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center shadow-sm border border-blue-100">
              <div className="text-2xl font-bold text-blue-600">{upcomingMilestones}</div>
              <div className="text-xs text-blue-600">예정</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              {totalMilestones > 0 && (
                <span>
                  진행률: {Math.round((completedMilestones / totalMilestones) * 100)}%
                </span>
              )}
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              마일스톤 추가
            </button>
          </div>

          {/* Progress Bar */}
          {totalMilestones > 0 && (
            <div className="w-full bg-slate-200 rounded-full h-3 mt-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(completedMilestones / totalMilestones) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Milestones List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {sortedMilestones.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Target className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">마일스톤이 없습니다</p>
              <p className="text-sm mt-1">첫 번째 마일스톤을 추가해보세요</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedMilestones.map((milestone, index) => {
                const isOverdue = !milestone.completed && new Date(milestone.date) < new Date();
                const daysUntil = Math.ceil((new Date(milestone.date) - new Date()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div 
                    key={milestone.id} 
                    className={`relative p-4 sm:p-6 rounded-xl border transition-all duration-200 ${
                      milestone.completed 
                        ? 'bg-emerald-50 border-emerald-200' 
                        : isOverdue 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-white border-slate-200 hover:shadow-md'
                    }`}
                  >
                    {/* Timeline Line */}
                    {index < sortedMilestones.length - 1 && (
                      <div className="absolute left-4 sm:left-6 top-16 sm:top-20 w-0.5 h-8 bg-slate-200"></div>
                    )}

                    <div className="flex items-start gap-4">
                      {/* Status Icon */}
                      <button
                        onClick={() => handleToggleCompletion(milestone)}
                        className="mt-1"
                      >
                        {milestone.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-400 hover:text-blue-500" />
                        )}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <h3 className={`text-lg font-semibold ${
                              milestone.completed 
                                ? 'text-emerald-700 line-through' 
                                : 'text-slate-900'
                            }`}>
                              {milestone.title}
                            </h3>
                            
                            {milestone.description && (
                              <p className="text-sm text-slate-600 mt-1">
                                {milestone.description}
                              </p>
                            )}

                            <div className="flex items-center gap-4 mt-3 text-sm">
                              <div className="flex items-center gap-1 text-slate-600">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(milestone.date).toLocaleDateString('ko-KR', {
                                  year: 'numeric',
                                  month: 'short', 
                                  day: 'numeric'
                                })}</span>
                              </div>

                              {milestone.priority && (
                                <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(milestone.priority)}`}>
                                  <Flag className="w-3 h-3 inline mr-1" />
                                  {milestone.priority.toUpperCase()}
                                </span>
                              )}

                              {!milestone.completed && (
                                <div className={`flex items-center gap-1 text-xs ${
                                  isOverdue ? 'text-red-600' : daysUntil <= 7 ? 'text-orange-600' : 'text-slate-500'
                                }`}>
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    {isOverdue 
                                      ? `${Math.abs(daysUntil)}일 지연` 
                                      : daysUntil === 0 
                                      ? '오늘 마감' 
                                      : `${daysUntil}일 남음`
                                    }
                                  </span>
                                </div>
                              )}

                              {milestone.completed && milestone.completedAt && (
                                <div className="flex items-center gap-1 text-xs text-emerald-600">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>
                                    {new Date(milestone.completedAt).toLocaleDateString('ko-KR')} 완료
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingMilestone(milestone)}
                              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors"
                              title="편집"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Create Milestone Form */}
        {showCreateForm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-10">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">새 마일스톤</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateMilestone} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">제목</label>
                  <input
                    type="text"
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="마일스톤 제목을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">설명 (선택)</label>
                  <textarea
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="마일스톤에 대한 설명을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">마감일</label>
                  <input
                    type="date"
                    value={newMilestone.date}
                    onChange={(e) => setNewMilestone({...newMilestone, date: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">우선순위</label>
                  <select
                    value={newMilestone.priority}
                    onChange={(e) => setNewMilestone({...newMilestone, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">낮음</option>
                    <option value="medium">보통</option>
                    <option value="high">높음</option>
                    <option value="critical">긴급</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    생성
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Milestone Form */}
        {editingMilestone && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-10">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">마일스톤 편집</h3>
                <button
                  onClick={() => setEditingMilestone(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleEditMilestone({
                  title: formData.get('title'),
                  description: formData.get('description'),
                  date: formData.get('date'),
                  priority: formData.get('priority')
                });
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">제목</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingMilestone.title}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">설명 (선택)</label>
                  <textarea
                    name="description"
                    defaultValue={editingMilestone.description || ''}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">마감일</label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={editingMilestone.date}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">우선순위</label>
                  <select
                    name="priority"
                    defaultValue={editingMilestone.priority || 'medium'}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">낮음</option>
                    <option value="medium">보통</option>
                    <option value="high">높음</option>
                    <option value="critical">긴급</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingMilestone(null)}
                    className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    저장
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestoneModal;
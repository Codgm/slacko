import React, { useState } from 'react';
import { 
  CheckCircle2, Circle, Clock, Calendar, User, 
  MoreHorizontal, Edit2, Trash2, MessageSquare, 
  Paperclip, ChevronDown, ChevronRight, AlertTriangle,
  X, Plus, Minus
} from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import { useProjectContext } from '../../context/ProjectContext';

const TaskCard = ({ task, projectId, onUpdate, onDelete, compact = false }) => {
  const { updateTask, deleteTask: deleteTaskFromProject } = useProjectContext();
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 편집 폼 상태
  const [editForm, setEditForm] = useState({
    title: task.title || '',
    description: task.description || '',
    priority: task.priority || 'medium',
    status: task.status || 'todo',
    assignee: task.assignee?.name || '',
    dueDate: task.dueDate || '',
    estimatedHours: task.estimatedHours || '',
    labels: task.labels ? [...task.labels] : [],
    subtasks: task.subtasks ? [...task.subtasks] : []
  });
  const [newLabel, setNewLabel] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  const handleStatusToggle = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const newStatus = task.status === 'completed' ? 'in-progress' : 'completed';
      
      if (onUpdate) {
        await onUpdate(task.id, { status: newStatus });
      } else if (projectId) {
        await updateTask(projectId, task.id, { status: newStatus });
      }
    } catch (error) {
      console.error('태스크 상태 변경 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      if (onDelete) {
        await onDelete(task.id);
      } else if (projectId) {
        await deleteTaskFromProject(projectId, task.id);
      }
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('태스크 삭제 실패:', error);
      setShowDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setShowActions(false);
    setEditForm({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'medium',
      status: task.status || 'todo',
      assignee: task.assignee?.name || '',
      dueDate: task.dueDate || '',
      estimatedHours: task.estimatedHours || '',
      labels: task.labels ? [...task.labels] : [],
      subtasks: task.subtasks ? [...task.subtasks] : []
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const updatedTaskData = {
        ...editForm,
        assignee: editForm.assignee ? { 
          name: editForm.assignee,
          id: task.assignee?.id || null
        } : null,
        estimatedHours: editForm.estimatedHours ? Number(editForm.estimatedHours) : null
      };

      if (onUpdate) {
        await onUpdate(task.id, updatedTaskData);
      } else if (projectId) {
        await updateTask(projectId, task.id, updatedTaskData);
      }

      setShowEditModal(false);
    } catch (error) {
      console.error('태스크 수정 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const addLabel = () => {
    if (newLabel.trim() && !editForm.labels.includes(newLabel.trim())) {
      setEditForm(prev => ({
        ...prev,
        labels: [...prev.labels, newLabel.trim()]
      }));
      setNewLabel('');
    }
  };

  const removeLabel = (labelToRemove) => {
    setEditForm(prev => ({
      ...prev,
      labels: prev.labels.filter(label => label !== labelToRemove)
    }));
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      const newSt = {
        id: Date.now().toString(),
        title: newSubtask.trim(),
        completed: false
      };
      setEditForm(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, newSt]
      }));
      setNewSubtask('');
    }
  };

  const removeSubtask = (subtaskId) => {
    setEditForm(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(st => st.id !== subtaskId)
    }));
  };

  const updateSubtask = (subtaskId, field, value) => {
    setEditForm(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(st =>
        st.id === subtaskId ? { ...st, [field]: value } : st
      )
    }));
  };

  const handleSubtaskToggle = async (subtaskId) => {
    if (loading) return;
    
    const updatedSubtasks = task.subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    setLoading(true);
    try {
      if (onUpdate) {
        await onUpdate(task.id, { subtasks: updatedSubtasks });
      } else if (projectId) {
        await updateTask(projectId, task.id, { subtasks: updatedSubtasks });
      }
    } catch (error) {
      console.error('하위 작업 상태 변경 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (task.status === 'completed') {
      return <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />;
    }
    return <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />;
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed': return 'bg-emerald-50 border-emerald-200';
      case 'in-progress': return 'bg-blue-50 border-blue-200';
      case 'blocked': return 'bg-red-50 border-red-200';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  if (compact) {
    return (
      <>
        <div className={`p-3 sm:p-4 border rounded-lg ${getStatusColor()} hover:shadow-sm transition-all duration-200 ${loading ? 'opacity-60' : ''}`}>
          <div className="flex items-start gap-3">
            <button 
              onClick={handleStatusToggle} 
              className="mt-0.5"
              disabled={loading}
            >
              {getStatusIcon()}
            </button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className={`text-sm font-semibold ${
                  task.status === 'completed' 
                    ? 'text-slate-500 line-through' 
                    : 'text-slate-900'
                }`}>
                  {task.title}
                </h4>
                
                <div className="flex items-center gap-1">
                  <PriorityBadge priority={task.priority} size="sm" />
                  {(onUpdate || onDelete || projectId) && (
                    <div className="relative">
                      <button
                        onClick={() => setShowActions(!showActions)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded"
                        disabled={loading}
                      >
                        <MoreHorizontal className="w-3 h-3" />
                      </button>
                      
                      {showActions && (
                        <div className="absolute right-0 top-6 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20 min-w-[120px]">
                          <button
                            onClick={handleEdit}
                            disabled={loading}
                            className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50"
                          >
                            <Edit2 className="w-3 h-3" />
                            편집
                          </button>
                          <button
                            onClick={() => {
                              setShowActions(false);
                              setShowDeleteConfirm(true);
                            }}
                            disabled={loading}
                            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                          >
                            <Trash2 className="w-3 h-3" />
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {task.assignee && (
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                  <User className="w-3 h-3" />
                  <span>{task.assignee.name}</span>
                  {isOverdue && (
                    <span className="text-red-600 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      지연
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && <EditModal />}
        
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && <DeleteModal />}
      </>
    );
  }

  // Edit Modal Component
  const EditModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900">태스크 편집</h3>
          <button
            onClick={() => setShowEditModal(false)}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">제목</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="태스크 제목을 입력하세요"
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">설명</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="태스크 설명을 입력하세요"
                disabled={loading}
              />
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">상태</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="todo">할 일</option>
                  <option value="in-progress">진행 중</option>
                  <option value="completed">완료</option>
                  <option value="blocked">차단됨</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">우선순위</label>
                <select
                  value={editForm.priority}
                  onChange={(e) => setEditForm(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="low">낮음</option>
                  <option value="medium">보통</option>
                  <option value="high">높음</option>
                  <option value="urgent">긴급</option>
                </select>
              </div>
            </div>

            {/* Assignee and Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">담당자</label>
                <input
                  type="text"
                  value={editForm.assignee}
                  onChange={(e) => setEditForm(prev => ({ ...prev, assignee: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="담당자 이름"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">마감일</label>
                <input
                  type="date"
                  value={editForm.dueDate}
                  onChange={(e) => setEditForm(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Estimated Hours */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">예상 시간 (시간)</label>
              <input
                type="number"
                value={editForm.estimatedHours}
                onChange={(e) => setEditForm(prev => ({ ...prev, estimatedHours: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예상 소요 시간"
                min="0"
                step="0.5"
                disabled={loading}
              />
            </div>

            {/* Labels */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">라벨</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {editForm.labels.map(label => (
                  <span key={label} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-md font-medium flex items-center gap-1">
                    {label}
                    <button
                      type="button"
                      onClick={() => removeLabel(label)}
                      className="text-indigo-500 hover:text-indigo-700"
                      disabled={loading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addLabel()}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="새 라벨 추가"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={addLabel}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Subtasks */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">하위 작업</label>
              <div className="space-y-2 mb-3">
                {editForm.subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={(e) => updateSubtask(subtask.id, 'completed', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      disabled={loading}
                    />
                    <input
                      type="text"
                      value={subtask.title}
                      onChange={(e) => updateSubtask(subtask.id, 'title', e.target.value)}
                      className="flex-1 px-2 py-1 bg-transparent border-none focus:outline-none focus:ring-0"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => removeSubtask(subtask.id)}
                      className="text-red-500 hover:text-red-700"
                      disabled={loading}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="새 하위 작업 추가"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={addSubtask}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-slate-200">
          <button
            onClick={() => setShowEditModal(false)}
            disabled={loading}
            className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleSaveEdit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );

  const DeleteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">태스크 삭제</h3>
            <p className="text-sm text-slate-600 mt-1">정말로 이 태스크를 삭제하시겠습니까?</p>
          </div>
        </div>
        
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <p className="font-medium text-slate-900">{task.title}</p>
          {task.description && (
            <p className="text-sm text-slate-600 mt-2">{task.description}</p>
          )}
          {totalSubtasks > 0 && (
            <p className="text-sm text-slate-500 mt-2">
              {totalSubtasks}개의 하위 작업도 함께 삭제됩니다.
            </p>
          )}
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            disabled={loading}
            className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            {loading ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={`p-4 sm:p-6 border rounded-xl ${getStatusColor()} hover:shadow-md transition-all duration-200 ${loading ? 'opacity-60' : ''}`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button 
              onClick={handleStatusToggle} 
              className="mt-0.5"
              disabled={loading}
            >
              {getStatusIcon()}
            </button>
            
            <div className="flex-1 min-w-0">
              <h3 className={`text-base sm:text-lg font-semibold ${
                task.status === 'completed' 
                  ? 'text-slate-500 line-through' 
                  : 'text-slate-900'
              }`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PriorityBadge priority={task.priority} />
            
            {(onUpdate || onDelete || projectId) && (
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors"
                  disabled={loading}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                
                {showActions && (
                  <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-20 min-w-[140px]">
                    <button
                      onClick={handleEdit}
                      disabled={loading}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50"
                    >
                      <Edit2 className="w-4 h-4" />
                      편집
                    </button>
                    <button
                      onClick={() => {
                        setShowActions(false);
                        setShowDeleteConfirm(true);
                      }}
                      disabled={loading}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      삭제
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Task Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4 text-sm">
          {task.assignee && (
            <div className="flex items-center gap-2 text-slate-600">
              <User className="w-4 h-4" />
              <span>{task.assignee.name}</span>
            </div>
          )}
          
          {task.dueDate && (
            <div className={`flex items-center gap-2 ${
              isOverdue ? 'text-red-600 font-medium' : 'text-slate-600'
            }`}>
              <Calendar className="w-4 h-4" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              {isOverdue && <AlertTriangle className="w-4 h-4" />}
            </div>
          )}
          
          {task.estimatedHours && (
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-4 h-4" />
              <span>{task.estimatedHours}h 예상</span>
              {task.actualHours && (
                <span className="text-slate-500">/ {task.actualHours}h 실제</span>
              )}
            </div>
          )}
        </div>

        {/* Labels */}
        {task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {task.labels.map(label => (
              <span key={label} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-md font-medium">
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Subtasks */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="border-t border-slate-200 pt-4">
            <button
              onClick={() => setShowSubtasks(!showSubtasks)}
              disabled={loading}
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 mb-3 disabled:opacity-50"
            >
              {showSubtasks ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              하위 작업 ({completedSubtasks}/{totalSubtasks})
              <div className="flex-1 bg-slate-200 rounded-full h-2 ml-2">
                <div 
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${subtaskProgress}%` }}
                />
              </div>
            </button>
            
            {showSubtasks && (
              <div className="space-y-2 ml-2">
                {task.subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <button
                      onClick={() => handleSubtaskToggle(subtask.id)}
                      disabled={loading}
                    >
                      {subtask.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <span className={`text-sm ${
                      subtask.completed 
                        ? 'text-slate-500 line-through' 
                        : 'text-slate-700'
                    }`}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            {task.comments > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                <span>{task.comments}</span>
              </div>
            )}
            {task.attachments > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip className="w-3 h-3" />
                <span>{task.attachments}</span>
              </div>
            )}
          </div>
          
          <div className="text-xs text-slate-500">
            생성: {new Date(task.createdAt || Date.now()).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && <EditModal />}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && <DeleteModal />}

      {/* Actions Dropdown Backdrop */}
      {showActions && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowActions(false)}
        />
      )}
    </>
  );
};

export default TaskCard;
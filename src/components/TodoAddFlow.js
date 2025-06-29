import { useState } from 'react';
import { Plus, X, Calendar, AlarmClock, Target, ChevronDown, ChevronUp } from 'lucide-react';

const TodoAddFlow = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [todoList, setTodoList] = useState([
    { id: 1, task: '자료구조 알고리즘 복습', priority: 'high', completed: false, category: '학습', deadline: '2025-07-05' },
    { id: 2, task: '프로젝트 API 설계서 작성', priority: 'high', completed: false, category: '프로젝트', deadline: '2025-07-03' },
    { id: 3, task: '영어 단어 100개 암기', priority: 'medium', completed: true, category: '학습', deadline: '2025-07-02' },
  ]);

  const [newTodo, setNewTodo] = useState({
    task: '',
    priority: 'medium',
    category: '학습',
    deadline: '',
    estimatedTime: '',
    description: '',
    reminder: false
  });

  // 플로팅 버튼 방식과 인라인 폼 방식 상태
  const [quickAddMode, setQuickAddMode] = useState(false);
  const [quickTask, setQuickTask] = useState('');

  const priorities = {
    high: { label: '높음', color: 'bg-red-50 text-red-700 border-red-200', icon: '🔥' },
    medium: { label: '보통', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: '⚡' },
    low: { label: '낮음', color: 'bg-green-50 text-green-700 border-green-200', icon: '🌱' }
  };

  const categories = ['학습', '프로젝트', '과제', '시험', '기타'];

  const resetForm = () => {
    setNewTodo({
      task: '',
      priority: 'medium',
      category: '학습',
      deadline: '',
      estimatedTime: '',
      description: '',
      reminder: false
    });
    setShowAdvanced(false);
  };

  const handleAddTodo = () => {
    if (!newTodo.task.trim()) return;

    const todo = {
      id: Date.now(),
      task: newTodo.task,
      priority: newTodo.priority,
      category: newTodo.category,
      deadline: newTodo.deadline,
      estimatedTime: newTodo.estimatedTime,
      description: newTodo.description,
      reminder: newTodo.reminder,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTodoList(prev => [todo, ...prev]);
    setShowAddModal(false);
    resetForm();
  };

  const handleQuickAdd = () => {
    if (!quickTask.trim()) return;

    const todo = {
      id: Date.now(),
      task: quickTask,
      priority: 'medium',
      category: '학습',
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTodoList(prev => [todo, ...prev]);
    setQuickTask('');
    setQuickAddMode(false);
  };

  const toggleTodo = (id) => {
    setTodoList(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const getPriorityConfig = (priority) => priorities[priority] || priorities.medium;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* 헤더 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">오늘의 할 일</h2>
            </div>
            
            {/* 추가 방식 선택 버튼들 */}
            <div className="flex gap-2">
              <button
                onClick={() => setQuickAddMode(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
                빠른 추가
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                상세 추가
              </button>
            </div>
          </div>
        </div>

        {/* 빠른 추가 인라인 폼 */}
        {quickAddMode && (
          <div className="p-4 bg-blue-50 border-b border-blue-200">
            <div className="flex gap-3">
              <input
                type="text"
                value={quickTask}
                onChange={(e) => setQuickTask(e.target.value)}
                placeholder="할 일을 입력하고 Enter를 누르세요"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleQuickAdd()}
                autoFocus
              />
              <button
                onClick={handleQuickAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                추가
              </button>
              <button
                onClick={() => {
                  setQuickAddMode(false);
                  setQuickTask('');
                }}
                className="px-3 py-2 text-gray-600 hover:text-gray-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 할일 목록 */}
        <div className="p-6">
          <div className="space-y-3">
            {todoList.map((todo) => {
              const priorityConfig = getPriorityConfig(todo.priority);
              return (
                <div 
                  key={todo.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:shadow-sm'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className={`${todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {todo.task}
                    </span>
                    {todo.category && (
                      <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {todo.category}
                      </span>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityConfig.color}`}>
                    {priorityConfig.icon} {priorityConfig.label}
                  </span>
                  {todo.deadline && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(todo.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 상세 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">새 할 일 추가</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {/* 기본 정보 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  할 일 *
                </label>
                <input
                  type="text"
                  value={newTodo.task}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, task: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 데이터베이스 과제 완료하기"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    우선순위
                  </label>
                  <select
                    value={newTodo.priority}
                    onChange={(e) => setNewTodo(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(priorities).map(([key, config]) => (
                      <option key={key} value={key}>{config.icon} {config.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    카테고리
                  </label>
                  <select
                    value={newTodo.category}
                    onChange={(e) => setNewTodo(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 고급 옵션 토글 */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              >
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                고급 옵션
              </button>

              {/* 고급 옵션 */}
              {showAdvanced && (
                <div className="space-y-4 pt-2 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        마감일
                      </label>
                      <input
                        type="date"
                        value={newTodo.deadline}
                        onChange={(e) => setNewTodo(prev => ({ ...prev, deadline: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        예상 소요시간
                      </label>
                      <input
                        type="text"
                        value={newTodo.estimatedTime}
                        onChange={(e) => setNewTodo(prev => ({ ...prev, estimatedTime: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="예: 2시간"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      메모
                    </label>
                    <textarea
                      value={newTodo.description}
                      onChange={(e) => setNewTodo(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      placeholder="추가 메모나 설명을 입력하세요"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="reminder"
                      checked={newTodo.reminder}
                      onChange={(e) => setNewTodo(prev => ({ ...prev, reminder: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="reminder" className="text-sm text-gray-700 flex items-center gap-2">
                      <AlarmClock className="w-4 h-4" />
                      마감일 알림 받기
                    </label>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 p-4 border-t">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleAddTodo}
                disabled={!newTodo.task.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 플로팅 액션 버튼 (우하단) */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* 사용법 안내 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">💡 할일 추가 방법</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>빠른 추가:</strong> 간단한 할일을 빠르게 추가 (기본 설정 적용)</p>
          <p><strong>상세 추가:</strong> 우선순위, 마감일, 카테고리 등 세부 정보와 함께 추가</p>
          <p><strong>플로팅 버튼:</strong> 어디서든 우하단 버튼으로 빠른 접근 가능</p>
        </div>
      </div>
    </div>
  );
};

export default TodoAddFlow;
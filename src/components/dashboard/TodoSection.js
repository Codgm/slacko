import React from 'react';
import Button from '../common/Button';
import { Plus, X, CheckCircle, Calendar } from 'lucide-react';

export default function TodoSection({
  todoList,
  priorities,
  getPriorityColor,
  toggleTodo,
  setQuickAddMode,
  quickAddMode,
  quickTask,
  setQuickTask,
  handleQuickAdd,
  setShowAddModal,
  showAddModal,
  newTodo,
  setNewTodo,
  showAdvanced,
  setShowAdvanced,
  resetForm,
  handleAddTodo,
  categories
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">오늘의 할 일</h2>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
              {todoList.filter(todo => !todo.completed).length}개 남음
            </span>
          </div>
          {/* 추가 버튼들 */}
          <div className="flex gap-2">
            <Button
              onClick={() => setQuickAddMode(true)}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              빠른 추가
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              variant="primary"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              상세 추가
            </Button>
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
            <Button
              onClick={handleQuickAdd}
              variant="primary"
              size="sm"
            >
              추가
            </Button>
            <Button
              onClick={() => {
                setQuickAddMode(false);
                setQuickTask('');
              }}
              variant="ghost"
              size="sm"
              className="px-3 py-2 text-gray-600 hover:text-gray-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="space-y-3">
          {todoList.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>아직 등록된 할 일이 없습니다.</p>
              <p className="text-sm">위 버튼을 눌러 새로운 할 일을 추가해보세요!</p>
            </div>
          ) : (
            todoList.map((todo) => {
              const priorityConfig = priorities[todo.priority] || priorities.medium;
              return (
                <div 
                  key={todo.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-sm ${
                    todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
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
                    <div className="flex items-center gap-2 mt-1">
                      {todo.category && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {todo.category}
                        </span>
                      )}
                      {todo.deadline && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(todo.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
                    {priorityConfig.icon} {priorityConfig.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
} 
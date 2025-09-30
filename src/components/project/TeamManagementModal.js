import React, { useState, useEffect } from 'react';
import { 
  X, Users, Plus, Mail, Phone, UserMinus, 
  Crown, Edit2, Search, Filter, UserPlus,
  AlertCircle, Check, ChevronDown
} from 'lucide-react';
import { useProjectContext } from '../../context/ProjectContext';

const TeamManagementModal = ({ 
  show, 
  onClose, 
  project,
  onTeamUpdate 
}) => {
  const { 
    getTeamMembers, 
    addTeamMember, 
    removeTeamMember,
    loading 
  } = useProjectContext();

  const [teamMembers, setTeamMembers] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [removingMember, setRemovingMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);

  // 새 멤버 추가 폼 상태
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Developer',
    phone: ''
  });

  // 사용 가능한 역할 목록
  const roles = [
    { value: 'PM', label: '프로젝트 매니저', icon: '👑', color: 'text-purple-600' },
    { value: 'Tech Lead', label: '기술 리드', icon: '🔧', color: 'text-blue-600' },
    { value: 'Developer', label: '개발자', icon: '💻', color: 'text-green-600' },
    { value: 'Designer', label: '디자이너', icon: '🎨', color: 'text-pink-600' },
    { value: 'QA', label: 'QA 엔지니어', icon: '🔍', color: 'text-orange-600' },
    { value: 'DevOps', label: 'DevOps', icon: '⚙️', color: 'text-gray-600' },
    { value: 'Analyst', label: '분석가', icon: '📊', color: 'text-indigo-600' }
  ];

  // 컴포넌트 마운트 시 팀 멤버 로드
  useEffect(() => {
    if (show && project) {
      loadTeamMembers();
    }
  }, [show, project]);

  const loadTeamMembers = async () => {
    try {
      if (project.team) {
        setTeamMembers(project.team);
      }
      
      // 서버에서 최신 팀 정보 조회 (옵션)
      if (project.teamId) {
        const serverMembers = await getTeamMembers(project.teamId);
        setTeamMembers(serverMembers);
      }
    } catch (error) {
      console.error('팀 멤버 로드 실패:', error);
    }
  };

  // 필터링된 팀 멤버 목록
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // 새 멤버 추가
  const handleAddMember = async (e) => {
    e.preventDefault();
    
    try {
      const memberData = {
        ...newMember,
        avatar: `https://i.pravatar.cc/40?u=${newMember.email}`,
        joinedAt: new Date().toISOString()
      };

      // 서버에 추가 시도
      let addedMember;
      if (project.teamId) {
        addedMember = await addTeamMember(project.teamId, memberData);
      } else {
        // 로컬에만 추가
        addedMember = {
          ...memberData,
          id: Date.now(),
          userId: Date.now()
        };
      }

      setTeamMembers(prev => [...prev, addedMember]);
      onTeamUpdate?.(project.id, [...teamMembers, addedMember]);
      
      // 폼 초기화
      setNewMember({ name: '', email: '', role: 'Developer', phone: '' });
      setShowAddMember(false);

    } catch (error) {
      console.error('멤버 추가 실패:', error);
      alert('멤버 추가에 실패했습니다.');
    }
  };

  // 멤버 제거
  const handleRemoveMember = async (member) => {
    try {
      if (project.teamId) {
        await removeTeamMember(project.teamId, member.id);
      }

      const updatedMembers = teamMembers.filter(m => m.id !== member.id);
      setTeamMembers(updatedMembers);
      onTeamUpdate?.(project.id, updatedMembers);
      setRemovingMember(null);

    } catch (error) {
      console.error('멤버 제거 실패:', error);
      alert('멤버 제거에 실패했습니다.');
    }
  };

  // 역할별 통계
  const roleStats = roles.map(role => ({
    ...role,
    count: teamMembers.filter(m => m.role === role.value).length
  }));

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Users className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">팀 관리</h2>
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
              <div className="text-2xl font-bold text-slate-900">{teamMembers.length}</div>
              <div className="text-xs text-slate-600">총 멤버</div>
            </div>
            {roleStats.slice(0, 3).map(role => (
              <div key={role.value} className="bg-white rounded-lg p-3 text-center shadow-sm">
                <div className="text-lg font-bold text-slate-900">{role.count}</div>
                <div className="text-xs text-slate-600">{role.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            {/* Search and Filter */}
            <div className="flex gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="멤버 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">모든 역할</option>
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            {/* Add Member Button */}
            <button
              onClick={() => setShowAddMember(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <UserPlus className="w-4 h-4" />
              멤버 초대
            </button>
          </div>
        </div>

        {/* Team Members List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">
                {searchQuery || roleFilter !== 'all' ? '조건에 맞는 멤버가 없습니다' : '팀 멤버가 없습니다'}
              </p>
              <p className="text-sm mt-1">새 멤버를 초대해보세요</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map(member => {
                const roleInfo = roles.find(r => r.value === member.role) || roles[2];
                const isOwner = member.id === project?.owner?.id;
                
                return (
                  <div key={member.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                    {/* Member Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900">{member.name}</h3>
                            {isOwner && (
                              <Crown className="w-4 h-4 text-yellow-500" title="프로젝트 소유자" />
                            )}
                          </div>
                          <div className={`flex items-center gap-1 text-sm ${roleInfo.color}`}>
                            <span>{roleInfo.icon}</span>
                            <span>{roleInfo.label}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      {!isOwner && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingMember(member)}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="편집"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setRemovingMember(member)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="제거"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-4 h-4" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Join Date */}
                    {member.joinedAt && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-500">
                          참여: {new Date(member.joinedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Member Modal */}
        {showAddMember && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-10">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">새 멤버 초대</h3>
                <button
                  onClick={() => setShowAddMember(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">이름</label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">이메일</label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">역할</label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.icon} {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">전화번호 (선택)</label>
                  <input
                    type="tel"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddMember(false)}
                    className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    초대하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Remove Member Confirmation */}
        {removingMember && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-10">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">멤버 제거</h3>
                  <p className="text-sm text-slate-600">정말로 이 멤버를 팀에서 제거하시겠습니까?</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src={removingMember.avatar}
                    alt={removingMember.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-slate-900">{removingMember.name}</p>
                    <p className="text-sm text-slate-600">{removingMember.role}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setRemovingMember(null)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={() => handleRemoveMember(removingMember)}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
                >
                  제거
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamManagementModal;
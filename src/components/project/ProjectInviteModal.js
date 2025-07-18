import Modal from '../common/Modal';
import Button from '../common/Button';
import { useState } from 'react';

export default function ProjectInviteModal({ open, onClose, onInvite, members = [], onRemove, onRoleChange }) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('멤버');
  const inviteLink = 'https://slacko.app/invite/1234';

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-lg font-bold mb-4">팀원 초대 및 관리</h2>
        <div className="mb-4 flex gap-2">
          <input className="w-full border rounded px-3 py-2" placeholder="이메일 또는 이름" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
          <select className="border rounded px-2 py-2" value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
            <option value="멤버">멤버</option>
            <option value="관리자">관리자</option>
          </select>
          <Button variant="primary" onClick={() => { onInvite(inviteEmail, inviteRole); setInviteEmail(''); }}>초대</Button>
        </div>
        <div className="mb-4 flex gap-2 items-center">
          <input className="w-full border rounded px-3 py-2 text-xs" value={inviteLink} readOnly />
          <Button variant="ghost" onClick={() => { navigator.clipboard.writeText(inviteLink); }}>링크 복사</Button>
        </div>
        <div className="mb-2 text-sm font-semibold">팀원 목록</div>
        <ul className="space-y-2">
          {members.map(m => (
            <li key={m.id} className="flex items-center gap-2 border-b py-2">
              <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-lg">{m.avatar ? <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full" /> : m.name[0]}</span>
              <span className="flex-1">{m.name}</span>
              <select className="border rounded px-2 py-1 text-xs" value={m.role || '멤버'} onChange={e => onRoleChange(m.id, e.target.value)}>
                <option value="멤버">멤버</option>
                <option value="관리자">관리자</option>
              </select>
              <Button variant="ghost" size="sm" onClick={() => onRemove(m.id)}>삭제</Button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2 justify-end mt-6">
          <Button variant="ghost" onClick={onClose}>닫기</Button>
        </div>
      </div>
    </Modal>
  );
} 
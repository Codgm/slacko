import Modal from '../common/Modal';
import Button from '../common/Button';
import { useState } from 'react';

export default function ProjectFilterModal({ open, onClose, onFilter, filterState = {}, members = [] }) {
  const [status, setStatus] = useState(filterState.status || 'all');
  const [assignee, setAssignee] = useState(filterState.assignee || 'all');
  const [due, setDue] = useState(filterState.due || '');
  const [priority, setPriority] = useState(filterState.priority || 'all');
  const [label, setLabel] = useState(filterState.label || '');

  const handleApply = () => {
    onFilter({ status, assignee, due, priority, label });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-lg font-bold mb-4">필터</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">상태</label>
          <select className="w-full border rounded px-3 py-2" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="all">전체</option>
            <option value="진행 중">진행 중</option>
            <option value="완료">완료</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">담당자</label>
          <select className="w-full border rounded px-3 py-2" value={assignee} onChange={e => setAssignee(e.target.value)}>
            <option value="all">전체</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">마감일</label>
          <input type="date" className="w-full border rounded px-3 py-2" value={due} onChange={e => setDue(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">우선순위</label>
          <select className="w-full border rounded px-3 py-2" value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="all">전체</option>
            <option value="높음">높음</option>
            <option value="보통">보통</option>
            <option value="낮음">낮음</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">라벨</label>
          <input className="w-full border rounded px-3 py-2" value={label} onChange={e => setLabel(e.target.value)} />
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <Button variant="ghost" onClick={onClose}>취소</Button>
          <Button variant="primary" onClick={handleApply}>적용</Button>
        </div>
      </div>
    </Modal>
  );
} 
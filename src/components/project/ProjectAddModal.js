import Modal from '../common/Modal';
import Button from '../common/Button';
import { useState } from 'react';

export default function ProjectAddModal({ open, onClose, onAdd, members = [] }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [color, setColor] = useState('#2563eb');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleAdd = () => {
    if (!name.trim() || !start || !end) return;
    onAdd({ name, description: desc, startDate: start, endDate: end, color, members: selectedMembers });
    onClose();
    setName(''); setDesc(''); setStart(''); setEnd(''); setColor('#2563eb'); setSelectedMembers([]);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-lg font-bold mb-4">새 프로젝트 추가</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">프로젝트명</label>
          <input className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">설명</label>
          <textarea className="w-full border rounded px-3 py-2" value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        <div className="mb-4 flex gap-4 items-center">
          <label className="block text-sm font-medium">색상</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} />
        </div>
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">시작일</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={start} onChange={e => setStart(e.target.value)} />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">종료일</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={end} onChange={e => setEnd(e.target.value)} />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">팀원 지정</label>
          <select multiple className="w-full border rounded px-3 py-2" value={selectedMembers} onChange={e => setSelectedMembers(Array.from(e.target.selectedOptions, o => o.value))}>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <Button variant="ghost" onClick={onClose}>취소</Button>
          <Button variant="primary" onClick={handleAdd}>추가</Button>
        </div>
      </div>
    </Modal>
  );
} 
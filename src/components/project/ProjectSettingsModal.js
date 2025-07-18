import Modal from '../common/Modal';
import Button from '../common/Button';
import { useState } from 'react';

export default function ProjectSettingsModal({ open, onClose, onSave, onDelete, onArchive, project }) {
  const [name, setName] = useState(project?.name || '');
  const [desc, setDesc] = useState(project?.description || '');
  const [color, setColor] = useState(project?.color || '#2563eb');
  const [icon, setIcon] = useState(project?.icon || '📁');

  const handleSave = () => {
    onSave({ ...project, name, description: desc, color, icon });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-lg font-bold mb-4">프로젝트 설정</h2>
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
          <label className="block text-sm font-medium ml-4">아이콘</label>
          <input className="w-16 border rounded px-2 py-1" value={icon} onChange={e => setIcon(e.target.value)} maxLength={2} />
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <Button variant="ghost" onClick={onClose}>취소</Button>
          <Button variant="primary" onClick={handleSave}>저장</Button>
        </div>
        <div className="flex gap-2 justify-between mt-6">
          <Button variant="danger" onClick={() => { onDelete(project); onClose(); }}>삭제</Button>
          <Button variant="ghost" onClick={() => { onArchive(project); onClose(); }}>아카이브</Button>
        </div>
      </div>
    </Modal>
  );
} 
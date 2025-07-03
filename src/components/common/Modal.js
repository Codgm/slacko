import React, { useEffect } from 'react';

export default function Modal({ open, onClose, children, className = '', ...props }) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full relative border border-gray-100 transition-all ${className}`}
        onClick={e => e.stopPropagation()}
        {...props}
      >
        {children}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
          aria-label="닫기"
        >
          ×
        </button>
      </div>
    </div>
  );
} 
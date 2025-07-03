import React, { useEffect } from 'react';

const typeStyles = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-blue-600 text-white',
  warning: 'bg-yellow-500 text-white',
};

export default function Toast({ open, onClose, children, type = 'info', duration = 2500, className = '', ...props }) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, onClose, duration]);

  if (!open) return null;

  return (
    <div
      className={`fixed top-8 right-8 z-50 px-6 py-3 rounded-xl shadow-md flex items-center space-x-2 min-w-[200px] max-w-xs ${typeStyles[type]} ${className} animate-fade-in`}
      role="alert"
      aria-live="assertive"
      {...props}
    >
      <span className="flex-1 truncate">{children}</span>
      <button
        onClick={onClose}
        className="ml-2 text-white/80 hover:text-white text-lg font-bold"
        aria-label="닫기"
      >
        ×
      </button>
    </div>
  );
} 
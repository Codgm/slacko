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
      className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${typeStyles[type]} ${className}`}
      role="alert"
      aria-live="assertive"
      {...props}
    >
      {children}
      <button
        className="ml-3 text-white/70 hover:text-white text-lg font-bold"
        onClick={onClose}
        aria-label="닫기"
      >
        ×
      </button>
    </div>
  );
} 
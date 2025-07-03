import React from 'react';

export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
} 
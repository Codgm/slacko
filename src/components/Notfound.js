// components/NotFound.js - 404 페이지 컴포넌트
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 text-center">
      <div className="text-6xl font-bold text-gray-400 mb-4">404</div>
      <h1 className="text-2xl font-semibold text-gray-700 mb-2">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="text-gray-500 mb-8">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>
      
      <div className="flex gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Home size={16} />
          대시보드로 이동
        </Link>
        
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={16} />
          이전 페이지
        </button>
      </div>
    </div>
  );
};

export default NotFound;

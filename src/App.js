// App.js - 메인 앱 컴포넌트
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// 페이지 컴포넌트들 import
import Dashboard from './pages/Dashboard';
import ProjectManagementSystem from './pages/ProjectManagementSystem';
import StudyCalendar from './pages/StudyCalendar';
import StudyManagementSystem from './pages/StudyManagementSystem';
import TextbookManagementSystem from './pages/TextbookManagementSystem';
import Layout from './components/Layout';
import NotFound from './components/Notfound';
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* 대시보드 */}
          <Route path="/" element={<Dashboard />} />
          
          {/* 학습 관리 */}
          <Route path="/study" element={<StudyManagementSystem />} />
          {/* <Route path="/study/:id" element={<StudyDetail />} /> */}
          
          {/* 프로젝트 관리 */}
          <Route path="/project" element={<ProjectManagementSystem />} />
          {/* <Route path="/project/:id" element={<ProjectDetail />} /> */}
          
          {/* 원서 관리 */}
          <Route path="/textbook" element={<TextbookManagementSystem />} />
          {/* <Route path="/textbook/:id" element={<TextbookDetail />} /> */}
          
          {/* 캘린더 */}
          <Route path="/calendar" element={<StudyCalendar />} />
          
          {/* 404 페이지 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}
export default App;

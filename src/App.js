// App.js - 메인 앱 컴포넌트
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// 페이지 컴포넌트들 import (폴더 기반)
import Dashboard from './pages/Dashboard/index';
import ProjectManagementSystem from './pages/ProjectManagement/index';
import StudyCalendar from './pages/StudyCalendar/index';
import StudyManagementSystem from './pages/StudyManagement/index';
import TextbookManagementSystem from './pages/TextbookManagement/index';
import AddTextbook from './pages/TextbookManagement/AddTextbook';
import Layout from './components/Layout';
import NotFound from './components/Notfound';
import OnboardingLanding from './pages/Onboarding';
import TextbookDetailPage from './pages/TextbookDetail/index';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OnboardingLanding />} />
        
        {/* Layout을 element로 사용하고, 중첩 라우트 구조 */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/study" element={<StudyManagementSystem />} />
          <Route path="/project" element={<ProjectManagementSystem />} />
          <Route path="/textbook" element={<TextbookManagementSystem />} />
          <Route path="/textbook/add" element={<AddTextbook />} />
          <Route path="/textbook/:id" element={<TextbookDetailPage />} />
          <Route path="/calendar" element={<StudyCalendar />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}
export default App;
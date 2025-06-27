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
import OnboardingLanding from './pages/Onboarding';
function App() {
  return (
    <Router>
      <Routes>
        {/* 온보딩: Layout 없이 */}
        <Route path="/onboarding" element={<OnboardingLanding />} />

        {/* Layout이 적용되는 페이지들 */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/study" element={<StudyManagementSystem />} />
          <Route path="/project" element={<ProjectManagementSystem />} />
          <Route path="/textbook" element={<TextbookManagementSystem />} />
          <Route path="/calendar" element={<StudyCalendar />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}
export default App;


// hooks/useNavigation.js - 네비게이션 훅
import { useNavigate, useParams, useLocation } from 'react-router-dom';

export const useAppNavigation = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const navigateTo = {
    dashboard: () => navigate('/'),
    studyList: () => navigate('/study'),
    studyDetail: (id) => navigate(`/study/${id}`),
    projectList: () => navigate('/project'),
    projectDetail: (id) => navigate(`/project/${id}`),
    textbookList: () => navigate('/textbook'),
    textbookDetail: (id) => navigate(`/textbook/${id}`),
    calendar: () => navigate('/calendar'),
    calendarWithDate: (date) => navigate(`/calendar?date=${date}`)
  };

  const goBack = () => navigate(-1);
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    if (path.startsWith('/study')) return 'study';
    if (path.startsWith('/project')) return 'project';
    if (path.startsWith('/textbook')) return 'textbook';
    if (path.startsWith('/calendar')) return 'calendar';
    return null;
  };

  return {
    navigateTo,
    goBack,
    getCurrentPage,
    params,
    location
  };
};
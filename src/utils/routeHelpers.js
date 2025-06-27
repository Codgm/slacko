
// utils/routeHelpers.js - 라우팅 유틸리티
export const generateBreadcrumbs = (location) => {
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ title: '대시보드', path: '/' }];

  const routeMap = {
    study: '학습 관리',
    project: '프로젝트 관리',
    textbook: '원서 관리',
    calendar: '캘린더'
  };

  pathSegments.forEach((segment, index) => {
    if (routeMap[segment]) {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      breadcrumbs.push({
        title: routeMap[segment],
        path: path
      });
    } else if (!isNaN(segment)) {
      // ID인 경우 상세 페이지로 처리
      const parentSegment = pathSegments[index - 1];
      if (routeMap[parentSegment]) {
        breadcrumbs.push({
          title: '상세',
          path: location.pathname
        });
      }
    }
  });

  return breadcrumbs;
};

export const getPageTitle = (location) => {
  const path = location.pathname;
  
  if (path === '/') return '대시보드';
  if (path === '/study') return '학습 관리';
  if (path.startsWith('/study/')) return '학습 상세';
  if (path === '/project') return '프로젝트 관리';
  if (path.startsWith('/project/')) return '프로젝트 상세';
  if (path === '/textbook') return '원서 관리';
  if (path.startsWith('/textbook/')) return '원서 상세';
  if (path === '/calendar') return '캘린더';
  
  return '학습 관리 시스템';
};
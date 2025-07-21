import { Link, useLocation, matchPath } from 'react-router-dom';

const pathMap = [
  { path: '/textbook', label: '원서 관리' },
  { path: '/textbook/:id', label: '원서 상세' },
  { path: '/textbook/:id/study', label: '원서 학습' },
];

function extractIdFromPath(pathname) {
  const match = pathname.match(/\/textbook\/(\w+)/);
  return match ? match[1] : null;
}

function getBreadcrumbs(pathname, bookTitle) {
  const crumbs = [];
  for (const map of pathMap) {
    const match = matchPath({ path: map.path, end: false }, pathname);
    if (match) {
      let url = map.path;
      if (map.path.includes(':id') && match.params.id) {
        url = map.path.replace(':id', match.params.id);
      }
      let label = map.label;
      // 원서 상세와 원서 학습에 원서 이름 반영
      if (map.path === '/textbook/:id' && bookTitle) {
        label = `${bookTitle} 상세`;
      }
      if (map.path === '/textbook/:id/study' && bookTitle) {
        label = `${bookTitle} 학습`;
      }
      crumbs.push({ label, to: url });
    }
  }
  return crumbs;
}

const Breadcrumb = () => {
  const location = useLocation();
  // 원서 이름은 location.state?.title → localStorage 순서로 시도
  let bookTitle = location.state?.title;
  if (!bookTitle) {
    const id = extractIdFromPath(location.pathname);
    if (id) {
      bookTitle = localStorage.getItem(`book-title-${id}`) || '';
    }
  }
  const crumbs = getBreadcrumbs(location.pathname, bookTitle);
  if (crumbs.length === 0) return null;
  return (
    <nav className="flex items-center text-sm text-gray-500 space-x-2 mb-4" aria-label="Breadcrumb">
      {crumbs.map((crumb, idx) => (
        <span key={crumb.to} className="flex items-center">
          <Link to={crumb.to} className="hover:underline hover:text-blue-600 transition-colors">
            {crumb.label}
          </Link>
          {idx < crumbs.length - 1 && <span className="mx-2">&gt;</span>}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb; 
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { textbookTitle } = location.state || {};
  const pathnames = location.pathname.split('/').filter((x) => x);

  const handleNavigate = (path) => {
    navigate(path, { state: location.state });
  };

  const generateCrumbs = () => {
    const homeCrumb = (
      <li key="home">
        <button type="button" onClick={() => handleNavigate('/dashboard')} className="text-gray-500 hover:text-indigo-600 flex items-center">
          <Home className="h-4 w-4" />
          <span className="sr-only">Home</span>
        </button>
      </li>
    );

    const crumbs = [homeCrumb];

    if (pathnames[0] === 'textbook') {
      const textbookManagementPath = '/textbook';
      const isCurrentPage = pathnames.length === 1;

      crumbs.push(<li key="separator-textbook" className="flex items-center"><ChevronRight className="h-4 w-4 text-gray-400 mx-2" /></li>);
      crumbs.push(
        <li key="textbook-management">
          {isCurrentPage ? (
            <span className="font-semibold text-gray-600">원서 관리</span>
          ) : (
            <button type="button" onClick={() => handleNavigate(textbookManagementPath)} className="text-gray-500 hover:text-indigo-600">
              원서 관리
            </button>
          )}
        </li>
      );
    }

    if (pathnames.length >= 2 && pathnames[0] === 'textbook' && !isNaN(Number(pathnames[1]))) {
      const textbookId = pathnames[1];
      const textbookDetailPath = `/textbook/${textbookId}`;
      const isCurrentPage = pathnames.length === 2;
      const detailText = textbookTitle ? `${textbookTitle} 상세` : '원서 상세';

      crumbs.push(<li key="separator-detail" className="flex items-center"><ChevronRight className="h-4 w-4 text-gray-400 mx-2" /></li>);
      crumbs.push(
        <li key="textbook-detail">
          {isCurrentPage ? (
            <span className="font-semibold text-gray-600">{detailText}</span>
          ) : (
            <button type="button" onClick={() => handleNavigate(textbookDetailPath)} className="text-gray-500 hover:text-indigo-600">
              {detailText}
            </button>
          )}
        </li>
      );
    }
    
    if (pathnames.length === 3 && pathnames[2] === 'study') {
      crumbs.push(<li key="separator-study" className="flex items-center"><ChevronRight className="h-4 w-4 text-gray-400 mx-2" /></li>);
      crumbs.push(
        <li key="textbook-study" className="font-semibold text-gray-600">
          원서 학습
        </li>
      );
    }

    return crumbs;
  };

  return (
    <nav className="mb-6" aria-label="Breadcrumb">
      <ol className="list-none p-0 flex items-center text-sm">
        {generateCrumbs()}
      </ol>
    </nav>
  );
};

export default Breadcrumb; 
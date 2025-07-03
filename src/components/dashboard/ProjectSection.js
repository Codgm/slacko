import React from 'react';
import { FileText } from 'lucide-react';

export default function ProjectSection({ currentProjects, getProgressColor, getDaysUntilDeadline }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">진행 중인 프로젝트</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentProjects.map((project) => (
            <div key={project.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-gray-900 leading-tight">{project.name}</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                  {project.category}
                </span>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>진행률</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>마감: {new Date(project.dueDate).toLocaleDateString()}</span>
                <span className="text-orange-600 font-medium">
                  D-{getDaysUntilDeadline(project.dueDate)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
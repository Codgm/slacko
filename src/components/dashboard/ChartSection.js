import React from 'react';
import { Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ChartSection({ weeklyStudyData }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">이번 주 학습 시간</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyStudyData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#f3f4f6"
                style={{
                  backgroundColor: '#fafafa',
                  background: 'linear-gradient(to bottom, #fafafa, #f9fafb)',
                  border: 'solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={{ stroke: '#d1d5db' }}
                axisLine={{ stroke: '#d1d5db' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={{ stroke: '#d1d5db' }}
                axisLine={{ stroke: '#d1d5db' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: 'solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="hours" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#8b5cf6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 
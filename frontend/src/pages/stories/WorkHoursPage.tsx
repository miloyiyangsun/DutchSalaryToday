// WorkHoursPage.tsx - 工时分析故事页面 
// Work Hours Analysis Story Page - Story 2

import React from 'react';
import { useWorkHoursData } from '../../hooks';

const WorkHoursPage: React.FC = () => {
  const { data, loading, error, refetch } = useWorkHoursData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading work hours analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-600">
          No work hours data available
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🕒 Work Hours Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the truth about Dutch working hours: from industry extremes to hourly wage gaps
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Data source: {data.dataSource} • Analysis year: {data.analysisYear}
          </p>
        </div>

        {/* Big Numbers Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Average Hours */}
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🕒</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Average Work Hours</h3>
            <div className="text-3xl font-bold text-blue-700 mb-2">
              {data.averageHours.weeklyHours} hours/week
            </div>
            <p className="text-blue-600 font-medium">{data.averageHours.annualHours} hours annually</p>
            <p className="text-sm text-gray-600 mt-2">{data.averageHours.description}</p>
          </div>

          {/* Longest Hours */}
          <div className="bg-orange-50 rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Longest Hours</h3>
            <div className="text-3xl font-bold text-orange-700 mb-2">
              {data.hoursRanking.highest.weeklyHours} hours/week
            </div>
            <p className="text-orange-600 font-medium">{data.hoursRanking.gapRatio}x vs lowest</p>
            <p className="text-sm text-gray-600 mt-2">{data.hoursRanking.highest.industry}</p>
          </div>

          {/* Wage Gap */}
          <div className="bg-purple-50 rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Wage Gap Reality</h3>
            <div className="text-3xl font-bold text-purple-700 mb-2">
              €{data.wageRanking.highest.hourlyWage}/hour
            </div>
            <p className="text-purple-600 font-medium">{data.wageRanking.gapRatio}x vs lowest</p>
            <p className="text-sm text-gray-600 mt-2">{data.wageRanking.highest.industry}</p>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Work Hours Extremes */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              📊 Industry Work Hours Extremes
            </h3>
            
            <div className="space-y-6">
              {/* Longest Hours */}
              <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                <h4 className="text-lg font-bold text-orange-700 mb-2">Longest Hours</h4>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-800">
                    {data.hoursRanking.highest.weeklyHours} hours/week
                  </p>
                  <p className="text-orange-600">{data.hoursRanking.highest.industry}</p>
                  <p className="text-sm text-orange-500">{data.hoursRanking.highest.annualHours} hours annually</p>
                </div>
              </div>
              
              {/* Shortest Hours */}
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <h4 className="text-lg font-bold text-green-700 mb-2">Shortest Hours</h4>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-800">
                    {data.hoursRanking.lowest.weeklyHours} hours/week
                  </p>
                  <p className="text-green-600">{data.hoursRanking.lowest.industry}</p>
                  <p className="text-sm text-green-500">{data.hoursRanking.lowest.annualHours} hours annually</p>
                </div>
              </div>
              
              <div className="text-center bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  Gap: <span className="font-bold text-lg text-orange-600">{data.hoursRanking.gapRatio}x</span> difference
                </p>
              </div>
            </div>
          </div>

          {/* Hourly Wage Extremes */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              💸 Industry Hourly Wage Extremes
            </h3>
            
            <div className="space-y-6">
              {/* Highest Wage */}
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <h4 className="text-lg font-bold text-green-700 mb-2">Highest Wage</h4>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-800">
                    €{data.wageRanking.highest.hourlyWage}/hour
                  </p>
                  <p className="text-green-600">{data.wageRanking.highest.industry}</p>
                </div>
              </div>
              
              {/* Lowest Wage */}
              <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                <h4 className="text-lg font-bold text-red-700 mb-2">Lowest Wage</h4>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-800">
                    €{data.wageRanking.lowest.hourlyWage}/hour
                  </p>
                  <p className="text-red-600">{data.wageRanking.lowest.industry}</p>
                </div>
              </div>
              
              <div className="text-center bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  Gap: <span className="font-bold text-lg text-green-600">{data.wageRanking.gapRatio}x</span> difference
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            Analysis covers {data.totalIndustries} industries • Data from {data.dataSource}
          </p>
        </div>
      </div>
    </div>
  );
};


export default WorkHoursPage;
'use client';

import React from 'react';

interface TestsTabProps {
  tests: any[];
}

const TestsTab: React.FC<TestsTabProps> = ({ tests }) => {
  if (!tests || tests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No tests found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tests.map((test: any, index: number) => (
        <div key={index} className="flex items-center gap-4 p-4 bg-gray-900/40 rounded-xl border border-gray-700">
          <div className="font-medium text-gray-200 flex-1 min-w-0 truncate">
            {test.name}
          </div>
          <div className="flex items-center gap-2 min-w-[100px] justify-end">
            <span className={`text-sm px-3 py-1.5 rounded-full ${
              test.status === 'PASS' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {test.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestsTab;
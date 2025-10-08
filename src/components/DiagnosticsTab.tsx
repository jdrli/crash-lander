'use client';

import React from 'react';
import CircularProgress from './CircularProgress';
import { TestResult } from '@/utils/resultParser';

interface DiagnosticsTabProps {
  diagnostics: TestResult[];
}

const DiagnosticsTab: React.FC<DiagnosticsTabProps> = ({ diagnostics }) => {
  if (!diagnostics || diagnostics.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No diagnostics found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Performance */}
      {diagnostics.some(d => d.name === 'Performance') && (
        <div className="flex flex-col items-center p-3 bg-gray-900/40 rounded-xl border border-gray-700">
          <CircularProgress value={diagnostics.find(d => d.name === 'Performance')?.value as number} />
          <h3 className="mt-2 text-sm font-medium text-white text-center">Performance</h3>
        </div>
      )}
      
      {/* Accessibility */}
      {diagnostics.some(d => d.name === 'Accessibility') && (
        <div className="flex flex-col items-center p-3 bg-gray-900/40 rounded-xl border border-gray-700">
          <CircularProgress value={diagnostics.find(d => d.name === 'Accessibility')?.value as number} />
          <h3 className="mt-2 text-sm font-medium text-white text-center">Accessibility</h3>
        </div>
      )}
      
      {/* Best Practices */}
      {diagnostics.some(d => d.name === 'Best Practices') && (
        <div className="flex flex-col items-center p-3 bg-gray-900/40 rounded-xl border border-gray-700">
          <CircularProgress value={diagnostics.find(d => d.name === 'Best Practices')?.value as number} />
          <h3 className="mt-2 text-sm font-medium text-white text-center">Best Practices</h3>
        </div>
      )}
      
      {/* SEO */}
      {diagnostics.some(d => d.name === 'SEO') && (
        <div className="flex flex-col items-center p-3 bg-gray-900/40 rounded-xl border border-gray-700">
          <CircularProgress value={diagnostics.find(d => d.name === 'SEO')?.value as number} />
          <h3 className="mt-2 text-sm font-medium text-white text-center">SEO</h3>
        </div>
      )}
    </div>
  );
};

export default DiagnosticsTab;
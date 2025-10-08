'use client';

import React from 'react';
import CircularProgress from './CircularProgress';
import { TestResult } from '@/utils/resultParser';

interface OverallTabProps {
  diagnostics: TestResult[];
}

const OverallTab: React.FC<OverallTabProps> = ({ diagnostics }) => {
  if (!diagnostics || diagnostics.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-center py-8 text-gray-400">
          Run a test to see overall score
        </div>
      </div>
    );
  }

  // Calculate average score
  const perf = diagnostics.find(d => d.name === 'Performance')?.value as number;
  const a11y = diagnostics.find(d => d.name === 'Accessibility')?.value as number;
  const bp = diagnostics.find(d => d.name === 'Best Practices')?.value as number;
  const seo = diagnostics.find(d => d.name === 'SEO')?.value as number;
  const scores = [perf, a11y, bp, seo].filter(s => s !== undefined);
  const averageScore = scores.length > 0 ? scores.reduce((sum, val) => sum + val, 0) / scores.length : 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        <CircularProgress 
          value={averageScore} 
          size={192} 
          strokeWidth={8}
          isOverall={true}
        />
      </div>
      <h2 className="text-xl font-semibold text-white mt-2">Overall Score</h2>
    </div>
  );
};

export default OverallTab;
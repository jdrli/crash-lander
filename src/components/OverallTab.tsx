'use client';

import React from 'react';
import CircularProgress from './CircularProgress';

interface OverallTabProps {
  diagnostics: any[];
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

  // Precompute diagnostic values to avoid multiple array scans
  const diagnosticMap = new Map<string, any>();
  diagnostics.forEach(d => {
    if (['Performance', 'Accessibility', 'Best Practices', 'SEO'].includes(d.name)) {
      diagnosticMap.set(d.name, d);
    }
  });

  // Calculate average score
  const perf = diagnosticMap.get('Performance')?.value as number;
  const a11y = diagnosticMap.get('Accessibility')?.value as number;
  const bp = diagnosticMap.get('Best Practices')?.value as number;
  const seo = diagnosticMap.get('SEO')?.value as number;
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
          label="Overall website quality score"
        />
      </div>
      <h2 className="text-xl font-semibold text-white mt-2">Overall Score</h2>
    </div>
  );
};

export default OverallTab;
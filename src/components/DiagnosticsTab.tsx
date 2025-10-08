'use client';

import React from 'react';
import CircularProgress from './CircularProgress';

interface DiagnosticsTabProps {
  diagnostics: any[];
}

const DiagnosticsTab: React.FC<DiagnosticsTabProps> = ({ diagnostics }) => {
  if (!diagnostics || diagnostics.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No diagnostics found
      </div>
    );
  }

  // Precompute the diagnostic values to avoid multiple array scans
  const diagnosticMap = new Map<string, any>();
  diagnostics.forEach(d => {
    if (['Performance', 'Accessibility', 'Best Practices', 'SEO'].includes(d.name)) {
      diagnosticMap.set(d.name, d);
    }
  });

  // Check which diagnostics we have
  const hasPerformance = diagnosticMap.has('Performance');
  const hasAccessibility = diagnosticMap.has('Accessibility');
  const hasBestPractices = diagnosticMap.has('Best Practices');
  const hasSeo = diagnosticMap.has('SEO');

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Performance */}
      {hasPerformance && (
        <div className="flex flex-col items-center p-3 bg-gray-900/40 rounded-xl border border-gray-700">
          <CircularProgress 
            value={diagnosticMap.get('Performance')?.value as number} 
            label="Performance score"
          />
          <h3 className="mt-2 text-sm font-medium text-white text-center">Performance</h3>
        </div>
      )}
      
      {/* Accessibility */}
      {hasAccessibility && (
        <div className="flex flex-col items-center p-3 bg-gray-900/40 rounded-xl border border-gray-700">
          <CircularProgress 
            value={diagnosticMap.get('Accessibility')?.value as number} 
            label="Accessibility score"
          />
          <h3 className="mt-2 text-sm font-medium text-white text-center">Accessibility</h3>
        </div>
      )}
      
      {/* Best Practices */}
      {hasBestPractices && (
        <div className="flex flex-col items-center p-3 bg-gray-900/40 rounded-xl border border-gray-700">
          <CircularProgress 
            value={diagnosticMap.get('Best Practices')?.value as number} 
            label="Best practices score"
          />
          <h3 className="mt-2 text-sm font-medium text-white text-center">Best Practices</h3>
        </div>
      )}
      
      {/* SEO */}
      {hasSeo && (
        <div className="flex flex-col items-center p-3 bg-gray-900/40 rounded-xl border border-gray-700">
          <CircularProgress 
            value={diagnosticMap.get('SEO')?.value as number} 
            label="SEO score"
          />
          <h3 className="mt-2 text-sm font-medium text-white text-center">SEO</h3>
        </div>
      )}
    </div>
  );
};

export default DiagnosticsTab;
'use client';

import { useState, useEffect } from 'react';
import { parseResults, type ParsedResults, type TestResult } from '@/utils/resultParser';

export default function Home() {
  const [url, setUrl] = useState('');
  const [rawResults, setRawResults] = useState<any>(null);
  const [parsedResults, setParsedResults] = useState<ParsedResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stars, setStars] = useState<Array<{x: number, y: number, size: number, opacity: number}>>([]);
  const [particles, setParticles] = useState<Array<{x: number, y: number, size: number, animationDuration: number, animationDelay: number}>>([]);
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'tests' | null>(null);
  const [diagnosticCategory, setDiagnosticCategory] = useState<'categories' | 'diagnostics' | 'metrics' | 'all'>('all');

  // Create random stars for the background on client side only to prevent hydration errors
  useEffect(() => {
    const generatedStars = [];
    for (let i = 0; i < 150; i++) {
      generatedStars.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.2
      });
    }
    setStars(generatedStars);
    
    // Create floating particles
    const generatedParticles = [];
    for (let i = 0; i < 20; i++) {
      generatedParticles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 10 + 2,
        animationDuration: Math.random() * 10 + 10,
        animationDelay: Math.random() * 5
      });
    }
    setParticles(generatedParticles);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${API_BASE_URL}/run-tests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setRawResults(data);
      
      // Parse the results using our utility function
      const parsed = parseResults(data.results);
      setParsedResults(parsed);
    } catch (err) {
      setError('Failed to fetch data from the API. Make sure the server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter diagnostics based on selected category
  const filteredDiagnostics = parsedResults?.diagnostics?.filter(diag => 
    diagnosticCategory === 'all' || diag.category === diagnosticCategory
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden relative">
      {/* Starry background */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      {/* Floating space particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-500/20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float ${particle.animationDuration}s infinite ease-in-out`,
              animationDelay: `${particle.animationDelay}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full text-center">
          {/* Spaceship logo */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                {/* Main body */}
                <ellipse cx="50" cy="50" rx="20" ry="30" fill="#4f46e5" />
                
                {/* Cockpit */}
                <circle cx="50" cy="40" r="8" fill="#818cf8" />
                
                {/* Wings */}
                <path d="M30 50 Q20 60 30 70 L40 65 L40 55 L30 50 Z" fill="#6366f1" />
                <path d="M70 50 Q80 60 70 70 L60 65 L60 55 L70 50 Z" fill="#6366f1" />
                
                {/* Engine */}
                <rect x="45" y="75" width="10" height="15" fill="#ec4899" />
                <path d="M45 90 L40 100 L55 100 L50 90 Z" fill="#f43f5e" />
                
                {/* Details */}
                <circle cx="50" cy="40" r="4" fill="#ffffff" />
                
                {/* Glow effect */}
                <circle cx="50" cy="50" r="35" fill="none" stroke="#818cf8" strokeWidth="2" strokeOpacity="0.3" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Crash Lander
          </h1>
          <p className="text-lg text-gray-300 mb-10">
            Comprehensive QA Testing Dashboard
          </p>

          {/* Form section */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow relative">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter website URL to scan..."
                  className="w-full px-6 py-4 bg-gray-900/80 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-purple-500/20"
              >
                {loading ? 'Launching...' : 'LAUNCH'}
              </button>
            </form>
            
            {error && (
              <div className="mt-4 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-xl">
                {error}
              </div>
            )}
          </div>

          {/* Results section */}
          {rawResults && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-2xl w-full">
              <h2 className="text-xl font-bold text-white mb-6">Scan Results for: {rawResults?.url}</h2>
              
              {/* Tabs for Diagnostics and Tests */}
              <div className="flex border-b border-gray-600 mb-6">
                <button
                  className={`py-2 px-4 font-medium text-sm ${
                    activeTab === 'diagnostics' || activeTab === null
                      ? 'text-purple-400 border-b-2 border-purple-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('diagnostics')}
                >
                  Diagnostics
                </button>
                <button
                  className={`py-2 px-4 font-medium text-sm ${
                    activeTab === 'tests'
                      ? 'text-purple-400 border-b-2 border-purple-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('tests')}
                >
                  Tests
                </button>
              </div>

              {/* Diagnostics section with subcategories */}
              {(activeTab === 'diagnostics' || activeTab === null) && (
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button
                      className={`px-3 py-1 text-sm rounded-lg ${
                        diagnosticCategory === 'all'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      onClick={() => setDiagnosticCategory('all')}
                    >
                      All
                    </button>
                    <button
                      className={`px-3 py-1 text-sm rounded-lg ${
                        diagnosticCategory === 'categories'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      onClick={() => setDiagnosticCategory('categories')}
                    >
                      Categories
                    </button>
                    <button
                      className={`px-3 py-1 text-sm rounded-lg ${
                        diagnosticCategory === 'diagnostics'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      onClick={() => setDiagnosticCategory('diagnostics')}
                    >
                      Diagnostics
                    </button>
                    <button
                      className={`px-3 py-1 text-sm rounded-lg ${
                        diagnosticCategory === 'metrics'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      onClick={() => setDiagnosticCategory('metrics')}
                    >
                      Metrics
                    </button>
                  </div>

                  <div className="space-y-4">
                    {parsedResults && filteredDiagnostics.length > 0 ? (
                      filteredDiagnostics.map((diag: TestResult, index: number) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gray-900/40 rounded-xl border border-gray-700">
                          <div className="font-medium text-gray-200 flex-1 min-w-0 truncate">
                            {diag.name}
                          </div>
                          <div className="flex items-center gap-2 min-w-[100px] justify-end">
                            <span className={`text-sm font-semibold ${
                              diag.status === 'PASS' ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {typeof diag.value === 'number' ? 
                                diag.value.toFixed(2) : 
                                (diag.value !== undefined && diag.value !== null && String(diag.value) !== 'N/A' ? 
                                  String(diag.value) : 
                                  '')}
                            </span>
                            <span className={`text-sm px-3 py-1.5 rounded-full ${
                              diag.status === 'PASS' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {diag.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        No diagnostics found in this category
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tests section */}
              {activeTab === 'tests' && parsedResults && (
                <div className="space-y-4">
                  {parsedResults.tests && parsedResults.tests.length > 0 ? (
                    parsedResults.tests.map((test: TestResult, index: number) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-900/40 rounded-xl border border-gray-700">
                        <div className="font-medium text-gray-200 flex-1 min-w-0 truncate">
                          {test.name}
                        </div>
                        <div className="flex items-center gap-2 min-w-[100px] justify-end">
                          <span className={`text-sm font-semibold ${
                            test.status === 'PASS' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {test.value !== undefined && test.value !== null && String(test.value) !== 'N/A' ? 
                              String(test.value) : 
                              ''}
                          </span>
                          <span className={`text-sm px-3 py-1.5 rounded-full ${
                            test.status === 'PASS' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {test.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      No tests found
                    </div>
                  )}
                </div>
              )}

              {/* Show both when no tab is selected */}
              {activeTab === null && (
                <>
                  {/* Diagnostics */}
                  {parsedResults && parsedResults.diagnostics && parsedResults.diagnostics.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <span className="mr-2">🔍</span> Diagnostics
                      </h3>
                      <div className="space-y-3">
                        {parsedResults.diagnostics.slice(0, 5).map((diag: TestResult, index: number) => (
                          <div key={index} className="flex items-center gap-4 p-3 bg-gray-900/40 rounded-lg border border-gray-600">
                            <div className="font-medium text-gray-200 flex-1 min-w-0 truncate">
                              {diag.name}
                            </div>
                            <div className="flex items-center gap-2 min-w-[100px] justify-end">
                              <span className={`text-sm font-semibold ${
                                diag.status === 'PASS' ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {typeof diag.value === 'number' ? 
                                  diag.value.toFixed(2) : 
                                  (diag.value !== undefined && diag.value !== null && String(diag.value) !== 'N/A' ? 
                                    String(diag.value) : 
                                    '')}
                              </span>
                              <span className={`text-sm px-3 py-1.5 rounded-full ${
                                diag.status === 'PASS' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                              }`}>
                                {diag.status}
                              </span>
                            </div>
                          </div>
                        ))}
                        {parsedResults.diagnostics.length > 5 && (
                          <button 
                            className="mt-3 text-sm text-purple-400 hover:text-purple-300"
                            onClick={() => setActiveTab('diagnostics')}
                          >
                            View all diagnostics ({parsedResults.diagnostics.length})
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tests */}
                  {parsedResults && parsedResults.tests && parsedResults.tests.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <span className="mr-2">🧪</span> Tests
                      </h3>
                      <div className="space-y-3">
                        {parsedResults.tests.slice(0, 5).map((test: TestResult, index: number) => (
                          <div key={index} className="flex items-center gap-4 p-3 bg-gray-900/40 rounded-lg border border-gray-600">
                            <div className="font-medium text-gray-200 flex-1 min-w-0 truncate">
                              {test.name}
                            </div>
                            <div className="flex items-center gap-2 min-w-[100px] justify-end">
                              <span className={`text-sm font-semibold ${
                                test.status === 'PASS' ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {test.value !== undefined && test.value !== null && String(test.value) !== 'N/A' ? 
                                  String(test.value) : 
                                  ''}
                              </span>
                              <span className={`text-sm px-3 py-1.5 rounded-full ${
                                test.status === 'PASS' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                              }`}>
                                {test.status}
                              </span>
                            </div>
                          </div>
                        ))}
                        {parsedResults.tests.length > 5 && (
                          <button 
                            className="mt-3 text-sm text-purple-400 hover:text-purple-300"
                            onClick={() => setActiveTab('tests')}
                          >
                            View all tests ({parsedResults.tests.length})
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Custom animation styles */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(5px, 10px) rotate(5deg); }
          50% { transform: translate(0, 5px) rotate(0deg); }
          75% { transform: translate(-5px, 10px) rotate(-5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
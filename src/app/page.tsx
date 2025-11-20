'use client';

import { useState, useEffect } from 'react';
import { parseResults, type ParsedResults } from '@/utils/resultParser';
import OverallTab from '@/components/OverallTab';
import DiagnosticsTab from '@/components/DiagnosticsTab';
import TestsTab from '@/components/TestsTab';
import LinkForm from '@/components/LinkForm';

export default function Home() {
  const [url, setUrl] = useState('');
  const [rawResults, setRawResults] = useState<any>(null);
  const [parsedResults, setParsedResults] = useState<ParsedResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stars, setStars] = useState<Array<{x: number, y: number, size: number, opacity: number}>>([]);
  const [particles, setParticles] = useState<Array<{x: number, y: number, size: number, animationDuration: number, animationDelay: number}>>([]);
  const [activeTab, setActiveTab] = useState<'overall' | 'diagnostics' | 'tests'>('overall');
  const [animationKey, setAnimationKey] = useState(0);

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
          <LinkForm 
            url={url} 
            setUrl={setUrl} 
            loading={loading} 
            error={error} 
            handleSubmit={handleSubmit} 
          />

          {/* Results section */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-2xl w-full transition-all duration-300 ease-in-out">
            <h2 className="text-xl font-bold text-white mb-6">Scan Results for: {rawResults?.url || 'Enter a link to test'}</h2>
            
            {/* Tabs for Diagnostics and Tests with animated underline */}
            <div className="relative flex border-b border-gray-600 mb-6">
              {/* Animated sliding underline */}
              <div 
                className="absolute bottom-0 h-0.5 bg-purple-400 transition-all duration-300 ease-in-out"
                style={{
                  width: activeTab === 'overall' ? '60px' : 
                        activeTab === 'diagnostics' ? '85px' : 
                        '40px',
                  left: activeTab === 'overall' ? 'calc(16.666% - 30px)' : 
                       activeTab === 'diagnostics' ? 'calc(50% - 42px)' : 
                       'calc(83.333% - 20px)',
                }}
              />
              <button
                className={`flex-1 py-2 px-4 font-medium text-sm transition-colors duration-300 relative ${
                  activeTab === 'overall'
                    ? 'text-purple-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                onClick={(e) => { e.preventDefault(); setActiveTab('overall'); setAnimationKey(prev => prev + 1); }}
              >
                Overall
              </button>
              <button
                className={`flex-1 py-2 px-4 font-medium text-sm transition-colors duration-300 relative ${
                  activeTab === 'diagnostics'
                    ? 'text-purple-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                onClick={(e) => { e.preventDefault(); setActiveTab('diagnostics'); setAnimationKey(prev => prev + 1); }}
              >
                Diagnostics
              </button>
              <button
                className={`flex-1 py-2 px-4 font-medium text-sm transition-colors duration-300 relative ${
                  activeTab === 'tests'
                    ? 'text-purple-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                onClick={(e) => { e.preventDefault(); setActiveTab('tests'); setAnimationKey(prev => prev + 1); }}
              >
                Tests
              </button>
            </div>

            {/* Content container to prevent layout shifts */}
            <div className="relative min-h-[300px]">
              {/* Overall section showing average of all diagnostics */}
              <div 
                className={`absolute inset-0 transition-opacity duration-300 ${
                  activeTab === 'overall' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {parsedResults ? (
                  <OverallTab diagnostics={parsedResults.diagnostics} key={`overall-${animationKey}`} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p>Enter a website URL to see overall statistics</p>
                  </div>
                )}
              </div>

              {/* Diagnostics section with circular progress bars in a row */}
              <div 
                className={`absolute inset-0 transition-opacity duration-300 ${
                  activeTab === 'diagnostics' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {parsedResults ? (
                  <DiagnosticsTab diagnostics={parsedResults.diagnostics} key={`diagnostics-${animationKey}`} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p>Enter a website URL to see detailed diagnostics</p>
                  </div>
                )}
              </div>

              {/* Tests section */}
              <div 
                className={`absolute inset-0 transition-opacity duration-300 ${
                  activeTab === 'tests' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {parsedResults ? (
                  <TestsTab tests={parsedResults.tests} key={`tests-${animationKey}`} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p>Enter a website URL to see test results</p>
                  </div>
                )}
              </div>
            </div> {/* Closing relative container */}
          </div>
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
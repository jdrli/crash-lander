'use client';

import React from "react";

interface LinkFormProps {
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  error: string;
  handleSubmit: (e: React.FormEvent) => void;
}

const LinkForm: React.FC<LinkFormProps> = ({ url, setUrl, loading, error, handleSubmit }) => {
  return (
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
          {loading ? "Launching..." : "LAUNCH"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-xl">
          {error}
        </div>
      )}
    </div>
  );
}

export default LinkForm;

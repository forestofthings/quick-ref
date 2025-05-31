import React from 'react';
import { SearchProvider } from './context/SearchContext';
import SearchInterface from './components/SearchInterface';

function App() {
  return (
    <SearchProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <SearchInterface />
      </div>
    </SearchProvider>
  );
}

export default App;
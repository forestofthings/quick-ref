import React, { useEffect } from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import FileSelector from './FileSelector';
import { useSearch } from '../context/SearchContext';
import { FileIcon, SearchIcon } from 'lucide-react';

const SearchInterface: React.FC = () => {
  const { results, query, performSearch } = useSearch();

  // Add keyboard shortcut for search (Ctrl+Enter or Cmd+Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        performSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [performSearch]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SearchIcon className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold tracking-tight">quickRef</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Search local markdown files with context highlighting
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 h-full">
            <div className="flex items-center gap-2 mb-4 text-lg font-medium">
              <FileIcon className="h-5 w-5 text-indigo-500" />
              <h2>Files to Search</h2>
            </div>
            <FileSelector />
          </div>
        </div>

        <div className="lg:col-span-8 xl:col-span-9 flex flex-col">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
            <SearchBar />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex-1 overflow-hidden">
            {query ? (
              <SearchResults />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <SearchIcon className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg">Enter a search term to begin</p>
                <p className="text-sm mt-2">
                  Select files and type your query in the search box above
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchInterface;
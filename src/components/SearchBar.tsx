import React, { useState, useRef } from 'react';
import { useSearch } from '../context/SearchContext';
import { Search, X, Clock, Settings } from 'lucide-react';

const SearchBar: React.FC = () => {
  const {
    query,
    setQuery,
    performSearch,
    searchHistory,
    isSearching,
    caseSensitive,
    setCaseSensitive,
    wholeWord,
    setWholeWord,
    contextWords,
    setContextWords,
    clearResults
  } = useSearch();
  
  const [showHistory, setShowHistory] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
    setShowHistory(false);
  };

  const handleHistoryClick = (term: string) => {
    setQuery(term);
    setShowHistory(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    clearResults();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleContextWordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 10 && value <= 200) {
      setContextWords(value);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative flex items-center">
          <div 
            className="absolute left-3 text-gray-500"
            onClick={() => inputRef.current?.focus()}
          >
            <Search className="h-5 w-5" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for keywords in markdown files..."
            className="w-full pl-10 pr-24 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 shadow-sm focus:outline-none focus:ring-2 
                     focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent
                     transition duration-200"
            onFocus={() => setShowHistory(searchHistory.length > 0)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
          />
          
          <div className="absolute right-3 flex items-center gap-2">
            {query && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            
            <button 
              type="button"
              onClick={() => {
                setShowOptions(!showOptions);
                setShowHistory(false);
              }}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
              aria-label="Search options"
            >
              <Settings className="h-5 w-5" />
            </button>
            
            <button
              type="button"
              onClick={() => {
                setShowHistory(!showHistory && searchHistory.length > 0);
                setShowOptions(false);
              }}
              className={`text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none 
                        ${searchHistory.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={searchHistory.length === 0}
              aria-label="Search history"
            >
              <Clock className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {showOptions && (
          <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-3 shadow-lg animate-fade-in">
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Case sensitive</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wholeWord}
                  onChange={(e) => setWholeWord(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Match whole word</span>
              </label>

              <div className="space-y-1">
                <label className="block text-sm">
                  Words of context before and after match (10-200):
                </label>
                <input
                  type="number"
                  min="10"
                  max="200"
                  value={contextWords}
                  onChange={handleContextWordsChange}
                  className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 
                           focus:border-transparent transition"
                />
              </div>
            </div>
          </div>
        )}
        
        {showHistory && searchHistory.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-gray-700 
                        rounded-lg border border-gray-200 dark:border-gray-600 shadow-lg
                        max-h-60 overflow-y-auto animate-fade-in">
            <ul className="py-1">
              {searchHistory.map((term, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => handleHistoryClick(term)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 
                             flex items-center gap-3 transition duration-150"
                  >
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="truncate">{term}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className={`w-full py-2.5 rounded-lg bg-indigo-600 text-white flex items-center 
                    justify-center gap-2 transition duration-200
                    ${
                      isSearching || !query.trim()
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:bg-indigo-700 active:bg-indigo-800'
                    }`}
        >
          {isSearching ? (
            <>
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              <span>Search</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
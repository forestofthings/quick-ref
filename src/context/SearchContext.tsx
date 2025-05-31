import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { searchFiles, SearchResult } from '../utils/search';

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  searchHistory: string[];
  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;
  isSearching: boolean;
  performSearch: () => Promise<void>;
  caseSensitive: boolean;
  setCaseSensitive: (value: boolean) => void;
  wholeWord: boolean;
  setWholeWord: (value: boolean) => void;
  clearResults: () => void;
  contextWords: number;
  setContextWords: (value: number) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [contextWords, setContextWords] = useState(20); // Changed default to 20

  // Debounced search effect
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim() && selectedFiles.length > 0) {
        setIsSearching(true);
        try {
          const searchResults = await searchFiles(selectedFiles, query, {
            caseSensitive,
            wholeWord,
            contextWords
          });
          setResults(searchResults);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(searchTimeout);
  }, [query, selectedFiles, caseSensitive, wholeWord, contextWords]);

  const performSearch = async () => {
    if (!query.trim() || selectedFiles.length === 0) return;
    
    // Add to search history if not already present
    if (!searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev].slice(0, 10));
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <SearchContext.Provider 
      value={{
        query,
        setQuery,
        results,
        searchHistory,
        selectedFiles,
        setSelectedFiles,
        isSearching,
        performSearch,
        caseSensitive,
        setCaseSensitive,
        wholeWord,
        setWholeWord,
        clearResults,
        contextWords,
        setContextWords
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
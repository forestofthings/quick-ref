import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { searchFiles, SearchResult } from '../utils/search';

interface FavoriteFolder {
  path: string;
  name: string;
  lastUsed: number;
}

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
  favoriteFolders: FavoriteFolder[];
  addFavoriteFolder: (path: string, name: string) => void;
  removeFavoriteFolder: (path: string) => void;
  updateFavoriteLastUsed: (path: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Load favorites from localStorage
const loadFavorites = (): FavoriteFolder[] => {
  const saved = localStorage.getItem('quickRefFavorites');
  return saved ? JSON.parse(saved) : [];
};

// Save favorites to localStorage
const saveFavorites = (favorites: FavoriteFolder[]) => {
  localStorage.setItem('quickRefFavorites', JSON.stringify(favorites));
};

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [contextWords, setContextWords] = useState(20);
  const [favoriteFolders, setFavoriteFolders] = useState<FavoriteFolder[]>(loadFavorites);

  // Save favorites whenever they change
  useEffect(() => {
    saveFavorites(favoriteFolders);
  }, [favoriteFolders]);

  const addFavoriteFolder = (path: string, name: string) => {
    setFavoriteFolders(prev => {
      if (prev.some(f => f.path === path)) return prev;
      return [...prev, { path, name, lastUsed: Date.now() }];
    });
  };

  const removeFavoriteFolder = (path: string) => {
    setFavoriteFolders(prev => prev.filter(f => f.path !== path));
  };

  const updateFavoriteLastUsed = (path: string) => {
    setFavoriteFolders(prev => 
      prev.map(f => f.path === path ? { ...f, lastUsed: Date.now() } : f)
    );
  };

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
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, selectedFiles, caseSensitive, wholeWord, contextWords]);

  const performSearch = async () => {
    if (!query.trim() || selectedFiles.length === 0) return;
    
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
        setContextWords,
        favoriteFolders,
        addFavoriteFolder,
        removeFavoriteFolder,
        updateFavoriteLastUsed
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
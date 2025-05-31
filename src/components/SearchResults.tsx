import React, { useState } from 'react';
import { useSearch } from '../context/SearchContext';
import { FileText, ChevronDown, ChevronUp, FileBadge, SearchIcon } from 'lucide-react';
import { HighlightedText } from './HighlightedText';

const SearchResults: React.FC = () => {
  const { results, query, isSearching } = useSearch();
  const [expandedFiles, setExpandedFiles] = useState<Record<string, boolean>>({});

  const toggleFileExpansion = (filePath: string) => {
    setExpandedFiles(prev => ({
      ...prev,
      [filePath]: !prev[filePath]
    }));
  };

  // Show initial state when no query
  if (!query.trim()) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <SearchIcon className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg">Start typing to search</p>
        <p className="text-sm mt-2">
          Results will appear as you type
        </p>
      </div>
    );
  }

  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Searching files...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <FileBadge className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium mb-2">No results found</h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          No matches found for "{query}" in the selected files. Try adjusting your search term or selecting different files.
        </p>
      </div>
    );
  }

  // Group results by file
  const resultsByFile = results.reduce((acc, result) => {
    if (!acc[result.file]) {
      acc[result.file] = [];
    }
    acc[result.file].push(result);
    return acc;
  }, {} as Record<string, typeof results>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          Found {results.length} match{results.length !== 1 ? 'es' : ''} for "{query}"
        </h3>
      </div>

      <div className="space-y-4">
        {Object.entries(resultsByFile).map(([file, fileResults]) => {
          const isExpanded = expandedFiles[file] !== false; // Default to expanded
          
          return (
            <div 
              key={file}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm transition-all duration-200"
            >
              <button
                onClick={() => toggleFileExpansion(file)}
                className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition text-left"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="h-5 w-5 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-medium truncate">{file}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    ({fileResults.length} match{fileResults.length !== 1 ? 'es' : ''})
                  </span>
                </div>
                
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {isExpanded && (
                <div className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                  {fileResults.map((result, idx) => (
                    <div 
                      key={idx}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition"
                    >
                      <HighlightedText 
                        text={result.context} 
                        searchTerm={query} 
                      />
                      
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Line {result.line}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
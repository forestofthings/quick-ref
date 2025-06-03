import React, { useState } from 'react';
import { useSearch } from '../context/SearchContext';
import { FileText, ChevronDown, ChevronUp, FileBadge, SearchIcon, Download } from 'lucide-react';
import { HighlightedText } from './HighlightedText';
import { generateMarkdown, downloadMarkdown } from '../utils/export';

const SearchResults: React.FC = () => {
  const { results, query, isSearching } = useSearch();
  const [expandedFiles, setExpandedFiles] = useState<Record<string, boolean>>({});
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isDocListExpanded, setIsDocListExpanded] = useState(true);

  const toggleFileExpansion = (filePath: string) => {
    setExpandedFiles(prev => ({
      ...prev,
      [filePath]: !prev[filePath]
    }));
  };

  const openFileAtLine = async (filePath: string, line: number) => {
    try {
      await window.xdg_open(`${filePath}:${line}`);
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  const handleExport = () => {
    if (!query || !results.length) return;
    
    const markdown = generateMarkdown(query, results);
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `search-results-${query.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.md`;
    
    downloadMarkdown(markdown, filename);
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

  // Group and sort results by file
  const resultsByFile = results.reduce((acc, result) => {
    if (!acc[result.file]) {
      acc[result.file] = [];
    }
    acc[result.file].push(result);
    return acc;
  }, {} as Record<string, typeof results>);

  // Sort files by number of matches (descending)
  const sortedFiles = Object.entries(resultsByFile)
    .sort(([, aResults], [, bResults]) => bResults.length - aResults.length);

  const uniqueDocuments = Object.keys(resultsByFile).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            Found {results.length} match{results.length !== 1 ? 'es' : ''} for "{query}" in {uniqueDocuments} document{uniqueDocuments !== 1 ? 's' : ''}
          </h3>
          
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg
                     bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            <Download className="h-4 w-4" />
            <span>Export Results</span>
          </button>
        </div>

        {/* Collapsible Document Navigation */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsDocListExpanded(!isDocListExpanded)}
            className="w-full flex items-center justify-between p-4 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <span>Documents with matches</span>
            {isDocListExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          
          {isDocListExpanded && (
            <div className="p-4 pt-0">
              <div className="flex flex-col gap-2">
                {sortedFiles.map(([file, fileResults]) => (
                  <button
                    key={file}
                    onClick={() => {
                      setSelectedFile(file);
                      setExpandedFiles(prev => ({ ...prev, [file]: true }));
                      const element = document.getElementById(`file-${file}`);
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left
                              ${selectedFile === file
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                        : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                  >
                    <FileText className="h-4 w-4 flex-shrink-0" />
                    <span className="break-all">{file}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-auto flex-shrink-0">
                      ({fileResults.length})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {sortedFiles.map(([file, fileResults]) => {
          const isExpanded = expandedFiles[file] !== false;
          
          return (
            <div 
              key={file}
              id={`file-${file}`}
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
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition cursor-pointer"
                      onClick={() => openFileAtLine(file, result.line)}
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
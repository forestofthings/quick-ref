import React, { useState } from 'react';
import { useSearch } from '../context/SearchContext';
import { FileText, FolderOpen, X, Plus, Check, Star, StarOff, Clock } from 'lucide-react';
import { selectFiles, clearSelectedFiles, getDirectoryPath } from '../utils/files';

const FileSelector: React.FC = () => {
  const {
    selectedFiles,
    setSelectedFiles,
    favoriteFolders,
    addFavoriteFolder,
    removeFavoriteFolder,
    updateFavoriteLastUsed
  } = useSearch();
  const [isLoading, setIsLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(true);

  const handleSelectFiles = async () => {
    setIsLoading(true);
    try {
      const { files, directoryPath, directoryName } = await selectFiles();
      setSelectedFiles(files);
      
      // If a directory was selected, offer to add it to favorites
      if (directoryPath && directoryName) {
        const isAlreadyFavorite = favoriteFolders.some(f => f.path === directoryPath);
        if (!isAlreadyFavorite) {
          addFavoriteFolder(directoryPath, directoryName);
        } else {
          updateFavoriteLastUsed(directoryPath);
        }
      }
    } catch (error) {
      console.error('Error selecting files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteClick = async (path: string) => {
    setIsLoading(true);
    try {
      const { files } = await selectFiles(path);
      setSelectedFiles(files);
      updateFavoriteLastUsed(path);
    } catch (error) {
      console.error('Error loading favorite folder:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFile = (file: string) => {
    setSelectedFiles(selectedFiles.filter(f => f !== file));
    if (selectedFiles.length === 1) {
      clearSelectedFiles();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const sortedFavorites = [...favoriteFolders].sort((a, b) => b.lastUsed - a.lastUsed);

  return (
    <div className="space-y-4">
      {showFavorites && favoriteFolders.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Favorite Folders</h3>
            <button
              onClick={() => setShowFavorites(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-1">
            {sortedFavorites.map(folder => (
              <button
                key={folder.path}
                onClick={() => handleFavoriteClick(folder.path)}
                className="w-full flex items-center justify-between p-2 text-sm rounded-lg
                         bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600
                         transition duration-150 group"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FolderOpen className="h-4 w-4 text-indigo-500" />
                  <span className="truncate">{folder.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavoriteFolder(folder.path);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                >
                  <StarOff className="h-4 w-4" />
                </button>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedFiles.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <FileText className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">No files selected</p>
          <button
            onClick={handleSelectFiles}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 
                     text-white rounded-lg flex items-center gap-2 mx-auto transition"
          >
            <Plus className="h-4 w-4" />
            <span>Select Files</span>
          </button>
          {!showFavorites && favoriteFolders.length > 0 && (
            <button
              onClick={() => setShowFavorites(true)}
              className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400
                       dark:hover:text-indigo-300 flex items-center gap-1 mx-auto transition"
            >
              <Star className="h-3 w-3" />
              <span>Show Favorites</span>
            </button>
          )}
        </div>
      ) : (
        <>
          <ul className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {selectedFiles.map(file => (
              <li 
                key={file}
                className="flex items-center justify-between gap-2 p-2 rounded-lg
                         bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600
                         group hover:border-indigo-300 dark:hover:border-indigo-500 transition"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="h-4 w-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
                  <span className="truncate text-sm">{file}</span>
                </div>
                <button
                  onClick={() => handleRemoveFile(file)}
                  className="text-gray-500 hover:text-red-500 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${file}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={handleSelectFiles}
              className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 
                       flex items-center gap-1 transition"
            >
              <Plus className="h-3 w-3" />
              <span>Add More</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FileSelector;
import { readFile } from './files';

export interface SearchOptions {
  caseSensitive?: boolean;
  wholeWord?: boolean;
  contextWords?: number;
}

export interface SearchResult {
  file: string;
  line: number;
  context: string;
  match: string;
}

const extractContext = (content: string, matchIndex: number, matchLength: number, contextWords: number = 50): string => {
  // Split the content into words
  const words = content.split(/\s+/);
  
  // Find the word index that contains our match
  let currentLength = 0;
  let matchWordIndex = 0;
  
  for (let i = 0; i < words.length; i++) {
    if (currentLength <= matchIndex && currentLength + words[i].length + 1 > matchIndex) {
      matchWordIndex = i;
      break;
    }
    currentLength += words[i].length + 1; // +1 for the space
  }
  
  // Calculate start and end word indices - now using contextWords before AND after
  const startWordIndex = Math.max(0, matchWordIndex - contextWords);
  const endWordIndex = Math.min(words.length, matchWordIndex + contextWords + 1);
  
  // Join the context words
  let context = words.slice(startWordIndex, endWordIndex).join(' ');
  
  // Add ellipsis if necessary
  if (startWordIndex > 0) {
    context = '...' + context;
  }
  if (endWordIndex < words.length) {
    context = context + '...';
  }
  
  return context;
};

const getLineNumber = (content: string, matchIndex: number): number => {
  const lines = content.substring(0, matchIndex).split('\n');
  return lines.length;
};

const searchFile = async (
  filePath: string, 
  query: string, 
  options: SearchOptions = {}
): Promise<SearchResult[]> => {
  const { caseSensitive = false, wholeWord = false, contextWords = 50 } = options;
  
  try {
    const content = await readFile(filePath);
    const results: SearchResult[] = [];
    
    let pattern = caseSensitive ? query : query.toLowerCase();
    pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    if (wholeWord) {
      pattern = `\\b${pattern}\\b`;
    }
    
    const regex = new RegExp(pattern, caseSensitive ? 'g' : 'gi');
    const searchContent = caseSensitive ? content : content.toLowerCase();
    const originalContent = content;
    
    let match;
    while ((match = regex.exec(searchContent)) !== null) {
      const matchIndex = match.index;
      const matchLength = match[0].length;
      
      results.push({
        file: filePath,
        line: getLineNumber(originalContent, matchIndex),
        context: extractContext(originalContent, matchIndex, matchLength, contextWords),
        match: match[0]
      });
    }
    
    return results;
  } catch (error) {
    console.error(`Error searching file ${filePath}:`, error);
    return [];
  }
};

export const searchFiles = async (
  filePaths: string[], 
  query: string,
  options: SearchOptions = {}
): Promise<SearchResult[]> => {
  if (!query.trim() || filePaths.length === 0) {
    return [];
  }
  
  try {
    const searchPromises = filePaths.map(filePath => searchFile(filePath, query, options));
    const resultsArrays = await Promise.all(searchPromises);
    return resultsArrays.flat();
  } catch (error) {
    console.error('Error searching files:', error);
    return [];
  }
};
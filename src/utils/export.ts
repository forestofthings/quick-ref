import { SearchResult } from './search';

export const generateMarkdown = (query: string, results: SearchResult[]): string => {
  const timestamp = new Date().toLocaleString();
  let markdown = `# Search Results for "${query}"\n\n`;
  markdown += `*Generated on ${timestamp}*\n\n`;
  
  // Group results by file
  const resultsByFile = results.reduce((acc, result) => {
    if (!acc[result.file]) {
      acc[result.file] = [];
    }
    acc[result.file].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  // Generate markdown for each file
  Object.entries(resultsByFile).forEach(([file, fileResults]) => {
    markdown += `## ${file}\n\n`;
    
    fileResults.forEach(result => {
      markdown += `### Line ${result.line}\n\n`;
      markdown += `\`\`\`\n${result.context}\n\`\`\`\n\n`;
    });
  });

  return markdown;
};

export const downloadMarkdown = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
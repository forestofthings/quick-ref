# quickRef

A powerful local markdown file search tool built with React and TypeScript. Search through your markdown documentation with real-time results, context highlighting, and advanced search features.

## Features

- Real-time search with context highlighting
- File and folder selection with favorites support
- Collapsible document navigation
- Document sorting by match count
- Advanced search options:
  - Case-sensitive search
  - Whole word matching
  - Adjustable context size (10-200 words)
  - Interview transcript mode with speaker detection
- Dark mode support
- Keyboard shortcuts:
  - Ctrl/Cmd + Enter to search
  - Esc to clear search
- File management:
  - Select individual files or entire folders
  - Pin frequently accessed folders as favorites
  - Quick navigation between documents with matches

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Usage

1. Select markdown files or folders to search
2. Pin frequently accessed folders as favorites
3. Type your search query
4. Results appear in real-time with:
   - Highlighted matches
   - Context around matches
   - Line numbers
   - Document grouping
   - Match count per document

### Search Options

- **Case Sensitivity**: Toggle to match exact case
- **Whole Word**: Match complete words only
- **Context Size**: Adjust the number of words shown around matches
- **Interview Mode**: Special formatting for interview transcripts with speaker detection

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide Icons

## License

MIT License
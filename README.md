# quickRef

A powerful local markdown file search tool built with React and TypeScript. Quickly search through your markdown documentation with context-aware results and real-time previews.

![quickRef Screenshot](https://images.pexels.com/photos/4101/search-find-magnifier-research.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

## Features

- Real-time search with context highlighting
- Support for both individual files and folder selection
- Advanced search options:
  - Case-sensitive matching
  - Whole word matching
  - Adjustable context words (before and after matches)
- Automatic dark mode support
- Fast and responsive interface
- Markdown file support
- Search history tracking
- Keyboard shortcuts (Ctrl/Cmd + Enter to search)

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/quickref.git
   cd quickref
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the provided local URL

## Usage

1. Click "Select Files" to choose markdown files or folders
2. Type your search query in the search box
3. Results will appear in real-time with highlighted matches
4. Use the options panel to:
   - Toggle case sensitivity
   - Enable whole word matching
   - Adjust context words
5. Click on file headers to expand/collapse results
6. Use Ctrl/Cmd + Enter to trigger a search manually

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technology Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React Icons

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Icons from [Lucide](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
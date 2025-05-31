let selectedFiles: File[] = [];
let selectedFileHandles: FileSystemFileHandle[] = [];

const createFileInput = (): Promise<File[]> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.md';
    input.webkitdirectory = true; // Allow directory selection

    input.onchange = () => {
      const files = Array.from(input.files || [])
        .filter(file => file.name.endsWith('.md')); // Only include markdown files
      resolve(files);
    };

    input.click();
  });
};

const getAllFilesInDirectory = async (dirHandle: FileSystemDirectoryHandle): Promise<FileSystemFileHandle[]> => {
  const files: FileSystemFileHandle[] = [];
  
  async function* getFilesRecursively(dirHandle: FileSystemDirectoryHandle): AsyncGenerator<FileSystemFileHandle> {
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file' && entry.name.endsWith('.md')) {
        yield entry;
      } else if (entry.kind === 'directory') {
        yield* getFilesRecursively(entry);
      }
    }
  }

  for await (const fileHandle of getFilesRecursively(dirHandle)) {
    files.push(fileHandle);
  }

  return files;
};

export const listFiles = async (): Promise<string[]> => {
  if (selectedFileHandles.length > 0) {
    return selectedFileHandles.map(handle => handle.name);
  }
  return selectedFiles.map(file => file.name);
};

export const readFile = async (filePath: string): Promise<string> => {
  // Try File System Access API first
  const fileHandle = selectedFileHandles.find(handle => handle.name === filePath);
  if (fileHandle) {
    const file = await fileHandle.getFile();
    return file.text();
  }

  // Fallback to regular File API
  const file = selectedFiles.find(f => f.name === filePath);
  if (!file) {
    throw new Error(`File not found: ${filePath}`);
  }
  return file.text();
};

export const selectFiles = async (): Promise<string[]> => {
  try {
    // Check if File System Access API is available
    if ('showOpenFilePicker' in window) {
      const handles = await window.showOpenFilePicker({
        multiple: true,
        types: [{
          description: 'Markdown files',
          accept: {
            'text/markdown': ['.md']
          }
        }],
        // Allow directory selection
        startIn: 'documents'
      });

      const allFiles: FileSystemFileHandle[] = [];
      
      for (const handle of handles) {
        if (handle.kind === 'directory') {
          const filesInDir = await getAllFilesInDirectory(handle);
          allFiles.push(...filesInDir);
        } else if (handle.name.endsWith('.md')) {
          allFiles.push(handle);
        }
      }
      
      selectedFileHandles = allFiles;
      selectedFiles = []; // Clear regular files when using handles
      return allFiles.map(handle => handle.name);
    }

    // Fallback to regular file input
    const files = await createFileInput();
    selectedFiles = files;
    selectedFileHandles = []; // Clear handles when using regular files
    return files.map(file => file.name);
  } catch (error) {
    console.error('Error selecting files:', error);
    return [];
  }
};

export const clearSelectedFiles = () => {
  selectedFiles = [];
  selectedFileHandles = [];
};
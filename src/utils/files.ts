import { FileSystemDirectoryHandle } from 'fs';

let selectedFiles: File[] = [];
let selectedFileHandles: FileSystemFileHandle[] = [];
let currentDirectoryHandle: FileSystemDirectoryHandle | null = null;

const createFileInput = (): Promise<{ files: File[], directoryPath?: string, directoryName?: string }> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.md';
    input.webkitdirectory = true;

    input.onchange = () => {
      const files = Array.from(input.files || [])
        .filter(file => file.name.endsWith('.md'));
      
      // Try to get directory name from the first file's path
      let directoryPath, directoryName;
      if (files.length > 0 && files[0].webkitRelativePath) {
        const parts = files[0].webkitRelativePath.split('/');
        if (parts.length > 1) {
          directoryName = parts[0];
          directoryPath = files[0].webkitRelativePath.split('/')[0];
        }
      }
      
      resolve({ files, directoryPath, directoryName });
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
  const fileHandle = selectedFileHandles.find(handle => handle.name === filePath);
  if (fileHandle) {
    const file = await fileHandle.getFile();
    return file.text();
  }

  const file = selectedFiles.find(f => f.name === filePath);
  if (!file) {
    throw new Error(`File not found: ${filePath}`);
  }
  return file.text();
};

export const selectFiles = async (savedPath?: string): Promise<{
  files: string[];
  directoryPath?: string;
  directoryName?: string;
}> => {
  try {
    if ('showDirectoryPicker' in window) {
      let dirHandle: FileSystemDirectoryHandle;
      
      if (savedPath && currentDirectoryHandle) {
        dirHandle = currentDirectoryHandle;
      } else {
        dirHandle = await window.showDirectoryPicker({
          startIn: 'documents',
        });
        currentDirectoryHandle = dirHandle;
      }

      const files = await getAllFilesInDirectory(dirHandle);
      selectedFileHandles = files;
      selectedFiles = [];

      return {
        files: files.map(handle => handle.name),
        directoryPath: dirHandle.name,
        directoryName: dirHandle.name
      };
    }

    const { files, directoryPath, directoryName } = await createFileInput();
    selectedFiles = files;
    selectedFileHandles = [];
    return {
      files: files.map(file => file.name),
      directoryPath,
      directoryName
    };
  } catch (error) {
    console.error('Error selecting files:', error);
    return { files: [] };
  }
};

export const clearSelectedFiles = () => {
  selectedFiles = [];
  selectedFileHandles = [];
  currentDirectoryHandle = null;
};
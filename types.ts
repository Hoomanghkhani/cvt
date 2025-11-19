import { ReactNode } from 'react';

export type LineType = 'input' | 'output' | 'boot' | 'error';

export interface HistoryLine {
  id: string;
  type: LineType;
  content: ReactNode;
  path?: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    bg: string;
    text: string;
    primary: string;    // user/prompt
    secondary: string;  // cmd/highlight
    error: string;
    info: string;
    glow: string;
  };
}

export interface FileSystemNode {
  type: 'file' | 'directory';
  content?: ReactNode; // For files
  children?: { [key: string]: FileSystemNode }; // For directories
}

import React from 'react';
import { FileSystemNode, Theme } from './types';

// --- THEMES ---
export const THEMES: { [key: string]: Theme } = {
  default: {
    id: 'default',
    name: 'Tokyo Night',
    colors: {
      bg: '#1a1b26',
      text: '#a9b1d6',
      primary: '#7aa2f7',   // User Blue
      secondary: '#9ece6a', // Cmd Green
      error: '#f7768e',
      info: '#e0af68',
      glow: 'rgba(122, 162, 247, 0.15)'
    }
  },
  retro: {
    id: 'retro',
    name: 'Matrix Green',
    colors: {
      bg: '#0d1117',
      text: '#00ff41',
      primary: '#00ff41',
      secondary: '#008F11',
      error: '#00ff41',
      info: '#00ff41',
      glow: 'rgba(0, 255, 65, 0.4)'
    }
  },
  amber: {
    id: 'amber',
    name: 'Retro Amber',
    colors: {
      bg: '#1a1200',
      text: '#ffb000',
      primary: '#ffb000',
      secondary: '#cc8800',
      error: '#ffb000',
      info: '#ffb000',
      glow: 'rgba(255, 176, 0, 0.4)'
    }
  }
};

// --- FILE SYSTEM ---
export const FILE_SYSTEM: FileSystemNode = {
  type: 'directory',
  children: {
    'about.txt': {
      type: 'file',
      content: (
        <div>
          Hi! I'm <span className="font-bold">Hooman</span>.<br/>
          A 29-year-old IT Support Specialist transitioning into <span className="font-bold">DevOps</span>.<br/>
          I love automating things, fixing broken servers, and coffee.
        </div>
      )
    },
    'skills.md': {
      type: 'file',
      content: (
        <div>
          <div className="mb-2 font-bold underline">Technical Stack:</div>
          <div>├── 🐧 Linux: LPIC-1 (CentOS/Ubuntu)</div>
          <div>├── 🐳 Containerization: Docker & Docker Compose</div>
          <div>├── 🕸️ Network: Network+, TCP/IP, DNS Troubleshooting</div>
          <div>├── 🔄 CI/CD: GitHub Actions (Basic)</div>
          <div>└── 🔧 Hardware: Server Maintenance & Assembly</div>
        </div>
      )
    },
    'contact.txt': {
      type: 'file',
      content: (
        <div>
          Email: hooman@example.com<br/>
          GitHub: github.com/hooman-dev<br/>
          LinkedIn: linkedin.com/in/hooman
        </div>
      )
    },
    'projects': {
      type: 'directory',
      children: {
        'monitor.sh': {
          type: 'file',
          content: (
            <div className="whitespace-pre text-xs md:text-sm opacity-80">
              {`#!/bin/bash
# Simple Server Health Check
echo "Checking server health..."
uptime
free -h
df -h
echo "All systems operational."`}
            </div>
          )
        },
        'portfolio.md': {
          type: 'file',
          content: "This website you are looking at! Built with React + TypeScript."
        }
      }
    }
  }
};

export const BOOT_SEQUENCE = [
  "BIOS Date 01/15/2025 14:22:51 Ver: 1.0.0",
  "CPU: Intel(R) Core(TM) i9-14900K @ 6.00GHz",
  "Memory Test: 65536K OK",
  "Detecting Primary Master ... Hooman-SSD 2TB",
  "Detecting Primary Slave ... None",
  "Booting from Hard Disk...",
  "Loading Kernel modules...",
  "Mounting root filesystem...",
  "Starting sshd...",
  "Welcome to HoomanOS v1.0"
];

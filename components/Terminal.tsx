import React, { useState, useEffect, useRef, FormEvent, KeyboardEvent } from 'react';
import { HistoryLine, Theme, FileSystemNode } from '../types';
import { BOOT_SEQUENCE, THEMES, FILE_SYSTEM } from '../constants';

const Terminal: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(THEMES.default);
  const [history, setHistory] = useState<HistoryLine[]>([]);
  const [input, setInput] = useState('');
  const [isBooting, setIsBooting] = useState(true);
  
  // Shell State
  const [currentPath, setCurrentPath] = useState<string[]>([]); // [] = root, ['projects'] = ~/projects
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Helper Functions ---
  const getCurrentDir = (): FileSystemNode => {
    let current = FILE_SYSTEM;
    for (const p of currentPath) {
      if (current.children && current.children[p]) {
        current = current.children[p];
      }
    }
    return current;
  };

  const getPathString = () => {
    return currentPath.length === 0 ? '~' : `~/${currentPath.join('/')}`;
  };

  const resolvePath = (pathArg: string): { node: FileSystemNode | null, newPath: string[] } => {
    if (pathArg === '/' || pathArg === '~') return { node: FILE_SYSTEM, newPath: [] };
    if (pathArg === '..') {
        const newPath = [...currentPath];
        newPath.pop();
        // Re-traverse to get node
        let current = FILE_SYSTEM;
        for (const p of newPath) {
            if (current.children) current = current.children[p];
        }
        return { node: current, newPath };
    }
    
    // Simple relative path support for single level down
    const current = getCurrentDir();
    if (current.children && current.children[pathArg]) {
        return { node: current.children[pathArg], newPath: [...currentPath, pathArg] };
    }
    return { node: null, newPath: currentPath };
  };

  // --- Effects ---

  // Boot Sequence
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex >= BOOT_SEQUENCE.length) {
        clearInterval(interval);
        setIsBooting(false);
        setHistory(prev => [
          ...prev, 
          { 
            id: 'welcome', 
            type: 'output', 
            content: (
              <div className="mb-4">
                Type <span style={{color: theme.colors.secondary}} className="font-bold">help</span> to view available commands.
              </div>
            ) 
          }
        ]);
        return;
      }
      setHistory(prev => [...prev, {
          id: `boot-${currentIndex}`,
          type: 'boot',
          content: <span style={{color: theme.colors.text}}>{BOOT_SEQUENCE[currentIndex]}</span>
      }]);
      currentIndex++;
    }, 150); // Faster boot
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [history, isBooting]);

  // Focus Input
  const handleTerminalClick = () => {
    if (!isBooting && inputRef.current) {
      inputRef.current.focus();
    }
  };

  // --- Command Handlers ---
  
  const handleCommand = (cmdRaw: string) => {
    const trimmed = cmdRaw.trim();
    if (!trimmed) return;

    // Add to visual history
    const newHistoryLine: HistoryLine = {
      id: `cmd-${Date.now()}`,
      type: 'input',
      content: trimmed,
      path: getPathString()
    };
    setHistory(prev => [...prev, newHistoryLine]);
    
    // Add to command buffer for Up/Down arrows
    setCmdHistory(prev => [trimmed, ...prev]);
    setHistoryIndex(-1);

    const [cmd, ...args] = trimmed.split(' ');
    const arg1 = args[0];

    // Execute
    switch (cmd.toLowerCase()) {
      case 'help':
        setHistory(prev => [...prev, {
          id: `res-${Date.now()}`,
          type: 'output',
          content: (
            <div>
              <div className="mb-2">Available Commands:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div><span style={{color: theme.colors.secondary}}>ls</span> - List directory content</div>
                <div><span style={{color: theme.colors.secondary}}>cd [dir]</span> - Change directory</div>
                <div><span style={{color: theme.colors.secondary}}>cat [file]</span> - Read file content</div>
                <div><span style={{color: theme.colors.secondary}}>clear</span> - Clear terminal</div>
                <div><span style={{color: theme.colors.secondary}}>theme [name]</span> - Change theme (default, retro, amber)</div>
                <div><span style={{color: theme.colors.secondary}}>neofetch</span> - System Info</div>
                <div><span style={{color: theme.colors.secondary}}>whoami</span> - About current user</div>
              </div>
            </div>
          )
        }]);
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'whoami':
         setHistory(prev => [...prev, {
            id: `res-${Date.now()}`,
            type: 'output',
            content: "hooman (IT Support -> DevOps Engineer)"
         }]);
         break;

      case 'neofetch':
        setHistory(prev => [...prev, {
          id: `res-${Date.now()}`,
          type: 'output',
          content: (
            <div className="flex flex-col sm:flex-row gap-6 mt-2">
                <div style={{color: theme.colors.primary}} className="font-bold hidden sm:block whitespace-pre leading-none select-none">
{`   /\\
  /  \\
 /    \\
/______\\
  ||||`}
                </div>
                <div className="flex flex-col justify-center">
                    <div><span style={{color: theme.colors.primary}}>hooman</span>@<span style={{color: theme.colors.primary}}>devops</span></div>
                    <div className="border-b w-full my-1" style={{borderColor: theme.colors.text, opacity: 0.3}}></div>
                    <div><span style={{color: theme.colors.info}}>OS:</span> WebOS Arch</div>
                    <div><span style={{color: theme.colors.info}}>Host:</span> Browser</div>
                    <div><span style={{color: theme.colors.info}}>Uptime:</span> 29 Years</div>
                    <div><span style={{color: theme.colors.info}}>Theme:</span> {theme.name}</div>
                </div>
            </div>
          )
        }]);
        break;

      case 'ls':
        const currentDir = getCurrentDir();
        if (currentDir.children) {
            const files = Object.entries(currentDir.children).map(([name, node]) => {
                const isDir = node.type === 'directory';
                return (
                    <span key={name} className={`mr-4 ${isDir ? 'font-bold' : ''}`} style={{color: isDir ? theme.colors.primary : theme.colors.text}}>
                        {name}{isDir ? '/' : ''}
                    </span>
                );
            });
            setHistory(prev => [...prev, { id: `res-${Date.now()}`, type: 'output', content: <div className="flex flex-wrap">{files}</div> }]);
        }
        break;

      case 'cd':
        if (!arg1) {
            setCurrentPath([]); // Go home
        } else {
            const { node, newPath } = resolvePath(arg1);
            if (node && node.type === 'directory') {
                setCurrentPath(newPath);
            } else {
                setHistory(prev => [...prev, { id: `err-${Date.now()}`, type: 'error', content: <span style={{color: theme.colors.error}}>bash: cd: {arg1}: No such directory</span> }]);
            }
        }
        break;

      case 'cat':
        if (!arg1) {
            setHistory(prev => [...prev, { id: `err-${Date.now()}`, type: 'error', content: <span style={{color: theme.colors.error}}>usage: cat [file]</span> }]);
        } else {
            const { node } = resolvePath(arg1);
            if (node && node.type === 'file') {
                setHistory(prev => [...prev, { id: `res-${Date.now()}`, type: 'output', content: node.content }]);
            } else if (node && node.type === 'directory') {
                setHistory(prev => [...prev, { id: `err-${Date.now()}`, type: 'error', content: <span style={{color: theme.colors.error}}>cat: {arg1}: Is a directory</span> }]);
            } else {
                setHistory(prev => [...prev, { id: `err-${Date.now()}`, type: 'error', content: <span style={{color: theme.colors.error}}>cat: {arg1}: No such file</span> }]);
            }
        }
        break;

      case 'theme':
        if (arg1 && THEMES[arg1.toLowerCase()]) {
            setTheme(THEMES[arg1.toLowerCase()]);
            setHistory(prev => [...prev, { id: `res-${Date.now()}`, type: 'output', content: `Theme changed to ${THEMES[arg1.toLowerCase()].name}` }]);
        } else {
            setHistory(prev => [...prev, { id: `res-${Date.now()}`, type: 'output', content: `Available themes: ${Object.keys(THEMES).join(', ')}` }]);
        }
        break;

      default:
        setHistory(prev => [...prev, {
          id: `err-${Date.now()}`,
          type: 'error',
          content: <span style={{color: theme.colors.error}}>bash: {cmd}: command not found</span>
        }]);
    }
  };

  // --- Keyboard Input ---

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleCommand(input);
        setInput('');
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (cmdHistory.length > 0) {
            const newIndex = Math.min(historyIndex + 1, cmdHistory.length - 1);
            setHistoryIndex(newIndex);
            setInput(cmdHistory[newIndex]);
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setInput(cmdHistory[newIndex]);
        } else {
            setHistoryIndex(-1);
            setInput('');
        }
    } else if (e.key === 'Tab') {
        e.preventDefault();
        const trimmed = input.trim();
        const parts = trimmed.split(' ');
        
        // Simple Auto-complete
        if (parts.length === 1) {
            // Complete command
            const availableCmds = ['help', 'ls', 'cd', 'cat', 'clear', 'whoami', 'neofetch', 'theme'];
            const match = availableCmds.find(c => c.startsWith(parts[0]));
            if (match) setInput(match + ' ');
        } else if (parts.length === 2) {
             // Complete file/dir
             const current = getCurrentDir();
             if (current.children) {
                 const match = Object.keys(current.children).find(f => f.startsWith(parts[1]));
                 if (match) setInput(`${parts[0]} ${match}`);
             }
        }
    }
  };

  return (
    <div 
      className="h-full w-full p-4 md:p-6 overflow-y-auto font-mono text-sm md:text-base transition-colors duration-300"
      style={{ backgroundColor: theme.colors.bg, color: theme.colors.text }}
      onClick={handleTerminalClick}
    >
      {/* History Render */}
      {history.map((line) => (
        <div key={line.id} className="mb-1 break-words">
          {line.type === 'input' ? (
            <div className="flex flex-row items-start">
               <span style={{color: theme.colors.primary}} className="font-bold mr-2 shrink-0">
                 hooman@devops:{line.path}$
               </span>
               <span style={{textShadow: `0 0 5px ${theme.colors.glow}`}}>{line.content}</span>
            </div>
          ) : (
            <div style={{textShadow: `0 0 2px ${theme.colors.glow}`}}>{line.content}</div>
          )}
        </div>
      ))}

      {/* Active Input Line */}
      {!isBooting && (
        <div className="flex flex-row items-center mt-1">
          <span style={{color: theme.colors.primary}} className="font-bold mr-2 whitespace-nowrap shrink-0">
            hooman@devops:{getPathString()}$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent outline-none border-none font-mono flex-grow"
            style={{
                color: theme.colors.text, 
                caretColor: theme.colors.primary,
                textShadow: `0 0 5px ${theme.colors.glow}`
            }}
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      )}
      
      <div ref={bottomRef} className="h-4" />
    </div>
  );
};

export default Terminal;

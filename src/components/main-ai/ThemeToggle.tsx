import * as React from 'react';
import { cn } from '../ui/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps = {}) {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    // 初始化时检查 localStorage 和 DOM
    const savedTheme = localStorage.getItem('theme');
    const htmlElement = document.documentElement;
    
    if (savedTheme === 'dark' || (!savedTheme && htmlElement.classList.contains('dark'))) {
      setIsDark(true);
      htmlElement.classList.add('dark');
    } else {
      setIsDark(false);
      htmlElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const htmlElement = document.documentElement;
    const newIsDark = !isDark;
    
    setIsDark(newIsDark);
    
    if (newIsDark) {
      htmlElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'flex items-center justify-center w-[var(--space-800)] h-[var(--space-800)] rounded-[var(--radius-200)]',
        'hover:bg-[var(--black-alpha-11)] transition-colors',
        'text-text-secondary hover:text-text',
        className
      )}
      aria-label={isDark ? '切换到浅色模式' : '切换到暗黑模式'}
      title={isDark ? '浅色模式' : '暗黑模式'}
    >
      {isDark ? (
        // 太阳图标 - 浅色模式
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M9 1.5V3M9 15V16.5M16.5 9H15M3 9H1.5M14.3 14.3L13.2 13.2M4.8 4.8L3.7 3.7M14.3 3.7L13.2 4.8M4.8 13.2L3.7 14.3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        // 月亮图标 - 暗黑模式
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M16.5 10.5C15.9 13.5 13.2 15.75 10.05 15.75C6.45 15.75 3.5 12.8 3.5 9.2C3.5 6.05 5.75 3.35 8.75 2.75C8.35 3.4 8.1 4.15 8.1 4.95C8.1 7.45 10.15 9.5 12.65 9.5C13.45 9.5 14.2 9.25 14.85 8.85C15.15 9.35 15.35 9.9 15.5 10.5H16.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
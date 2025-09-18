import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export const DarkModeToggle = () => {
  // Force dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  // Don't render anything - dark mode is always on
  return null;
};
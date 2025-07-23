/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggleIcon, ThemeToggleButton } from '../theme-toggle';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

// Mock the theme context
const MockThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider defaultTheme="light">
    {children}
  </ThemeProvider>
);

describe('ThemeToggle Components', () => {
  it('renders ThemeToggleIcon without crashing', () => {
    render(
      <MockThemeProvider>
        <ThemeToggleIcon />
      </MockThemeProvider>
    );
    
    // Should render without throwing
    expect(true).toBe(true);
  });

  it('renders ThemeToggleButton without crashing', () => {
    render(
      <MockThemeProvider>
        <ThemeToggleButton />
      </MockThemeProvider>
    );
    
    // Should render without throwing
    expect(true).toBe(true);
  });

  it('applies correct size classes', () => {
    const { container } = render(
      <MockThemeProvider>
        <ThemeToggleIcon size="lg" />
      </MockThemeProvider>
    );
    
    // Should apply large size classes
    expect(container.querySelector('.w-12')).toBeInTheDocument();
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SearchBox } from './SearchBox';

// Wrapper component to provide Router context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('SearchBox', () => {
  it('renders search form elements', () => {
    render(
      <TestWrapper>
        <SearchBox />
      </TestWrapper>
    );

    expect(screen.getByText('LOCATION')).toBeInTheDocument();
    expect(screen.getByText('MOVE IN')).toBeInTheDocument();
    expect(screen.getByText('MOVE OUT')).toBeInTheDocument();
    expect(screen.getByText('GUESTS')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('has campus autocomplete input', () => {
    render(
      <TestWrapper>
        <SearchBox />
      </TestWrapper>
    );

    const campusInput = screen.getByPlaceholderText('Search by College or University');
    expect(campusInput).toBeInTheDocument();
  });
});
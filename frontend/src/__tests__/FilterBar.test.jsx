import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FilterBar from '../components/FilterBar';

describe('FilterBar Component Unit Tests', () => {
  it('should trigger onSearchChange when user types in search input', () => {
    const handleSearchChange = vi.fn();
    render(
      <FilterBar
        searchQuery=""
        onSearchChange={handleSearchChange}
        selectedCategory="All"
        onCategorySelect={() => {}}
        onPriceChange={() => {}}
        onSortChange={() => {}}
        onResetFilters={() => {}}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search make or model/i);
    fireEvent.change(searchInput, { target: { value: 'Porsche' } });

    expect(handleSearchChange).toHaveBeenCalledWith('Porsche');
  });

  it('should trigger onCategorySelect when clicking category pills', () => {
    const handleCategorySelect = vi.fn();
    render(
      <FilterBar
        searchQuery=""
        onSearchChange={() => {}}
        selectedCategory="All"
        onCategorySelect={handleCategorySelect}
        onPriceChange={() => {}}
        onSortChange={() => {}}
        onResetFilters={() => {}}
      />
    );

    const suvPill = screen.getByRole('button', { name: /suv/i });
    fireEvent.click(suvPill);

    expect(handleCategorySelect).toHaveBeenCalledWith('SUV');
  });
});

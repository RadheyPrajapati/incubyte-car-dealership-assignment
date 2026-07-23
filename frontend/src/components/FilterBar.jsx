import React from 'react';
import { Search, Filter, RotateCcw, ArrowUpDown, DollarSign } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Sedan',
  'SUV',
  'Truck',
  'Coupe',
  'Convertible',
  'Wagon',
  'Van',
  'Electric',
  'Hybrid'
];

export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  minPrice,
  maxPrice,
  onPriceChange,
  sortBy,
  onSortChange,
  onResetFilters
}) {
  return (
    <div className="glass-panel rounded-2xl p-5 mb-8 space-y-5 border border-gray-800 shadow-xl">
      
      {/* Top Controls: Search Bar & Sort Dropdown */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Make & Model Search Input */}
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            id="filter-search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search make or model (e.g. Porsche, Mustang, Tesla)..."
            className="w-full pl-10 pr-4 py-2.5 bg-dark-800/80 border border-gray-700/80 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-3 text-xs text-gray-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Price Range & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Price Range Controls */}
          <div className="flex items-center space-x-2 bg-dark-800/80 px-3 py-1.5 rounded-xl border border-gray-700/80">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <input
              type="number"
              id="min-price-input"
              value={minPrice}
              onChange={(e) => onPriceChange('min', e.target.value)}
              placeholder="Min $"
              className="w-20 bg-transparent text-xs text-white focus:outline-none placeholder-gray-500"
            />
            <span className="text-gray-600 text-xs">-</span>
            <input
              type="number"
              id="max-price-input"
              value={maxPrice}
              onChange={(e) => onPriceChange('max', e.target.value)}
              placeholder="Max $"
              className="w-20 bg-transparent text-xs text-white focus:outline-none placeholder-gray-500"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 bg-dark-800/80 px-3 py-1.5 rounded-xl border border-gray-700/80">
            <ArrowUpDown className="w-4 h-4 text-amber-400" />
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-dark-800 text-white">Newest First</option>
              <option value="price-asc" className="bg-dark-800 text-white">Price: Low to High</option>
              <option value="price-desc" className="bg-dark-800 text-white">Price: High to Low</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button
            id="reset-filters-btn"
            onClick={onResetFilters}
            className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 text-gray-400 hover:text-white bg-dark-800/80 hover:bg-dark-700 rounded-xl border border-gray-700/80 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

        </div>

      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mr-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          Category:
        </span>
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              id={`category-pill-${cat.toLowerCase()}`}
              onClick={() => onCategorySelect(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                isActive
                  ? 'bg-amber-500 text-dark-900 shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-dark-800/90 text-gray-300 hover:bg-dark-700 hover:text-white border border-gray-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

    </div>
  );
}

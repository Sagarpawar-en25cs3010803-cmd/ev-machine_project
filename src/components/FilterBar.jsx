import React from 'react';
import { Filter, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';

export default function FilterBar({ 
  filters, 
  setFilters, 
  resetFilters, 
  categories, 
  batteryTechs, 
  regions, 
  years, 
  activeFilterCount,
  filterTimeMs,
  selectivity
}) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <span>Interactive Data Filters</span>
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500 text-slate-950 rounded-full">
                  {activeFilterCount} Active
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Slice across vehicle segments, battery chemistries, and global regions
            </p>
          </div>
        </div>

        {/* Filter Benchmark Stats */}
        <div className="flex items-center space-x-3 text-xs text-slate-400">
          <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60 font-mono text-[11px]">
            <span>Latency:</span>
            <span className="text-emerald-400 font-bold">{filterTimeMs} ms</span>
          </span>
          <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60 font-mono text-[11px]">
            <span>Selectivity:</span>
            <span className="text-cyan-400 font-bold">{selectivity}%</span>
          </span>
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="flex items-center space-x-1 px-3 py-1 text-xs font-medium text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-700/40 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 pt-3">
        
        {/* Search */}
        <div className="relative">
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Search Model / Brand</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="e.g. Model Y, BYD, LFP..."
              value={filters.search || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Vehicle Category */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Vehicle Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Categories ({categories.length})</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Battery Tech */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Battery Technology</label>
          <select
            value={filters.batteryTech}
            onChange={(e) => setFilters(prev => ({ ...prev, batteryTech: e.target.value }))}
            className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Chemistries ({batteryTechs.length})</option>
            {batteryTechs.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Manufacturing Region */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Manufacturing Region</label>
          <select
            value={filters.region}
            onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
            className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Regions</option>
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Release Year */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Model Year</label>
          <select
            value={filters.year}
            onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
            className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Years (2020-2026)</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Minimum Range Slider */}
        <div>
          <div className="flex justify-between text-[11px] font-medium text-slate-400 mb-1">
            <span>Min Range:</span>
            <span className="text-emerald-400 font-bold">{filters.minRange || 0} km</span>
          </div>
          <input
            type="range"
            min="0"
            max="700"
            step="50"
            value={filters.minRange || 0}
            onChange={(e) => setFilters(prev => ({ ...prev, minRange: Number(e.target.value) }))}
            className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

      </div>
    </div>
  );
}


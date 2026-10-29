import React, { useState, useMemo } from 'react';
import rawData from './data/ev_data.json';
import { filterDataset, computeMetrics } from './utils/calculations';
import Navbar from './components/Navbar';
import KPICards from './components/KPICards';
import FilterBar from './components/FilterBar';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import StoryMode from './components/StoryMode';
import PersonaScenarios from './components/PersonaScenarios';
import SQLPlayground from './components/SQLPlayground';
import PerformanceTesting from './components/PerformanceTesting';
import DataTable from './components/DataTable';
import ProjectDocumentation from './components/ProjectDocumentation';
import { Zap, Heart, Sparkles } from 'lucide-react';

const INITIAL_FILTERS = {
  category: 'All',
  batteryTech: 'All',
  region: 'All',
  year: 'All',
  manufacturer: 'All',
  minRange: 0,
  maxPrice: null,
  search: ''
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // Extract unique options for filter dropdowns
  const categories = useMemo(() => Array.from(new Set(rawData.map(d => d.category))).sort(), []);
  const batteryTechs = useMemo(() => Array.from(new Set(rawData.map(d => d.battery_tech))).sort(), []);
  const regions = useMemo(() => Array.from(new Set(rawData.map(d => d.manufacturing_region))).sort(), []);
  const years = useMemo(() => Array.from(new Set(rawData.map(d => d.release_year))).sort((a, b) => a - b), []);

  // Filter calculation with latency measurement
  const { data: filteredData, metrics, filterTimeMs, selectivity } = useMemo(() => {
    return filterDataset(rawData, filters);
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'All') count++;
    if (filters.batteryTech !== 'All') count++;
    if (filters.region !== 'All') count++;
    if (filters.year !== 'All') count++;
    if (filters.minRange > 0) count++;
    if (filters.search && filters.search.trim().length > 0) count++;
    return count;
  }, [filters]);

  const resetFilters = () => setFilters(INITIAL_FILTERS);

  const handleExportCSV = () => {
    if (!filteredData || filteredData.length === 0) return;
    const headers = Object.keys(filteredData[0]);
    const csvRows = [headers.join(',')];
    filteredData.forEach(row => {
      const values = headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`);
      csvRows.push(values.join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ev_market_insights_export_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Sticky Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportCSV={handleExportCSV}
        recordCount={filteredData.length}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Universal Executive KPI Cards (Shown on Dashboard, Scenarios, and Performance) */}
        {(activeTab === 'dashboard' || activeTab === 'scenarios' || activeTab === 'performance') && (
          <KPICards metrics={metrics} />
        )}

        {/* Global Filter Bar (Shown on Dashboard and Dataset tabs) */}
        {(activeTab === 'dashboard' || activeTab === 'data') && (
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            resetFilters={resetFilters}
            categories={categories}
            batteryTechs={batteryTechs}
            regions={regions}
            years={years}
            activeFilterCount={activeFilterCount}
            filterTimeMs={filterTimeMs}
            selectivity={selectivity}
          />
        )}

        {/* Active Tab View Panels */}
        {activeTab === 'dashboard' && (
          <ExecutiveDashboard data={filteredData} metrics={metrics} />
        )}

        {activeTab === 'story' && (
          <StoryMode data={rawData} />
        )}

        {activeTab === 'scenarios' && (
          <PersonaScenarios data={filteredData} />
        )}

        {activeTab === 'sql' && (
          <SQLPlayground data={rawData} />
        )}

        {activeTab === 'performance' && (
          <PerformanceTesting 
            data={rawData} 
            filterTimeMs={filterTimeMs} 
            selectivity={selectivity} 
          />
        )}

        {activeTab === 'data' && (
          <DataTable 
            data={filteredData} 
            onExportCSV={handleExportCSV} 
          />
        )}

        {activeTab === 'docs' && (
          <ProjectDocumentation />
        )}

      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-400">
              Electric Vehicle Market Performance & Insights System
            </span>
            <span>• Full BI & Story Suite</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-400">Deployed with Vercel</span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">GitHub Open Source</span>
            <span className="text-slate-700">|</span>
            <span className="text-emerald-400 font-mono">Status: Production Ready</span>
          </div>
        </div>
      </footer>

    </div>
  );
}


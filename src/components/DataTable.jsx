import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  FileSpreadsheet,
  FileJson,
  Layers
} from 'lucide-react';

export default function DataTable({ data, onExportCSV }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('annual_sales_units');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const q = searchTerm.toLowerCase();
    return data.filter(d => 
      d.model_name.toLowerCase().includes(q) ||
      d.manufacturer.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.battery_tech.toLowerCase().includes(q) ||
      d.manufacturing_country.toLowerCase().includes(q)
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(sortedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ev_market_data_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
      
      {/* Header with Search and Export Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span>Electric Vehicle Market Repository</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-mono border border-slate-700">
              {filteredData.length} Models
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Interactive tabular dataset with multi-column sorting and exports
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search dataset..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-44 sm:w-56"
            />
          </div>

          {/* Export CSV */}
          <button
            onClick={onExportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-lg transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-lg transition-all"
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Table Data Container */}
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/50">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-slate-900/80">
              <th onClick={() => handleSort('model_name')} className="py-2.5 px-3 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1">
                  <span>Model Name</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th onClick={() => handleSort('manufacturer')} className="py-2.5 px-3 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1">
                  <span>Manufacturer</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th onClick={() => handleSort('category')} className="py-2.5 px-3 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1">
                  <span>Category</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th onClick={() => handleSort('release_year')} className="py-2.5 px-3 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1">
                  <span>Year</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th onClick={() => handleSort('battery_tech')} className="py-2.5 px-3 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1">
                  <span>Battery</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th onClick={() => handleSort('driving_range_km')} className="py-2.5 px-3 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1">
                  <span>Range (km)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th onClick={() => handleSort('base_price_usd')} className="py-2.5 px-3 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1">
                  <span>Base MSRP ($)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th onClick={() => handleSort('annual_sales_units')} className="py-2.5 px-3 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1">
                  <span>Annual Sales</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th onClick={() => handleSort('fast_charge_mins')} className="py-2.5 px-3 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1">
                  <span>Charge (10-80%)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th onClick={() => handleSort('customer_rating')} className="py-2.5 px-3 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1">
                  <span>Rating</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th onClick={() => handleSort('manufacturing_country')} className="py-2.5 px-3 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1">
                  <span>Origin</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {paginatedData.map((row) => (
              <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-2.5 px-3 text-white font-medium whitespace-nowrap">{row.model_name}</td>
                <td className="py-2.5 px-3 text-cyan-400 whitespace-nowrap">{row.manufacturer}</td>
                <td className="py-2.5 px-3 text-slate-300">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                    {row.category}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-slate-400">{row.release_year}</td>
                <td className="py-2.5 px-3">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    row.battery_tech === 'LFP' ? 'bg-amber-500/10 text-amber-400' :
                    row.battery_tech === 'NMC' ? 'bg-blue-500/10 text-blue-400' :
                    row.battery_tech === 'Solid-State' ? 'bg-emerald-500/10 text-emerald-400' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {row.battery_tech}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold whitespace-nowrap">{row.driving_range_km} km</td>
                <td className="py-2.5 px-3 text-slate-200 whitespace-nowrap">${row.base_price_usd.toLocaleString()}</td>
                <td className="py-2.5 px-3 text-white font-semibold whitespace-nowrap">{row.annual_sales_units.toLocaleString()}</td>
                <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{row.fast_charge_mins} min</td>
                <td className="py-2.5 px-3 text-amber-400 font-bold whitespace-nowrap">★ {row.customer_rating}</td>
                <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{row.manufacturing_country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span>Show:</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="px-2 py-1 bg-slate-950 border border-slate-700 rounded text-slate-200"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>per page (Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length})</span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="p-1.5 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 font-mono text-slate-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="p-1.5 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}


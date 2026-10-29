import React from 'react';
import { 
  Zap, 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Terminal, 
  Gauge, 
  Table, 
  FileText,
  Download,
  Globe
} from 'lucide-react';

const GithubIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export default function Navbar({ activeTab, setActiveTab, onExportCSV, recordCount }) {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'story', label: 'Data Story (6 Scenes)', icon: BookOpen, badge: 'Tableau-Style' },
    { id: 'scenarios', label: 'Persona Scenarios', icon: Users, badge: '3 Personas' },
    { id: 'sql', label: 'SQL Query Engine', icon: Terminal, badge: 'Live DB' },
    { id: 'performance', label: 'Performance Testing', icon: Gauge, badge: 'Testing' },
    { id: 'data', label: 'Dataset & Export', icon: Table, count: recordCount },
    { id: 'docs', label: 'Documentation & Video', icon: FileText, badge: 'Docs' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Project Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
              <Zap className="w-6 h-6 text-white fill-white/20" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  EV Market Insights
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  BI System
                </span>
              </div>
              <p className="hidden md:block text-xs text-slate-400">
                Electric Vehicle Market Performance, Tech Benchmarking & Storytelling
              </p>
            </div>
          </div>

          {/* Quick Actions (Vercel & GitHub Badges) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onExportCSV}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-lg transition-all shadow-sm"
              title="Download full 650-record dataset CSV for Tableau, Excel, or SQL"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <span className="hidden xl:inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium bg-slate-800/80 text-cyan-300 border border-cyan-500/30 rounded-full">
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>Vercel Deployable</span>
            </span>

            <span className="hidden xl:inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700 rounded-full">
              <GithubIcon className="w-3 h-3 text-slate-300" />
              <span>GitHub Ready</span>
            </span>
          </div>
        </div>

        {/* Tab Navigation Navigation Strip */}
        <div className="flex items-center space-x-1 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none text-xs sm:text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-semibold bg-slate-800 text-slate-400">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

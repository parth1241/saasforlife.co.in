import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaSignOutAlt, FaRocket, FaClock, FaGlobe, FaShieldAlt, FaChartLine, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

export default function Dashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState('');

  // Service toggles (Simulated state)
  const [uptimeAlerts, setUptimeAlerts] = useState(true);
  const [cdnCaching, setCdnCaching] = useState(true);
  const [weeklyBackups, setWeeklyBackups] = useState(false);

  useEffect(() => {
    // Redirect if loaded and unauthorized
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const response = await axios.get('/api/dashboard/stats');
        if (response.data && response.data.stats) {
          setStats(response.data.stats);
        } else {
          setError('Failed to load dashboard metrics.');
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Connection error. Could not retrieve live metrics.');
      } finally {
        setLoadingStats(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loadingStats) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm font-semibold tracking-wider">Syncing dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white p-6 font-sans">
        <div className="max-w-md w-full bg-[#1E293B] border border-slate-800 p-8 rounded-3xl text-center space-y-6">
          <FaExclamationTriangle className="text-5xl text-amber-500 mx-auto" />
          <h3 className="text-xl font-bold">Error Loading Dashboard</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{error || 'An unexpected error occurred.'}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Retry Connection
            </button>
            <button
              onClick={logout}
              className="px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:text-white transition-colors cursor-pointer text-xs font-semibold"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { metrics, chartData, services } = stats;

  // Custom SVG Chart calculations
  const chartWidth = 500;
  const chartHeight = 160;
  const paddingX = 40;
  const paddingY = 20;

  const maxVisits = Math.max(...chartData.map((d) => d.visits), 100);

  // Generate SVG coordinates
  const points = chartData.map((d, i) => {
    const x = paddingX + (i * (chartWidth - paddingX * 2)) / (chartData.length - 1);
    const y = chartHeight - paddingY - (d.visits / maxVisits) * (chartHeight - paddingY * 2);
    return { x, y, day: d.day, visits: d.visits };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans pb-16">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-[#1E293B]/30 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-1 font-bold text-lg tracking-tight text-white select-none">
              <span>saasforlife.co.in</span>
              <span className="text-blue-500 text-2xl leading-none">.</span>
            </Link>
            <nav className="hidden md:flex space-x-1 text-sm font-semibold text-slate-400">
              <span className="px-4 py-2 rounded-xl bg-slate-800 text-white">Dashboard</span>
              <a href="#settings" className="px-4 py-2 rounded-xl hover:text-white transition-colors">Settings</a>
              <a href="#billing" className="px-4 py-2 rounded-xl hover:text-white transition-colors">Billing</a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2.5 pr-2 border-r border-slate-800">
              <div className="w-8 h-8 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm uppercase">
                {user.name.slice(0, 1)}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-slate-300">
                {user.name}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700/60 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 text-slate-400 transition-all cursor-pointer flex items-center space-x-1.5 text-xs font-semibold"
              title="Logout"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        {/* Sandbox Warning Banner */}
        {user.planStatus !== 'Active' && (
          <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4 text-center sm:text-left">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                <FaExclamationTriangle className="text-xl" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Account Sandbox Mode</h4>
                <p className="text-xs text-slate-400 mt-1">
                  You are currently using a demo account. Upgrade to a paid SaaS hosting plan to activate SSL, custom domains, and scale metrics.
                </p>
              </div>
            </div>
            <Link
              to="/#pricing"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-500/10 whitespace-nowrap"
            >
              View Pricing Plans
            </Link>
          </div>
        )}

        {/* Dashboard Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">SaaS Console</h1>
          <p className="text-xs text-slate-400 mt-1">
            Plan Level: <span className="text-blue-400 font-bold uppercase">{user.plan || 'Demo Sandbox'}</span> 
            {user.planStatus === 'Active' && <span className="ml-2 text-emerald-400 text-xxs bg-emerald-500/10 border border-emerald-500/10 px-2 py-0.5 rounded-full font-bold uppercase">Active</span>}
          </p>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Visits */}
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-xxs uppercase tracking-wider font-semibold text-slate-400">Total Visits (7d)</span>
              <p className="text-2xl font-bold">{metrics.totalVisits.toLocaleString()}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-500/5 text-blue-400 border border-blue-500/5">
              <FaChartLine className="text-lg" />
            </div>
          </div>

          {/* Active Users */}
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-xxs uppercase tracking-wider font-semibold text-slate-400">Active Sessions</span>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-2xl font-bold">{metrics.activeUsers}</p>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-500/5 text-emerald-400 border border-emerald-500/5">
              <FaUser className="text-lg" />
            </div>
          </div>

          {/* Page Speed */}
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-xxs uppercase tracking-wider font-semibold text-slate-400">Page Load Time</span>
              <p className="text-2xl font-bold">{metrics.pageLoadSpeed}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-purple-500/5 text-purple-400 border border-purple-500/5">
              <FaClock className="text-lg" />
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-xxs uppercase tracking-wider font-semibold text-slate-400">Conversion Rate</span>
              <p className="text-2xl font-bold">{metrics.conversionRate}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-indigo-500/5 text-indigo-400 border border-indigo-500/5">
              <FaRocket className="text-lg" />
            </div>
          </div>
        </div>

        {/* Analytics Section & Active Services */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* SVG Area Chart */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-[#1E293B]/40 border border-slate-800/80 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Visitor Traffic History</h3>
              <span className="text-xxs bg-blue-500/10 border border-blue-500/10 px-2 py-0.5 rounded-full text-blue-400 font-bold uppercase">Live</span>
            </div>

            <div className="relative w-full aspect-[5/2] min-h-[180px]">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-full overflow-visible"
              >
                <defs>
                  {/* Fill Gradient */}
                  <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                  </linearGradient>
                  {/* Line Gradient */}
                  <linearGradient id="chart-line" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" />
                <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" />
                <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="#334155" strokeWidth="1" />

                {/* Area under the line */}
                <path d={areaPath} fill="url(#chart-fill)" />

                {/* Main line */}
                <path d={linePath} fill="none" stroke="url(#chart-line)" strokeWidth="3.5" strokeLinecap="round" />

                {/* Coordinates & Hover points */}
                {points.map((p, idx) => (
                  <g key={idx}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4.5"
                      fill="#1E293B"
                      stroke={idx % 2 === 0 ? '#3B82F6' : '#10B981'}
                      strokeWidth="2.5"
                      className="transition-all duration-200 hover:r-6 hover:stroke-white cursor-pointer"
                    />
                    {/* Visits Labels on node */}
                    <text
                      x={p.x}
                      y={p.y - 12}
                      textAnchor="middle"
                      fill="#94A3B8"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {p.visits >= 1000 ? `${(p.visits / 1000).toFixed(1)}k` : p.visits}
                    </text>
                    {/* Day label */}
                    <text
                      x={p.x}
                      y={chartHeight - 4}
                      textAnchor="middle"
                      fill="#64748B"
                      fontSize="10"
                      fontWeight="600"
                    >
                      {p.day}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Integration Features Panel */}
          <div className="lg:col-span-4 space-y-6">
            {/* Active Core Integrations */}
            <div className="p-6 rounded-3xl bg-[#1E293B]/40 border border-slate-800/80 shadow-lg space-y-5">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Core Integrations</h3>

              <div className="space-y-4 text-xs font-semibold">
                {/* SSL */}
                <div className="flex items-center justify-between border-b border-slate-800/55 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <FaShieldAlt className="text-blue-500 text-sm" />
                    <span>SSL Certificate</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full border text-xxs font-bold ${
                    services.ssl === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {services.ssl}
                  </span>
                </div>

                {/* Custom Domain */}
                <div className="flex items-center justify-between border-b border-slate-800/55 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <FaGlobe className="text-blue-500 text-sm" />
                    <span>Custom Domain Mapping</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full border text-xxs font-bold ${
                    services.customDomain === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {services.customDomain}
                  </span>
                </div>

                {/* API Gateways */}
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center space-x-2.5">
                    <FaCheckCircle className="text-blue-500 text-sm" />
                    <span>Developer API & Webhooks</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full border text-xxs font-bold ${
                    services.apiAccess === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {services.apiAccess}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Control Toggles */}
            <div className="p-6 rounded-3xl bg-[#1E293B]/40 border border-slate-800/80 shadow-lg space-y-5">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Simulate Controls</h3>

              <div className="space-y-4">
                {/* Uptime Alerts Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Uptime Discord Alerts</span>
                  <button
                    onClick={() => setUptimeAlerts(!uptimeAlerts)}
                    className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                      uptimeAlerts ? 'bg-blue-600' : 'bg-slate-800 border border-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${uptimeAlerts ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* CDN Caching Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Edge CDN Cache Caching</span>
                  <button
                    onClick={() => setCdnCaching(!cdnCaching)}
                    className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                      cdnCaching ? 'bg-blue-600' : 'bg-slate-800 border border-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${cdnCaching ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Backups Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Weekly Backup Schedules</span>
                  <button
                    onClick={() => setWeeklyBackups(!weeklyBackups)}
                    className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                      weeklyBackups ? 'bg-blue-600' : 'bg-slate-800 border border-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${weeklyBackups ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

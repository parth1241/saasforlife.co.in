import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaUser, FaSignOutAlt, FaRocket, FaClock, FaGlobe, 
  FaShieldAlt, FaChartLine, FaCheckCircle, FaExclamationTriangle,
  FaCommentDots, FaPaperPlane, FaTimes, FaLock, FaEnvelope, 
  FaFileInvoiceDollar, FaCog, FaListAlt, FaInfoCircle
} from 'react-icons/fa';
import axios from 'axios';

export default function Dashboard() {
  const { user, logout, loading: authLoading, updateLocalUser } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('console'); // console, leads, settings, billing
  const [leads, setLeads] = useState([]);

  // Settings form states
  const [profileName, setProfileName] = useState('');
  const [websiteAbout, setWebsiteAbout] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  // Website binding states
  const [websiteInput, setWebsiteInput] = useState('');
  const [isEditingWebsite, setIsEditingWebsite] = useState(false);
  const [updatingWebsite, setUpdatingWebsite] = useState(false);

  // Support live chat states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  const [sendingChat, setSendingChat] = useState(false);

  // Service toggles (Simulated state)
  const [uptimeAlerts, setUptimeAlerts] = useState(true);
  const [cdnCaching, setCdnCaching] = useState(true);
  const [weeklyBackups, setWeeklyBackups] = useState(false);

  const chatBottomRef = React.useRef(null);

  // Poll for messages while chat drawer is open
  useEffect(() => {
    let interval;
    if (chatOpen) {
      fetchChatMessages();
      interval = setInterval(() => {
        fetchChatMessages(true);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [chatOpen]);

  // Scroll chat drawer to bottom on new messages
  useEffect(() => {
    if (chatOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatOpen]);

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
          if (response.data.stats.leads) {
            setLeads(response.data.stats.leads);
          }
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
      setProfileName(user.name || '');
      setWebsiteAbout(user.websiteAbout || '');
    }
  }, [user, authLoading, navigate]);

  const fetchChatMessages = async (silent = false) => {
    if (!silent) setLoadingChat(true);
    try {
      const response = await axios.get('/api/support/messages');
      if (response.data && response.data.success) {
        setChatMessages(response.data.messages);
      }
    } catch (err) {
      console.error('Failed to fetch chat logs:', err);
    } finally {
      if (!silent) setLoadingChat(false);
    }
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setSendingChat(true);
    try {
      const response = await axios.post('/api/support/messages', {
        text: chatInput.trim(),
      });
      if (response.data && response.data.success) {
        setChatMessages(prev => [...prev, response.data.message]);
        setChatInput('');
      }
    } catch (err) {
      console.error('Failed to send support message:', err);
    } finally {
      setSendingChat(false);
    }
  };

  const handleWebsiteSubmit = async (e) => {
    e.preventDefault();
    if (!websiteInput.trim()) return;

    setUpdatingWebsite(true);
    try {
      const response = await axios.post('/api/dashboard/update-website', {
        website: websiteInput.trim(),
      });
      if (response.data && response.data.success) {
        updateLocalUser({ website: response.data.website });
        setIsEditingWebsite(false);
      }
    } catch (err) {
      console.error('Error setting website:', err);
      alert(err.response?.data?.message || 'Failed to update website domain.');
    } finally {
      setUpdatingWebsite(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    setProfileError('');

    if (newPassword && newPassword !== confirmPassword) {
      setProfileError('Passwords do not match.');
      return;
    }

    setUpdatingProfile(true);
    try {
      const response = await axios.post('/api/dashboard/update-profile', {
        name: profileName,
        websiteAbout,
        password: newPassword || undefined,
      });

      if (response.data && response.data.success) {
        updateLocalUser(response.data.user);
        setProfileMessage('Settings updated successfully!');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setProfileError(err.response?.data?.message || 'Failed to update profile settings.');
    } finally {
      setUpdatingProfile(false);
    }
  };

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
              <button
                onClick={() => setActiveTab('console')}
                className={`px-4 py-2 rounded-xl font-bold cursor-pointer transition-all ${
                  activeTab === 'console' ? 'bg-slate-800 text-white' : 'hover:text-white'
                }`}
              >
                Console
              </button>
              <button
                onClick={() => setActiveTab('leads')}
                className={`px-4 py-2 rounded-xl font-bold cursor-pointer transition-all ${
                  activeTab === 'leads' ? 'bg-slate-800 text-white' : 'hover:text-white'
                }`}
              >
                Leads
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-xl font-bold cursor-pointer transition-all ${
                  activeTab === 'settings' ? 'bg-slate-800 text-white' : 'hover:text-white'
                }`}
              >
                Settings
              </button>
              <button
                onClick={() => setActiveTab('billing')}
                className={`px-4 py-2 rounded-xl font-bold cursor-pointer transition-all ${
                  activeTab === 'billing' ? 'bg-slate-800 text-white' : 'hover:text-white'
                }`}
              >
                Billing
              </button>
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
        {/* TAB 1: CONSOLE / ANALYTICS */}
        {activeTab === 'console' && (
          <>
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
                <button
                  onClick={() => setActiveTab('billing')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-500/10 whitespace-nowrap cursor-pointer"
                >
                  Upgrade Now
                </button>
              </div>
            )}

            {/* Title Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">SaaS Console</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Plan Level: <span className="text-blue-400 font-bold uppercase">{user.plan || 'Demo Sandbox'}</span> 
                  {user.planStatus === 'Active' && <span className="ml-2 text-emerald-400 text-xxs bg-emerald-500/10 border border-emerald-500/10 px-2 py-0.5 rounded-full font-bold uppercase">Active</span>}
                </p>
              </div>
            </div>

            {/* Tracking Domain setup */}
            {!user.website ? (
              <div className="p-6 rounded-2xl bg-[#1E293B]/40 border border-slate-800/80 shadow-xl space-y-3">
                <div className="flex items-center space-x-2">
                  <FaGlobe className="text-blue-500 text-sm animate-pulse" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">Website Domain Setup</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Waiting for the administrator to link your tracking website domain. Please write what your website is about in the <button onClick={() => setActiveTab('settings')} className="text-blue-400 hover:underline font-semibold bg-transparent border-none p-0 cursor-pointer">Settings tab</button> or send a message to support below to request domain setup.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <FaGlobe className="text-blue-400 text-lg shrink-0" />
                  <div>
                    <h4 className="font-semibold text-xs text-white">Tracking live analytics for: <span className="text-blue-300 underline font-bold">{user.website}</span></h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Your traffic analytics charts and session monitoring are bound to this domain.</p>
                  </div>
                </div>
              </div>
            )}

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

            {/* Tracking Script Code Block */}
            {user.website && (
              <div className="p-6 rounded-3xl bg-[#1E293B]/40 border border-slate-800/80 shadow-lg space-y-5">
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Website Integration Code</h3>
                  <p className="text-xs text-slate-400 mt-2">
                    Copy and paste the code block below right before the closing <code>&lt;/body&gt;</code> tag on your website to start tracking real visits, page load speed, and conversions.
                  </p>
                </div>
                <pre className="p-4 bg-slate-950/80 rounded-2xl text-[10px] text-emerald-400 font-mono overflow-x-auto select-all border border-slate-800/80 leading-relaxed">
{`<!-- saasforlife.co.in Live Tracking Snippet -->
<script>
  (function() {
    var loadTime = (performance.timing.loadEventEnd - performance.timing.navigationStart) / 1000;
    fetch('https://www.saasforlife.co.in/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: '${user.website}',
        path: window.location.pathname,
        loadTime: loadTime > 0 ? loadTime : 0.5,
        converted: false
      })
    }).catch(function(err) { console.error(err); });
  })();
</script>`}
                </pre>

                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">Leads Form Submission (CORS API)</h4>
                  <p className="text-xs text-slate-400 mt-2">
                    To capture name, email, phone, and messages from form submissions on your website and show them in your dashboard <b>Leads</b> tab, make a POST call to this URL inside your form's submit handler:
                  </p>
                </div>
                <pre className="p-4 bg-slate-950/80 rounded-2xl text-[10px] text-blue-400 font-mono overflow-x-auto select-all border border-slate-800/80 leading-relaxed">
{`fetch('https://www.saasforlife.co.in/api/support/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    domain: '${user.website}',
    name: nameValue,
    email: emailValue,
    phone: phoneValue, // Optional
    company: companyValue, // Optional
    message: messageValue
  })
}).then(function(res) { return res.json(); })
  .then(function(data) { console.log('Lead saved:', data); })
  .catch(function(err) { console.error('Error saving lead:', err); });`}
                </pre>
              </div>
            )}
          </>
        )}

        {/* TAB 2: LEADS */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center">
                <FaListAlt className="mr-3 text-blue-500" /> Customer Leads
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Submissions captured from your website forms using our leads submission endpoint.
              </p>
            </div>

            {leads.length === 0 ? (
              <div className="p-12 rounded-3xl bg-[#1E293B]/40 border border-slate-800/80 shadow-lg text-center space-y-4 max-w-2xl">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-blue-500 animate-pulse">
                  <FaEnvelope className="text-xl" />
                </div>
                <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider">No Leads Collected Yet</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Forms submitted on your custom website will appear here in real-time. Make sure to embed the Leads Form Submission snippet shown in the <b>Console</b> tab on your website.
                </p>
              </div>
            ) : (
              <div className="bg-[#1E293B]/40 border border-slate-800/80 rounded-3xl shadow-xl overflow-hidden animate-fade-in">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900/40 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Company</th>
                        <th className="p-4">Message</th>
                        <th className="p-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {leads.map((lead) => (
                        <tr key={lead._id} className="hover:bg-slate-900/10 transition-colors">
                          <td className="p-4 text-white font-bold">{lead.name}</td>
                          <td className="p-4 text-slate-300">{lead.email}</td>
                          <td className="p-4 text-slate-400">{lead.phone || '-'}</td>
                          <td className="p-4 text-slate-400">{lead.company || '-'}</td>
                          <td className="p-4 text-slate-300 max-w-xs truncate" title={lead.message}>{lead.message}</td>
                          <td className="p-4 text-slate-500">
                            {new Date(lead.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center">
                <FaCog className="mr-3 text-blue-500" /> Profile Settings
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Configure your account details and describe the website features you want built.
              </p>
            </div>

            <div className="bg-[#1E293B]/40 border border-slate-800/80 p-8 rounded-3xl shadow-xl space-y-6 animate-fade-in">
              {profileMessage && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center space-x-2">
                  <span>✓ {profileMessage}</span>
                </div>
              )}

              {profileError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center space-x-2">
                  <FaExclamationTriangle className="shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="settings-name" className="block text-slate-300 font-semibold text-xs uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    id="settings-name"
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-[#0F172A] text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Website Description */}
                <div className="space-y-2">
                  <label htmlFor="settings-about" className="block text-slate-300 font-semibold text-xs uppercase tracking-wider flex items-center">
                    What your website is about
                  </label>
                  <p className="text-[10px] text-slate-500">
                    Provide descriptions, scale features, pages, or styling guidelines you want. The admin will read this when building your custom site.
                  </p>
                  <textarea
                    id="settings-about"
                    rows="5"
                    value={websiteAbout}
                    onChange={(e) => setWebsiteAbout(e.target.value)}
                    placeholder="Example: I want a local coffee shop business website with a landing page, a menu section, a contact form, and smooth scroll animations. Colors should be warm browns and creams."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-[#0F172A] text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="border-t border-slate-800/80 pt-4 space-y-4">
                  <h3 className="text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center">
                    <FaLock className="mr-2 text-slate-500" /> Change Account Password
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="settings-new-pass" className="block text-slate-400 text-xs font-semibold">New Password</label>
                      <input
                        id="settings-new-pass"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-[#0F172A] text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="settings-confirm-pass" className="block text-slate-400 text-xs font-semibold">Confirm Password</label>
                      <input
                        id="settings-confirm-pass"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-[#0F172A] text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/10 transition-all cursor-pointer disabled:opacity-50"
                >
                  {updatingProfile ? 'Saving updates...' : 'Save Settings'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: BILLING */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center">
                <FaFileInvoiceDollar className="mr-3 text-blue-500" /> Billing Logs
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                View your active plan, transaction details, or upgrade your hosting scale.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
              {/* Plan info */}
              <div className="lg:col-span-5 bg-[#1E293B]/40 border border-slate-800/80 p-6 rounded-3xl shadow-xl space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Plan Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Current Package</span>
                    <span className="text-white font-bold uppercase">{user.plan || 'Demo Sandbox'}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Plan Status</span>
                    <span className={`px-2 py-0.5 rounded-full border text-xxs font-bold ${user.planStatus === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                      {user.planStatus === 'Active' ? 'Active' : 'Sandbox (Demo)'}
                    </span>
                  </div>

                  {user.planStatus === 'Active' && (
                    <>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-semibold">Billing Period</span>
                        <span className="text-white font-semibold">{user.planBilling || 'Monthly'}</span>
                      </div>

                      <div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-3">
                        <span className="text-slate-400 font-semibold">Transaction Marker</span>
                        <span className="text-emerald-400 font-mono text-xxs">{user.razorpayPaymentId || 'rzp_test_Sz0skVptcC6ix5'}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Plans selector for Upgrade */}
              {user.planStatus !== 'Active' && (
                <div className="lg:col-span-7 bg-[#1E293B]/40 border border-slate-800/80 p-6 rounded-3xl shadow-xl space-y-4">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Upgrade Plan</h3>
                  <p className="text-xs text-slate-400">
                    Get started with a paid plan to link custom domains, set up automated SSL certificates, and receive live support.
                  </p>
                  
                  <div className="space-y-3 pt-2">
                    {[
                      { name: 'Starter', price: '₹1,499/mo', desc: 'Best for single businesses starting out' },
                      { name: 'Growth', price: '₹3,999/mo', desc: 'Best for scaling teams, custom domains' },
                      { name: 'Scale', price: '₹8,999/mo', desc: 'Enterprise SLAs, webhooks, and white labeling' }
                    ].map((p, idx) => (
                      <div key={idx} className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-colors">
                        <div>
                          <h4 className="font-bold text-xs text-white">{p.name}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">{p.desc}</p>
                        </div>
                        <div className="text-right flex items-center space-x-3">
                          <span className="text-xs font-bold text-blue-400">{p.price}</span>
                          <button
                            onClick={async () => {
                              try {
                                const response = await axios.post('/api/dashboard/upgrade', {
                                  plan: p.name,
                                  billingCycle: 'Monthly'
                                });
                                if (response.data && response.data.success) {
                                  updateLocalUser(response.data.user);
                                  alert(`Success! Upgraded to ${p.name} Plan.`);
                                  window.location.reload();
                                }
                              } catch (err) {
                                console.error('Checkout error:', err);
                                alert('Failed to upgrade. Please contact support.');
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase cursor-pointer"
                          >
                            Buy
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Support Chat Floating Button */}
      <div className="fixed bottom-6 right-24 z-50">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-500/20 cursor-pointer transition-all hover:scale-105 active:scale-95"
          title="Open Customer Support Chat"
        >
          {chatOpen ? <FaTimes className="text-xl" /> : <FaCommentDots className="text-xl animate-pulse" />}
        </button>
      </div>

      {/* Support Chat Drawer */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[500px] bg-[#1E293B] border border-slate-800 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden animate-slide-in backdrop-blur-md">
          {/* Header */}
          <div className="p-4 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-white">Live Support Chat</h3>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer text-sm"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages Log Area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-slate-950/20">
            {loadingChat && chatMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
                Connecting to support agent...
              </div>
            ) : chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 text-xs px-4">
                <FaCommentDots className="text-2xl mb-2 text-slate-600" />
                <span>Hi {user.name}! Need any help?</span>
                <span className="text-[10px] mt-1 text-slate-500">Ask a question and our legal & tech support will reply here.</span>
              </div>
            ) : (
              chatMessages.map((m) => {
                const isUser = m.sender === 'user';
                return (
                  <div
                    key={m._id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs shadow-md leading-relaxed ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-none border border-blue-500'
                        : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/80'
                    }`}>
                      {m.text}
                    </div>
                    <span className="text-[8px] text-slate-500 mt-1 px-1">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Footer Input Area */}
          <form onSubmit={handleSendChatMessage} className="p-3 bg-slate-900 border-t border-slate-800/80 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask a question..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={sendingChat}
              className="flex-grow px-3 py-2 bg-[#0F172A] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || sendingChat}
              className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md transition-all shrink-0 cursor-pointer disabled:opacity-50"
            >
              {sendingChat ? (
                <div className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaPaperPlane className="text-xxs" />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

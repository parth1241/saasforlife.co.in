import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUser, FaEnvelope, FaGlobe, FaSearch, FaPaperPlane, 
  FaSync, FaSignOutAlt, FaCommentDots, FaArrowLeft, 
  FaShieldAlt, FaCircle, FaUsers, FaChartBar, FaTicketAlt,
  FaCopy, FaCheck, FaPhone, FaBriefcase, FaDatabase, FaClock
} from 'react-icons/fa';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState('');

  // Admin Dashboard States
  const [adminTab, setAdminTab] = useState('chats'); // 'chats' or 'leads'
  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [updatingDomain, setUpdatingDomain] = useState(false);
  const [domainError, setDomainError] = useState('');
  const [domainSuccess, setDomainSuccess] = useState('');
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedLeads, setCopiedLeads] = useState(false);
  const [leadsSearch, setLeadsSearch] = useState('');
  
  const chatEndRef = useRef(null);

  // Poll for messages when a user is selected
  useEffect(() => {
    let interval;
    if (selectedUser) {
      fetchMessages(selectedUser._id);
      interval = setInterval(() => {
        fetchMessages(selectedUser._id, true); // silent refresh
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [selectedUser]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Sync domain state on selection
  useEffect(() => {
    if (selectedUser) {
      setNewDomain(selectedUser.website || '');
      setDomainError('');
      setDomainSuccess('');
    }
  }, [selectedUser]);

  // Fetch leads when switching tabs
  useEffect(() => {
    if (adminTab === 'leads') {
      fetchLeads();
    }
  }, [adminTab]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      setError('');
      const response = await axios.get('/api/admin/users');
      if (response.data && response.data.success) {
        setUsers(response.data.users);
      } else {
        setError('Failed to load user database');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Access denied or network error.');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchLeads = async () => {
    try {
      setLoadingLeads(true);
      const response = await axios.get('/api/admin/leads');
      if (response.data && response.data.success) {
        setLeads(response.data.leads);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoadingLeads(false);
    }
  };

  const fetchMessages = async (userId, silent = false) => {
    if (!silent) setLoadingMessages(true);
    try {
      const response = await axios.get(`/api/support/messages?userId=${userId}`);
      if (response.data && response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (err) {
      console.error('Error fetching support messages:', err);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedUser) return;

    setSendingMessage(true);
    try {
      const response = await axios.post('/api/support/messages', {
        text: replyText.trim(),
        userId: selectedUser._id,
      });

      if (response.data && response.data.success) {
        setMessages(prev => [...prev, response.data.message]);
        setReplyText('');
        // Update user messageCount list locally
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u._id === selectedUser._id 
              ? { ...u, messageCount: (u.messageCount || 0) + 1 }
              : u
          )
        );
      }
    } catch (err) {
      console.error('Failed to send reply:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleUpdateDomain = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setUpdatingDomain(true);
    setDomainError('');
    setDomainSuccess('');
    
    try {
      const response = await axios.post('/api/admin/update-user-website', {
        userId: selectedUser._id,
        website: newDomain.trim()
      });
      
      if (response.data && response.data.success) {
        setDomainSuccess('Domain updated successfully!');
        // Update user record in selectedUser
        setSelectedUser(prev => ({
          ...prev,
          website: response.data.user.website,
          websiteAbout: response.data.user.websiteAbout
        }));
        // Update user in users list
        setUsers(prev => prev.map(u => 
          u._id === selectedUser._id 
            ? { ...u, website: response.data.user.website }
            : u
        ));
      } else {
        setDomainError('Failed to update domain');
      }
    } catch (err) {
      console.error('Error updating domain:', err);
      setDomainError(err.response?.data?.message || 'Failed to update domain');
    } finally {
      setUpdatingDomain(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'script') {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } else {
      setCopiedLeads(true);
      setTimeout(() => setCopiedLeads(false), 2000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filtered users for search query
  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.website?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered leads for search query
  const filteredLeads = leads.filter(l => 
    l.name?.toLowerCase().includes(leadsSearch.toLowerCase()) ||
    l.email?.toLowerCase().includes(leadsSearch.toLowerCase()) ||
    l.domain?.toLowerCase().includes(leadsSearch.toLowerCase()) ||
    l.company?.toLowerCase().includes(leadsSearch.toLowerCase()) ||
    l.message?.toLowerCase().includes(leadsSearch.toLowerCase()) ||
    (l.user && (
      l.user.name?.toLowerCase().includes(leadsSearch.toLowerCase()) ||
      l.user.email?.toLowerCase().includes(leadsSearch.toLowerCase())
    ))
  );

  // Statistics calculation
  const totalUsers = users.length;
  const activeSubs = users.filter(u => u.planStatus === 'Active').length;
  const totalMessageCount = users.reduce((sum, u) => sum + (u.messageCount || 0), 0);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col font-sans pb-12">
      {/* Header */}
      <header className="bg-[#1E293B]/80 border-b border-slate-800 px-6 py-4 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <FaShieldAlt className="text-white text-lg" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-extrabold text-lg tracking-tight">saasforlife Control Center</h1>
            <p className="text-xs text-blue-400 font-medium flex items-center">
              <FaCircle className="text-emerald-500 text-[8px] mr-1.5 animate-pulse" />
              Secure Admin Console ({user?.email})
            </p>
          </div>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="flex items-center space-x-2 bg-slate-950/40 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setAdminTab('chats')}
            className={`px-4 py-2 rounded-lg font-bold text-xs cursor-pointer transition-all flex items-center space-x-2 ${
              adminTab === 'chats' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FaCommentDots />
            <span>Chats & Users</span>
          </button>
          <button
            onClick={() => setAdminTab('leads')}
            className={`px-4 py-2 rounded-lg font-bold text-xs cursor-pointer transition-all flex items-center space-x-2 ${
              adminTab === 'leads' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FaTicketAlt />
            <span>Leads Database</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={adminTab === 'chats' ? fetchUsers : fetchLeads} 
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-all text-slate-400 hover:text-white cursor-pointer"
            title="Refresh database"
          >
            <FaSync className={(loadingUsers || loadingLeads) ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={handleLogout} 
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/40 border border-red-500/20 text-red-400 hover:text-red-300 transition-all text-sm font-semibold cursor-pointer shrink-0"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex flex-col max-w-[1600px] w-full mx-auto p-6 gap-6">
        
        {adminTab === 'chats' ? (
          <div className="flex flex-col md:flex-row gap-6 w-full flex-grow">
            {/* Left column: Metrics & User Database */}
            <div className="w-full md:w-5/12 lg:w-4/12 flex flex-col gap-6 shrink-0">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl flex flex-col">
                  <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Total Users</span>
                  <span className="text-xl font-bold mt-1 text-blue-400">{totalUsers}</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl flex flex-col">
                  <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Active Subs</span>
                  <span className="text-xl font-bold mt-1 text-emerald-400">{activeSubs}</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl flex flex-col">
                  <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Total Chats</span>
                  <span className="text-xl font-bold mt-1 text-violet-400">{totalMessageCount}</span>
                </div>
              </div>

              {/* User Database Panel */}
              <div className="bg-[#1E293B]/40 border border-slate-800/80 rounded-2xl shadow-xl flex-grow flex flex-col overflow-hidden max-h-[70vh]">
                <div className="p-4 border-b border-slate-800/80 flex flex-col gap-3">
                  <h2 className="font-bold text-sm text-slate-300 uppercase tracking-wider flex items-center">
                    <FaUsers className="mr-2 text-blue-400" /> User Database
                  </h2>
                  {/* Search */}
                  <div className="relative">
                    <FaSearch className="absolute left-3.5 top-3 text-slate-500 text-sm" />
                    <input
                      type="text"
                      placeholder="Search name, email, or domain..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Users List */}
                <div className="flex-grow overflow-y-auto p-3 space-y-2">
                  {loadingUsers ? (
                    <div className="py-20 text-center text-slate-500 text-sm">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      Loading accounts...
                    </div>
                  ) : error ? (
                    <div className="py-20 text-center text-red-400 text-xs px-4">
                      {error}
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="py-20 text-center text-slate-500 text-xs">
                      No users found matching search query.
                    </div>
                  ) : (
                    filteredUsers.map((u) => (
                      <button
                        key={u._id}
                        onClick={() => setSelectedUser(u)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between cursor-pointer ${
                          selectedUser?._id === u._id
                            ? 'bg-blue-600/10 border-blue-500/50 shadow-md shadow-blue-500/5'
                            : 'bg-slate-900/30 border-slate-800/60 hover:bg-slate-800/30 hover:border-slate-700/80'
                        }`}
                      >
                        <div className="space-y-1.5 min-w-0 pr-2">
                          <div className="font-bold text-xs text-white truncate">{u.name}</div>
                          <div className="text-[10px] text-slate-400 truncate flex items-center">
                            <FaEnvelope className="mr-1 text-slate-500 shrink-0" />
                            {u.email}
                          </div>
                          {u.website && (
                            <div className="text-[10px] text-blue-300 font-medium truncate flex items-center">
                              <FaGlobe className="mr-1 text-blue-400 shrink-0" />
                              {u.website}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-1 shrink-0">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            u.plan === 'Pro' 
                              ? 'bg-purple-950 border border-purple-500/30 text-purple-400' 
                              : u.plan === 'Enterprise'
                              ? 'bg-blue-950 border border-blue-500/30 text-blue-400'
                              : u.plan === 'Starter'
                              ? 'bg-emerald-950 border border-emerald-500/30 text-emerald-400'
                              : 'bg-slate-950 border border-slate-800 text-slate-500'
                          }`}>
                            {u.plan}
                          </span>
                          {u.messageCount > 0 && (
                            <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center">
                              <FaCommentDots className="mr-1 text-[8px]" />
                              {u.messageCount}
                            </span>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right column: Interactive Support Chat & User Settings split pane */}
            <div className="w-full md:w-7/12 lg:w-8/12 flex flex-col">
              <div className="bg-[#1E293B]/40 border border-slate-800/80 rounded-2xl shadow-xl flex-grow flex flex-col overflow-hidden min-h-[500px] max-h-[80vh] relative">
                {selectedUser ? (
                  <div className="flex flex-col lg:flex-row flex-grow overflow-hidden h-full">
                    
                    {/* Chat Section */}
                    <div className="flex-grow flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800/80 min-w-0">
                      {/* Chat User Header */}
                      <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                            <FaUser className="text-slate-400 text-sm" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-sm truncate">{selectedUser.name}</div>
                            <div className="text-xs text-slate-400 truncate">{selectedUser.email}</div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <div className="bg-slate-950/40 border border-slate-800 px-3 py-1 rounded-lg text-right hidden sm:block">
                            <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Plan Status</div>
                            <div className={`text-[10px] font-bold ${selectedUser.planStatus === 'Active' ? 'text-emerald-400' : 'text-slate-400'}`}>
                              {selectedUser.planStatus || 'Inactive'}
                            </div>
                          </div>
                          {selectedUser.website && (
                            <div className="bg-slate-950/40 border border-slate-800 px-3 py-1 rounded-lg text-right hidden sm:block">
                              <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Website Bound</div>
                              <div className="text-[10px] font-semibold text-blue-400">
                                {selectedUser.website}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Messages Log area */}
                      <div className="flex-grow overflow-y-auto p-4 space-y-3.5 bg-slate-950/30">
                        {loadingMessages && messages.length === 0 ? (
                          <div className="py-20 text-center text-slate-500 text-xs">
                            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                            Retrieving messages...
                          </div>
                        ) : messages.length === 0 ? (
                          <div className="py-20 text-center text-slate-500 text-xs px-6 flex flex-col items-center justify-center space-y-2">
                            <FaCommentDots className="text-slate-600 text-3xl mb-2" />
                            <span>No conversation history yet with {selectedUser.name}.</span>
                            <span className="text-[10px] text-slate-600">Send a message to initiate support contact.</span>
                          </div>
                        ) : (
                          messages.map((m) => {
                            const isAdmin = m.sender === 'admin';
                            return (
                              <div 
                                key={m._id} 
                                className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                              >
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-md leading-relaxed ${
                                  isAdmin 
                                    ? 'bg-blue-600 border border-blue-500 text-white rounded-tr-none' 
                                    : 'bg-slate-800 border border-slate-700/80 text-slate-100 rounded-tl-none'
                                }`}>
                                  {m.text}
                                </div>
                                <span className="text-[9px] text-slate-500 mt-1 px-1">
                                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            );
                          })
                        )}
                        <div ref={chatEndRef} />
                      </div>

                      {/* Message input form */}
                      <form onSubmit={handleSendReply} className="p-4 bg-slate-900/30 border-t border-slate-800/80 flex items-center gap-3">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Reply to ${selectedUser.name}...`}
                          disabled={sendingMessage}
                          className="flex-grow px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                        <button
                          type="submit"
                          disabled={!replyText.trim() || sendingMessage}
                          className="p-3 bg-blue-600 hover:bg-blue-500 border border-blue-500/20 text-white rounded-xl shadow-lg shadow-blue-500/10 transition-all shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {sendingMessage ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FaPaperPlane className="text-xs" />
                          )}
                        </button>
                      </form>
                    </div>

                    {/* Details Column */}
                    <div className="w-full lg:w-80 bg-slate-900/40 p-4 border-t lg:border-t-0 border-slate-800/80 overflow-y-auto flex flex-col gap-5">
                      {/* Website Description */}
                      <div className="space-y-2">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Website Requirements</h4>
                        <div className="p-3 bg-slate-950/50 border border-slate-800/60 rounded-xl text-xs leading-relaxed text-slate-300">
                          {selectedUser.websiteAbout ? (
                            <p>{selectedUser.websiteAbout}</p>
                          ) : (
                            <p className="text-slate-500 italic">No description provided yet by the user.</p>
                          )}
                        </div>
                      </div>

                      {/* Domain Assignment Control */}
                      <div className="space-y-2 border-t border-slate-800/80 pt-4">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center">
                          <FaGlobe className="mr-1.5 text-blue-400" /> Domain Bind Control
                        </h4>
                        <p className="text-[10px] text-slate-500 leading-normal">
                          Set the website URL to start logging user stats. Seeding triggers automatically on first bind.
                        </p>
                        <form onSubmit={handleUpdateDomain} className="space-y-2">
                          <input
                            type="text"
                            placeholder="e.g. trackingdomain.com"
                            value={newDomain}
                            onChange={(e) => setNewDomain(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                          <button
                            type="submit"
                            disabled={updatingDomain}
                            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg transition-all shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-50"
                          >
                            {updatingDomain ? 'Updating...' : 'Save Website Domain'}
                          </button>
                        </form>
                        {domainError && <div className="text-[10px] text-red-400 mt-1">{domainError}</div>}
                        {domainSuccess && <div className="text-[10px] text-emerald-400 mt-1">{domainSuccess}</div>}
                      </div>

                      {/* Tracking script integrations */}
                      {selectedUser.website && (
                        <div className="space-y-4 border-t border-slate-800/80 pt-4">
                          {/* Live view tracking script */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-400">Tracking Code</h4>
                              <button
                                onClick={() => {
                                  const snippet = `<!-- saasforlife.co.in Live Tracking Snippet -->
<script>
  (function() {
    var loadTime = (performance.timing.loadEventEnd - performance.timing.navigationStart) / 1000;
    fetch('https://www.saasforlife.co.in/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: '${selectedUser.website}',
        path: window.location.pathname,
        loadTime: loadTime > 0 ? loadTime : 0.5,
        converted: false
      })
    }).catch(function(err) { console.error(err); });
  })();
</script>`;
                                  copyToClipboard(snippet, 'script');
                                }}
                                className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer flex items-center gap-1"
                              >
                                {copiedScript ? <><FaCheck className="text-emerald-400" /> Copied</> : <><FaCopy /> Copy</>}
                              </button>
                            </div>
                            <pre className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-lg text-[9px] text-emerald-400 font-mono overflow-x-auto select-all leading-normal max-h-32">
{`<!-- saasforlife.co.in Live Tracking Snippet -->
<script>
  (function() {
    var loadTime = (performance.timing.loadEventEnd - performance.timing.navigationStart) / 1000;
    fetch('https://www.saasforlife.co.in/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: '${selectedUser.website}',
        path: window.location.pathname,
        loadTime: loadTime > 0 ? loadTime : 0.5,
        converted: false
      })
    }).catch(function(err) { console.error(err); });
  })();
</script>`}
                            </pre>
                          </div>

                          {/* Leads Form script */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-400">Leads CORS Integration</h4>
                              <button
                                onClick={() => {
                                  const snippet = `fetch('https://www.saasforlife.co.in/api/support/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    domain: '${selectedUser.website}',
    name: nameValue,
    email: emailValue,
    phone: phoneValue, // Optional
    company: companyValue, // Optional
    message: messageValue
  })
}).then(function(res) { return res.json(); })
  .then(function(data) { console.log('Lead saved:', data); })
  .catch(function(err) { console.error('Error saving lead:', err); });`;
                                  copyToClipboard(snippet, 'leads');
                                }}
                                className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer flex items-center gap-1"
                              >
                                {copiedLeads ? <><FaCheck className="text-emerald-400" /> Copied</> : <><FaCopy /> Copy</>}
                              </button>
                            </div>
                            <pre className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-lg text-[9px] text-blue-400 font-mono overflow-x-auto select-all leading-normal max-h-32">
{`fetch('https://www.saasforlife.co.in/api/support/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    domain: '${selectedUser.website}',
    name: nameValue,
    email: emailValue,
    phone: phoneValue,
    company: companyValue,
    message: messageValue
  })
})`}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-slate-950/10">
                    <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-blue-500 animate-pulse">
                      <FaCommentDots className="text-2xl" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider">Customer Support Panel</h3>
                    <p className="text-xs text-slate-400 mt-2 max-w-sm">
                      Select a user account from the left database list to check domains, view history, and reply to support issues.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Leads Database Tab */
          <div className="flex flex-col gap-6 w-full flex-grow">
            {/* Leads Statistics Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#1E293B]/40 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xl shrink-0">
                  <FaDatabase />
                </div>
                <div>
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Total Leads Captured</span>
                  <span className="text-3xl font-extrabold text-white mt-1 block">{leads.length}</span>
                </div>
              </div>

              <div className="bg-[#1E293B]/40 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center text-xl shrink-0">
                  <FaShieldAlt />
                </div>
                <div>
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">System Direct Leads</span>
                  <span className="text-3xl font-extrabold text-white mt-1 block">
                    {leads.filter(l => !l.user).length}
                  </span>
                </div>
              </div>

              <div className="bg-[#1E293B]/40 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shrink-0">
                  <FaGlobe />
                </div>
                <div>
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Client Site Leads</span>
                  <span className="text-3xl font-extrabold text-white mt-1 block">
                    {leads.filter(l => l.user).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Leads Table Card */}
            <div className="bg-[#1E293B]/40 border border-slate-800/80 rounded-2xl shadow-xl flex flex-col overflow-hidden">
              <div className="p-5 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-extrabold text-base text-white tracking-tight flex items-center gap-2">
                    <FaTicketAlt className="text-blue-500" /> Leads Database
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Review and search for system-wide contact entries or leads submitted from custom user tracking sites.
                  </p>
                </div>

                {/* Leads Search */}
                <div className="relative w-full sm:w-80">
                  <FaSearch className="absolute left-3.5 top-3 text-slate-500 text-sm" />
                  <input
                    type="text"
                    placeholder="Search by name, email, company, domain..."
                    value={leadsSearch}
                    onChange={(e) => setLeadsSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Table rendering */}
              <div className="overflow-x-auto">
                {loadingLeads ? (
                  <div className="py-24 text-center text-slate-500 text-sm">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    Loading leads records...
                  </div>
                ) : filteredLeads.length === 0 ? (
                  <div className="py-24 text-center text-slate-500 text-sm">
                    No leads found matching your search.
                  </div>
                ) : (
                  <table className="w-full border-collapse text-left text-xs text-slate-300">
                    <thead>
                      <tr className="bg-slate-900/60 border-b border-slate-800/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4 pl-6">Date</th>
                        <th className="p-4">Contact Info</th>
                        <th className="p-4">Company & Plan</th>
                        <th className="p-4">Source Website</th>
                        <th className="p-4">Account Relationship</th>
                        <th className="p-4 pr-6">Inquiry / Message</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredLeads.map((lead) => (
                        <tr key={lead._id} className="hover:bg-slate-800/20 transition-all">
                          {/* Date */}
                          <td className="p-4 pl-6 whitespace-nowrap">
                            <span className="text-slate-400 flex items-center font-medium">
                              <FaClock className="mr-1 text-[10px] text-slate-500" />
                              {new Date(lead.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          {/* Contact Info */}
                          <td className="p-4 max-w-xs truncate">
                            <div className="font-bold text-white text-xs">{lead.name}</div>
                            <div className="text-[10px] text-slate-400 flex items-center mt-1">
                              <FaEnvelope className="mr-1 text-[10px] text-slate-500 shrink-0" />
                              {lead.email}
                            </div>
                            {lead.phone && (
                              <div className="text-[10px] text-slate-400 flex items-center mt-0.5">
                                <FaPhone className="mr-1 text-[10px] text-slate-500 shrink-0" />
                                {lead.phone}
                              </div>
                            )}
                          </td>
                          {/* Company & Plan */}
                          <td className="p-4 whitespace-nowrap">
                            {lead.company ? (
                              <div className="flex items-center text-slate-300 font-medium">
                                <FaBriefcase className="mr-1 text-slate-500 text-[10px]" />
                                {lead.company}
                              </div>
                            ) : (
                              <div className="text-slate-500 italic font-normal">None specified</div>
                            )}
                            <span className="inline-block bg-blue-950 border border-blue-500/20 text-blue-400 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase mt-1">
                              {lead.plan}
                            </span>
                          </td>
                          {/* Source Website */}
                          <td className="p-4 whitespace-nowrap">
                            <span className="text-blue-400 font-bold flex items-center">
                              <FaGlobe className="mr-1 text-blue-500" />
                              {lead.domain}
                            </span>
                          </td>
                          {/* Account Relationship */}
                          <td className="p-4 whitespace-nowrap">
                            {lead.user ? (
                              <div>
                                <span className="font-bold text-emerald-400 block text-xs">{lead.user.name}</span>
                                <span className="text-[10px] text-slate-400 block">{lead.user.email}</span>
                              </div>
                            ) : (
                              <span className="bg-slate-900 text-slate-400 font-bold border border-slate-800 px-2 py-0.5 rounded-full text-[9px] uppercase">
                                System Direct
                              </span>
                            )}
                          </td>
                          {/* Inquiry / Message */}
                          <td className="p-4 pr-6 max-w-sm">
                            <div className="bg-slate-950/40 border border-slate-800/80 p-2.5 rounded-xl text-slate-300 leading-normal overflow-y-auto max-h-20 whitespace-pre-wrap select-text">
                              {lead.message}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

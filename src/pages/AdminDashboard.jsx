import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUser, FaEnvelope, FaGlobe, FaSearch, FaPaperPlane, 
  FaSync, FaSignOutAlt, FaCommentDots, FaArrowLeft, 
  FaShieldAlt, FaCircle, FaUsers, FaChartBar, FaTicketAlt
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

  // Statistics calculation
  const totalUsers = users.length;
  const activeSubs = users.filter(u => u.planStatus === 'Active').length;
  const starterCount = users.filter(u => u.plan === 'Starter').length;
  const proCount = users.filter(u => u.plan === 'Pro').length;
  const enterpriseCount = users.filter(u => u.plan === 'Enterprise').length;
  const totalMessageCount = users.reduce((sum, u) => sum + (u.messageCount || 0), 0);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#1E293B]/80 border-b border-slate-800 px-6 py-4 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FaShieldAlt className="text-white text-lg" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight">saasforlife Control Center</h1>
            <p className="text-xs text-blue-400 font-medium flex items-center">
              <FaCircle className="text-emerald-500 text-[8px] mr-1.5 animate-pulse" />
              Secure Admin Console ({user?.email})
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={fetchUsers} 
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-all text-slate-400 hover:text-white cursor-pointer"
            title="Refresh database"
          >
            <FaSync className={loadingUsers ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={handleLogout} 
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/40 border border-red-500/20 text-red-400 hover:text-red-300 transition-all text-sm font-semibold cursor-pointer"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex flex-col md:flex-row max-w-[1600px] w-full mx-auto p-6 gap-6">
        
        {/* Left column: Metrics & User Database */}
        <div className="w-full md:w-5/12 lg:w-4/12 flex flex-col gap-6">
          
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

        {/* Right column: Interactive Support Chat */}
        <div className="w-full md:w-7/12 lg:w-8/12 flex flex-col">
          <div className="bg-[#1E293B]/40 border border-slate-800/80 rounded-2xl shadow-xl flex-grow flex flex-col overflow-hidden min-h-[500px] max-h-[80vh] relative">
            {selectedUser ? (
              <>
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
                  
                  {/* Account Summary Panel */}
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
              </>
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

      </main>
    </div>
  );
}

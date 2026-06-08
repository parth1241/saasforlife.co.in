import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaArrowRight, FaExclamationCircle } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, loginWithGoogle, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to correct dashboard immediately
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1008719970978-gp0fgnj4g68hrcob9512r7sl31sg99re.apps.googleusercontent.com',
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { 
            theme: 'outline', 
            size: 'large', 
            width: '100%', 
            text: 'continue_with',
            shape: 'pill'
          }
        );
      }
    };

    // Load instantly if library script already fetched
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          initializeGoogleSignIn();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    setError('');
    setLoading(true);
    const result = await loginWithGoogle(response.credential);
    setLoading(false);

    if (!result.success) {
      setError(result.message || 'Google Sign-In failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] relative flex items-center justify-center p-6 text-white overflow-hidden font-sans">
      {/* Decorative Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand/Logo Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-1 font-bold text-2xl tracking-tight text-white select-none">
            <span>saasforlife.co.in</span>
            <span className="text-blue-500 text-3xl leading-none">.</span>
          </Link>
          <p className="text-sm text-slate-400 mt-2">Log in to manage your software subscriptions</p>
        </div>

        {/* Card */}
        <div className="bg-[#1E293B]/70 border border-slate-800/80 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
          <h2 className="text-xl font-bold text-white mb-6">Welcome Back</h2>
          
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start space-x-3 mb-6">
              <FaExclamationCircle className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          <div className="mb-5">
            <div id="google-signin-btn" className="w-full flex justify-center"></div>
          </div>

          <div className="relative flex py-2 items-center mb-5">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-xxs font-semibold uppercase tracking-widest">or login with email</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-slate-300 font-semibold text-xs uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <FaEnvelope />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700 bg-[#0F172A] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="login-password" className="block text-slate-300 font-semibold text-xs uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <FaLock />
                </div>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700 bg-[#0F172A] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-blue-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Logging in...' : 'Log In'}</span>
              {!loading && <FaArrowRight className="text-xs" />}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center mt-6 text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:underline font-semibold">
              Create an Account
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

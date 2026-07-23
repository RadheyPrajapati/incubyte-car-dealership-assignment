import React, { useState } from 'react';
import { Car, Lock, Mail, User, ShieldAlert, Sparkles, ArrowRight, ShieldCheck, Award, Zap } from 'lucide-react';

export default function LandingAuthView({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER'
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        await onAuthSuccess('login', {
          email: formData.email,
          password: formData.password
        });
      } else {
        await onAuthSuccess('register', formData);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Authentication failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 flex flex-col justify-between relative overflow-hidden">
      
      {/* Background Decorative Glow Elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Branding Bar */}
      <header className="py-6 px-6 sm:px-12 glass-panel border-b border-gray-800/80 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Car className="w-6 h-6 text-dark-900 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">APEX</span>
                <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                  MOTORS
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">Luxury & Performance Inventory</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Secure Enterprise Portal</span>
          </div>
        </div>
      </header>

      {/* Main Landing & Authentication Split Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full flex items-center justify-center z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          
          {/* Left Column: Hero & Dealership Features */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-extrabold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Authentication Required</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Apex Motors</span>
            </h1>

            <p className="text-base text-gray-300 leading-relaxed max-w-xl">
              Sign in or register to unlock our executive showroom catalog, review real-time stock levels, purchase luxury vehicles, and access your digital ownership garage.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-800/80">
              <div className="glass-card p-4 rounded-2xl border border-gray-800 space-y-1">
                <Award className="w-5 h-5 text-amber-400 mb-1" />
                <h4 className="text-sm font-bold text-white">Verified Inventory</h4>
                <p className="text-xs text-gray-400">Curated luxury cars with detailed specs & VIN verification.</p>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-gray-800 space-y-1">
                <Zap className="w-5 h-5 text-emerald-400 mb-1" />
                <h4 className="text-sm font-bold text-white">Instant Purchase</h4>
                <p className="text-xs text-gray-400">Seamless purchasing workflow with live stock management.</p>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-gray-800 space-y-1">
                <User className="w-5 h-5 text-indigo-400 mb-1" />
                <h4 className="text-sm font-bold text-white">Customer Garage</h4>
                <p className="text-xs text-gray-400">Track and manage all your purchased vehicles in one place.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-dark-800/90 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden glass-panel backdrop-blur-xl">
              
              {/* Tab Header */}
              <div className="flex border-b border-gray-800 bg-dark-900/60">
                <button
                  type="button"
                  id="tab-login"
                  onClick={() => { setIsLogin(true); setErrorMsg(''); }}
                  className={`flex-1 py-4 text-xs font-extrabold uppercase tracking-wider transition-all ${
                    isLogin
                      ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/10'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  id="tab-register"
                  onClick={() => { setIsLogin(false); setErrorMsg(''); }}
                  className={`flex-1 py-4 text-xs font-extrabold uppercase tracking-wider transition-all ${
                    !isLogin
                      ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/10'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Register Account
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
                
                {errorMsg && (
                  <div className="flex items-center gap-2 p-3 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {!isLogin && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        name="name"
                        id="auth-name-input"
                        required={!isLogin}
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-gray-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      id="auth-email-input"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="user@dealership.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-gray-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="password"
                      name="password"
                      id="auth-password-input"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-gray-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Role Selection *
                    </label>
                    <select
                      name="role"
                      id="auth-role-select"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-dark-900 border border-gray-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="USER">Customer / Buyer</option>
                      <option value="ADMIN">Dealership Admin</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  id="auth-submit-btn"
                  disabled={loading}
                  className="w-full py-3.5 mt-4 text-sm font-extrabold text-dark-900 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  <span>{loading ? 'Authenticating...' : isLogin ? 'Sign In to Dashboard' : 'Register New Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 border-t border-gray-800/80 text-center text-xs text-gray-500 z-10">
        <p>© 2026 Apex Motors Luxury Dealership. All Rights Reserved.</p>
      </footer>

    </div>
  );
}

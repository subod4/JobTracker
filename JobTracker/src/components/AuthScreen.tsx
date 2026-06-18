import { useState } from 'react';
import { login, signup } from '../api/auth';
import type { User } from '../types';

interface AuthScreenProps {
  onAuthSuccess: (user: User) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setName('');
    setEmail('');
    setPassword('');
    setErrors({});
    setServerError(null);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!isLogin && !name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      if (isLogin) {
        const response = await login(email, password);
        onAuthSuccess(response.user);
      } else {
        const response = await signup(name, email, password);
        onAuthSuccess(response.user);
      }
    } catch (err: any) {
      setServerError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans" id="auth-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Logo */}
        <div className="inline-flex p-3 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white shadow-md mx-auto mb-4 animate-bounce-subtle">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-none">
          Job Tracker
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Track and organize your career applications effortlessly
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-slate-100 rounded-2xl shadow-xl sm:px-10">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-100 mb-6" id="auth-tabs">
            <button
              onClick={() => isLogin || toggleMode()}
              className={`flex-1 pb-3 text-sm font-bold text-center cursor-pointer transition-all border-b-2 ${
                isLogin
                  ? 'border-slate-800 text-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
              id="login-tab-btn"
            >
              Sign In
            </button>
            <button
              onClick={() => !isLogin || toggleMode()}
              className={`flex-1 pb-3 text-sm font-bold text-center cursor-pointer transition-all border-b-2 ${
                !isLogin
                  ? 'border-slate-800 text-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
              id="signup-tab-btn"
            >
              Sign Up
            </button>
          </div>

          {serverError && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold rounded-xl flex items-center gap-2" id="auth-error-banner">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" id="auth-form">
            {/* Name (Signup Only) */}
            {!isLogin && (
              <div className="space-y-1">
                <label htmlFor="auth-name" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  id="auth-name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all font-medium text-slate-800 ${
                    errors.name ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
                  }`}
                />
                {errors.name && (
                  <p className="text-[10px] text-rose-500 font-medium mt-0.5">{errors.name}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="auth-email" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all font-medium text-slate-800 ${
                  errors.email ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
                }`}
              />
              {errors.email && (
                <p className="text-[10px] text-rose-500 font-medium mt-0.5">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="auth-password" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all font-medium text-slate-800 ${
                  errors.password ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
                }`}
              />
              {errors.password && (
                <p className="text-[10px] text-rose-500 font-medium mt-0.5">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-800 transition-all cursor-pointer disabled:opacity-50"
                id="auth-submit-btn"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connecting...
                  </span>
                ) : isLogin ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          {/* Quick Info text */}
          <div className="mt-6 text-center text-xs text-slate-400">
            {isLogin ? (
              <>
                New to Job Tracker?{' '}
                <button
                  onClick={toggleMode}
                  className="font-semibold text-slate-700 hover:text-slate-900 underline cursor-pointer"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={toggleMode}
                  className="font-semibold text-slate-700 hover:text-slate-900 underline cursor-pointer"
                >
                  Sign in instead
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

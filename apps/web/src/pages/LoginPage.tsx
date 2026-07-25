import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/api/auth/login', { email, password });
      login(res.data.accessToken, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword('Password@123');
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email: userEmail, password: 'Password@123' });
      login(res.data.accessToken, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side with image + text */}
      <div className="flex-1 bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex flex-col justify-center items-center p-8">
        <img
          src="https://static.vecteezy.com/system/resources/previews/012/696/903/non_2x/erp-isometric-background-vector.jpg"
          alt="ERP Illustration"
          className="rounded-lg shadow-lg mb-6 w-full max-w-md"
        />
        <h2 className="text-2xl font-bold mb-2">Welcome to CoreCRM </h2>
        <p className="text-sm text-indigo-100 text-center max-w-sm">
          Manage your wholesale & distribution operations seamlessly.  
          Empower your team with accounts, warehouse, and sales tools.
        </p>
      </div>

      {/* Right side with form */}
      <div className="flex-1 flex justify-center items-center bg-gray-50 p-6">
        <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded bg-indigo-600 mx-auto flex items-center justify-center font-mono font-bold text-white text-2xl mb-3 shadow-md">
              ERP
            </div>
            <h1 className="font-display font-extrabold text-2xl text-indigo-700">CoreCRM</h1>
            <p className="text-gray-500 text-xs font-mono mt-1">Wholesale & Distribution Operations Portal</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-300 rounded text-red-600 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-600 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@minierp.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 font-sans text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-600 uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 font-sans text-gray-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded text-sm transition shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Logins */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-1.5 text-xs font-mono text-gray-600 mb-3">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Test Role Quick Logins (Shared Pass: Password@123):</span>
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <button
                onClick={() => handleQuickLogin('admin@minierp.com')}
                className="p-2 border border-gray-300 rounded bg-gray-50 hover:bg-indigo-50 hover:border-indigo-500 text-left transition"
              >
                <span className="font-bold block text-gray-800">Admin</span>
                <span className="text-[10px] text-gray-500">admin@minierp.com</span>
              </button>
              <button
                onClick={() => handleQuickLogin('sales@minierp.com')}
                className="p-2 border border-gray-300 rounded bg-gray-50 hover:bg-indigo-50 hover:border-indigo-500 text-left transition"
              >
                <span className="font-bold block text-gray-800">Sales</span>
                <span className="text-[10px] text-gray-500">sales@minierp.com</span>
              </button>
              <button
                onClick={() => handleQuickLogin('warehouse@minierp.com')}
                className="p-2 border border-gray-300 rounded bg-gray-50 hover:bg-indigo-50 hover:border-indigo-500 text-left transition"
              >
                <span className="font-bold block text-gray-800">Warehouse</span>
                <span className="text-[10px] text-gray-500">warehouse@...</span>
              </button>
              <button
                onClick={() => handleQuickLogin('accounts@minierp.com')}
                className="p-2 border border-gray-300 rounded bg-gray-50 hover:bg-indigo-50 hover:border-indigo-500 text-left transition"
              >
                <span className="font-bold block text-gray-800">Accounts</span>
                <span className="text-[10px] text-gray-500">accounts@...</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

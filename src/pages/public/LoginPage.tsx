import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Shield, Lock, Mail, UserCheck, Layers, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('aravind@example.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<UserRole>('customer');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, role);
      const targetDashboard =
        role === 'admin'
          ? '/dashboard/admin'
          : role === 'provider'
          ? '/dashboard/provider'
          : '/dashboard/customer';
      navigate(targetDashboard);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoRole: UserRole) => {
    setEmail(demoEmail);
    setRole(demoRole);
  };

  return (
    <div className="min-h-screen bg-[#0B1020] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#151C2F] border border-[#232D48] rounded-3xl p-8 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#22D3EE] to-[#A3E635] flex items-center justify-center text-slate-950 font-bold mx-auto">
            <Shield className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Sign In to Companion Connect</h2>
          <p className="text-xs text-slate-400">Access your customer, companion provider, or admin dashboard</p>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="p-3 bg-[#0B1020] rounded-2xl border border-[#232D48] space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Quick 1-Click Demo Logins
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('aravind@example.com', 'customer')}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-colors ${
                role === 'customer' ? 'bg-[#22D3EE]/20 border-[#22D3EE] text-[#22D3EE]' : 'bg-[#151C2F] border-[#232D48] text-slate-300'
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('ananya@companionconnect.in', 'provider')}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-colors ${
                role === 'provider' ? 'bg-[#22D3EE]/20 border-[#22D3EE] text-[#22D3EE]' : 'bg-[#151C2F] border-[#232D48] text-slate-300'
              }`}
            >
              Companion
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@companionconnect.in', 'admin')}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-colors ${
                role === 'admin' ? 'bg-[#22D3EE]/20 border-[#22D3EE] text-[#22D3EE]' : 'bg-[#151C2F] border-[#232D48] text-slate-300'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-bold mb-1">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#22D3EE]"
            >
              <option value="customer">Customer (Booking Meetups)</option>
              <option value="provider">Companion / Provider</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-[#22D3EE]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-[#22D3EE]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#06B6D4] text-slate-950 font-bold text-sm hover:opacity-90 shadow-lg"
          >
            {isLoading ? 'Signing in...' : 'Sign In to Dashboard →'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-[#22D3EE] font-bold hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

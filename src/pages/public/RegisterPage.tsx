import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Shield, Lock, Mail, User, CheckCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [isAdultVerified, setIsAdultVerified] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdultVerified) {
      setError('You must confirm that you are at least 18 years of age.');
      return;
    }
    if (!agreedTerms) {
      setError('You must agree to the platform safety & non-sexual code of conduct.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await register(fullName, email, role, isAdultVerified);
      const targetDashboard = role === 'provider' ? '/dashboard/provider' : '/dashboard/customer';
      navigate(targetDashboard);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-[#151C2F] border border-[#232D48] rounded-3xl p-8 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#22D3EE] to-[#A3E635] flex items-center justify-center text-slate-950 font-bold mx-auto">
            <Shield className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Create Account</h2>
          <p className="text-xs text-slate-400">Join Companion Connect in India</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#0B1020] rounded-2xl border border-[#232D48]">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              role === 'customer'
                ? 'bg-[#22D3EE] text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            I want to Book Meetups
          </button>
          <button
            type="button"
            onClick={() => setRole('provider')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              role === 'provider'
                ? 'bg-[#A3E635] text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Become a Companion
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-bold mb-1">Full Legal Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="e.g. Ramesh Kumar"
                className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-[#22D3EE]"
              />
            </div>
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
                placeholder="you@example.com"
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
                placeholder="Minimum 8 characters"
                className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-[#22D3EE]"
              />
            </div>
          </div>

          {/* Adult Eligibility Check */}
          <div className="p-3 bg-[#0B1020] rounded-xl border border-[#232D48] space-y-2">
            <label className="flex items-start space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAdultVerified}
                onChange={(e) => setIsAdultVerified(e.target.checked)}
                className="mt-0.5 accent-[#22D3EE]"
              />
              <span className="text-slate-300 font-medium leading-tight">
                I certify that I am at least 18 years of age.
              </span>
            </label>

            <label className="flex items-start space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 accent-[#22D3EE]"
              />
              <span className="text-slate-300 font-medium leading-tight">
                I agree to the <Link to="/terms" className="text-[#22D3EE] underline">Terms of Service</Link> & <Link to="/safety" className="text-[#A3E635] underline">Non-Sexual Safety Policy</Link>.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#06B6D4] text-slate-950 font-bold text-sm hover:opacity-90 shadow-lg"
          >
            {isLoading ? 'Creating Account...' : 'Complete Registration →'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-[#22D3EE] font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

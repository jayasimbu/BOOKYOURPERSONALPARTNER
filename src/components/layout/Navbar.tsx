import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  Coffee,
  Search,
  UserCheck,
  Calendar,
  MessageSquare,
  LogOut,
  Bell,
  Menu,
  X,
  Layers,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, isAuthenticated, logout, switchDemoRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#0B1020]/90 backdrop-blur-md border-b border-[#232D48]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#22D3EE] to-[#A3E635] flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                Companion<span className="text-[#22D3EE]">Connect</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/30 rounded">
                Verified Social
              </span>
            </div>
          </Link>

          {/* Main Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/companions"
              className={`flex items-center space-x-1 transition-colors ${
                isActive('/companions') ? 'text-[#22D3EE]' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Browse Companions</span>
            </Link>
            <Link
              to="/how-it-works"
              className={`transition-colors ${
                isActive('/how-it-works') ? 'text-[#22D3EE]' : 'text-slate-300 hover:text-white'
              }`}
            >
              How It Works
            </Link>
            <Link
              to="/safety"
              className={`flex items-center space-x-1.5 transition-colors ${
                isActive('/safety') ? 'text-[#A3E635]' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4 text-[#A3E635]" />
              <span>Safety Code</span>
            </Link>
          </nav>

          {/* Role Quick Switcher & User Control */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Interactive Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#151C2F] border border-[#232D48] text-xs font-semibold text-slate-300 hover:border-[#22D3EE]/50 transition-colors"
                title="Quickly test customer, provider & admin roles"
              >
                <Layers className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span>Role Demo: <strong className="text-[#22D3EE] capitalize">{role}</strong></span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#151C2F] border border-[#232D48] rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-[#232D48]">
                    Switch User Role Demo
                  </div>
                  <button
                    onClick={() => {
                      switchDemoRole('customer');
                      setDemoDropdownOpen(false);
                      navigate('/dashboard/customer');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-[#1D2740] hover:text-[#22D3EE] flex items-center justify-between"
                  >
                    <span>Customer View</span>
                    {role === 'customer' && <span className="text-[#A3E635]">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchDemoRole('provider');
                      setDemoDropdownOpen(false);
                      navigate('/dashboard/provider');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-[#1D2740] hover:text-[#22D3EE] flex items-center justify-between"
                  >
                    <span>Companion View</span>
                    {role === 'provider' && <span className="text-[#A3E635]">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchDemoRole('admin');
                      setDemoDropdownOpen(false);
                      navigate('/dashboard/admin');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-[#1D2740] hover:text-[#22D3EE] flex items-center justify-between"
                  >
                    <span>Admin Panel View</span>
                    {role === 'admin' && <span className="text-[#A3E635]">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={
                    role === 'admin'
                      ? '/dashboard/admin'
                      : role === 'provider'
                      ? '/dashboard/provider'
                      : '/dashboard/customer'
                  }
                  className="px-4 py-2 rounded-xl bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] text-xs font-semibold hover:bg-[#22D3EE]/20 transition-all flex items-center space-x-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>My Dashboard</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-[#151C2F] text-slate-400 hover:text-red-400 border border-[#232D48] transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#06B6D4] text-slate-950 font-bold text-xs hover:opacity-90 shadow-md transition-all"
                >
                  Join / Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#151C2F] text-slate-300 border border-[#232D48]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B1020] border-b border-[#232D48] px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/companions"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-200 hover:text-[#22D3EE]"
          >
            Browse Companions
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-200 hover:text-[#22D3EE]"
          >
            How It Works
          </Link>
          <Link
            to="/safety"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#A3E635]"
          >
            Safety Guidelines
          </Link>
          <div className="pt-3 border-t border-[#232D48] space-y-2">
            <div className="text-xs text-slate-400 font-semibold mb-1">Quick Role Switcher:</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  switchDemoRole('customer');
                  setMobileMenuOpen(false);
                  navigate('/dashboard/customer');
                }}
                className="px-2 py-1.5 text-xs bg-[#151C2F] text-[#22D3EE] rounded border border-[#232D48]"
              >
                Customer
              </button>
              <button
                onClick={() => {
                  switchDemoRole('provider');
                  setMobileMenuOpen(false);
                  navigate('/dashboard/provider');
                }}
                className="px-2 py-1.5 text-xs bg-[#151C2F] text-[#22D3EE] rounded border border-[#232D48]"
              >
                Provider
              </button>
              <button
                onClick={() => {
                  switchDemoRole('admin');
                  setMobileMenuOpen(false);
                  navigate('/dashboard/admin');
                }}
                className="px-2 py-1.5 text-xs bg-[#151C2F] text-[#22D3EE] rounded border border-[#232D48]"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

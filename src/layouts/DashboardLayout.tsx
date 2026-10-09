import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Search,
  Calendar,
  CreditCard,
  MessageSquare,
  Star,
  Heart,
  Settings,
  Shield,
  FileText,
  AlertTriangle,
  Users,
  CheckSquare,
  LogOut,
  ChevronRight,
  Layers
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, role, logout, switchDemoRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  // Sidebar Links by Role
  const customerLinks = [
    { label: 'Overview', path: '/dashboard/customer', icon: User },
    { label: 'Browse Companions', path: '/companions', icon: Search },
    { label: 'My Bookings', path: '/dashboard/customer/bookings', icon: Calendar },
    { label: 'Messages', path: '/dashboard/customer/messages', icon: MessageSquare },
    { label: 'Saved Companions', path: '/dashboard/customer/favorites', icon: Heart },
    { label: 'Account Settings', path: '/dashboard/customer/settings', icon: Settings },
    { label: 'Safety & Support', path: '/dashboard/customer/support', icon: Shield }
  ];

  const providerLinks = [
    { label: 'Overview', path: '/dashboard/provider', icon: User },
    { label: 'Profile Setup', path: '/dashboard/provider/profile', icon: Settings },
    { label: 'ID Verification', path: '/dashboard/provider/verification', icon: Shield },
    { label: 'Booking Requests', path: '/dashboard/provider/requests', icon: Calendar },
    { label: 'Earnings & Payouts', path: '/dashboard/provider/earnings', icon: CreditCard },
    { label: 'Messages', path: '/dashboard/customer/messages', icon: MessageSquare }
  ];

  const adminLinks = [
    { label: 'Overview & Analytics', path: '/dashboard/admin', icon: User },
    { label: 'Verification Queue', path: '/dashboard/admin/verification', icon: Shield },
    { label: 'User Accounts', path: '/dashboard/admin/users', icon: Users },
    { label: 'Reports & Complaints', path: '/dashboard/admin/reports', icon: AlertTriangle },
    { label: 'Admin Audit Logs', path: '/dashboard/admin/audit-logs', icon: FileText }
  ];

  const links = role === 'admin' ? adminLinks : role === 'provider' ? providerLinks : customerLinks;

  return (
    <div className="min-h-screen bg-[#0B1020] flex flex-col md:flex-row text-slate-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#151C2F] border-r border-[#232D48] flex-shrink-0 flex flex-col">
        {/* User Identity Header */}
        <div className="p-6 border-b border-[#232D48] space-y-3">
          <div className="flex items-center space-x-3">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt="User"
              className="w-10 h-10 rounded-xl object-cover border border-[#232D48]"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white truncate">{user?.full_name}</h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#22D3EE]/10 text-[#22D3EE] inline-block mt-0.5">
                {role} account
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto text-xs">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors ${
                  active
                    ? 'bg-[#22D3EE] text-slate-950 font-bold shadow-md'
                    : 'text-slate-300 hover:bg-[#1D2740] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Role Demo Switcher Footer */}
        <div className="p-4 border-t border-[#232D48] space-y-2 bg-[#0B1020]/50">
          <div className="text-[10px] uppercase font-bold text-slate-400">Testing Role Switcher</div>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => {
                switchDemoRole('customer');
                navigate('/dashboard/customer');
              }}
              className="px-2 py-1 text-[10px] bg-[#151C2F] text-[#22D3EE] rounded border border-[#232D48]"
            >
              Customer
            </button>
            <button
              onClick={() => {
                switchDemoRole('provider');
                navigate('/dashboard/provider');
              }}
              className="px-2 py-1 text-[10px] bg-[#151C2F] text-[#22D3EE] rounded border border-[#232D48]"
            >
              Companion
            </button>
            <button
              onClick={() => {
                switchDemoRole('admin');
                navigate('/dashboard/admin');
              }}
              className="px-2 py-1 text-[10px] bg-[#151C2F] text-[#22D3EE] rounded border border-[#232D48]"
            >
              Admin
            </button>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full mt-2 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-xl flex items-center justify-center space-x-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

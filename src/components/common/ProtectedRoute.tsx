import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#22D3EE] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-400">Verifying security session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.status === 'suspended') {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#151C2F] border border-red-500/30 rounded-2xl p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto text-xl font-bold">
            ⚠️
          </div>
          <h2 className="text-lg font-bold text-white">Account Suspended</h2>
          <p className="text-xs text-slate-300">
            Your account has been suspended by platform operations for a violation of platform terms or safety policy.
          </p>
          <div className="pt-2">
            <button
              onClick={() => window.location.href = 'mailto:safety@companionconnect.in'}
              className="px-4 py-2 bg-[#232D48] text-slate-200 text-xs font-semibold rounded-xl hover:bg-[#1D2740]"
            >
              Contact Appeals Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect user to their appropriate dashboard if they try to cross role boundaries
    const targetDashboard =
      user.role === 'admin'
        ? '/dashboard/admin'
        : user.role === 'provider'
        ? '/dashboard/provider'
        : '/dashboard/customer';
    return <Navigate to={targetDashboard} replace />;
  }

  return <>{children}</>;
};

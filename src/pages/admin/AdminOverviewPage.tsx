import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ApiService } from '../../services/api';
import { Users, Shield, Calendar, CreditCard, AlertTriangle, FileText, Activity } from 'lucide-react';

export const AdminOverviewPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    setMetrics(ApiService.getAdminMetrics());
  }, []);

  if (!metrics) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#151C2F] via-[#1D2740] to-[#151C2F] border border-[#232D48] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#22D3EE] uppercase tracking-wider">Platform Administration Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Platform Operations & Moderation
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time analytics for South India (Bangalore, Chennai, Coimbatore, Salem)
          </p>
        </div>

        <Link
          to="/dashboard/admin/verification"
          className="px-5 py-2.5 rounded-xl bg-[#22D3EE] text-slate-950 font-bold text-xs hover:bg-[#06B6D4] transition-colors"
        >
          Review ID Queue ({metrics.pendingVerifications})
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#151C2F] border border-[#232D48]">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Users</span>
          <div className="text-2xl font-extrabold text-white mt-1">{metrics.totalUsers}</div>
          <span className="text-[10px] text-slate-400 block mt-1">Customers & Companions</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#151C2F] border border-[#232D48]">
          <span className="text-xs font-bold text-slate-400 uppercase">Approved Providers</span>
          <div className="text-2xl font-extrabold text-[#A3E635] mt-1">{metrics.approvedProviders}</div>
          <span className="text-[10px] text-[#A3E635] block mt-1">✓ ID Verified</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#151C2F] border border-[#232D48]">
          <span className="text-xs font-bold text-slate-400 uppercase">Pending ID Verification</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{metrics.pendingVerifications}</div>
          <span className="text-[10px] text-amber-400 block mt-1">Needs Admin Review</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#151C2F] border border-[#232D48]">
          <span className="text-xs font-bold text-slate-400 uppercase">Platform GMV (INR ₹)</span>
          <div className="text-2xl font-extrabold text-[#22D3EE] mt-1">₹{metrics.totalRevenueINR}</div>
          <span className="text-[10px] text-[#22D3EE] block mt-1">15% Commission Rate</span>
        </div>
      </div>

      {/* Admin Quick Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/dashboard/admin/verification"
          className="p-6 rounded-2xl bg-[#151C2F] border border-[#232D48] glass-card-hover space-y-3"
        >
          <Shield className="w-6 h-6 text-[#22D3EE]" />
          <h3 className="text-base font-bold text-white">Provider Verification Queue</h3>
          <p className="text-xs text-slate-400">
            Review uploaded government IDs (Aadhaar, Passport, PAN) and approve companion onboarding.
          </p>
        </Link>

        <Link
          to="/dashboard/admin/users"
          className="p-6 rounded-2xl bg-[#151C2F] border border-[#232D48] glass-card-hover space-y-3"
        >
          <Users className="w-6 h-6 text-[#A3E635]" />
          <h3 className="text-base font-bold text-white">User Accounts & Suspension</h3>
          <p className="text-xs text-slate-400">
            Manage user statuses, suspend rule violators, and view user roles.
          </p>
        </Link>

        <Link
          to="/dashboard/admin/reports"
          className="p-6 rounded-2xl bg-[#151C2F] border border-[#232D48] glass-card-hover space-y-3"
        >
          <AlertTriangle className="w-6 h-6 text-amber-400" />
          <h3 className="text-base font-bold text-white">Safety Reports & Complaints</h3>
          <p className="text-xs text-slate-400">
            Investigate confidential safety reports and enforce zero-tolerance non-sexual policies.
          </p>
        </Link>
      </div>
    </div>
  );
};

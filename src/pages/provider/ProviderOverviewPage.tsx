import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { ProviderProfile, Booking } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { Shield, IndianRupee, Calendar, Clock, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';

export const ProviderOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (user) {
      const p = ApiService.getProviderById(user.user_id);
      if (p) setProvider(p);
      setBookings(ApiService.getUserBookings(user.user_id, 'provider'));
    }
  }, [user]);

  const pendingRequests = bookings.filter((b) => b.status === 'PENDING');
  const upcomingMeetups = bookings.filter((b) => ['ACCEPTED', 'CONFIRMED'].includes(b.status));

  const totalEarningsGross = bookings
    .filter((b) => ['CONFIRMED', 'COMPLETED'].includes(b.status))
    .reduce((sum, b) => sum + b.total_amount_inr, 0);

  const netPayout = Math.round(totalEarningsGross * 0.85); // 85% net companion payout

  return (
    <div className="space-y-8">
      {/* Verification Status Alert Header */}
      {provider && provider.verification_status !== 'approved' && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 text-xs text-amber-300">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <strong className="block font-bold">Verification Pending / Action Required</strong>
              <span>
                Submit your government ID (Aadhaar, Passport, or PAN) for confidential review to make your profile public.
              </span>
            </div>
          </div>
          <Link
            to="/dashboard/provider/verification"
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 flex-shrink-0"
          >
            Submit Documents →
          </Link>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#151C2F] via-[#1D2740] to-[#151C2F] border border-[#232D48] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#A3E635] uppercase tracking-wider">Companion Provider Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Welcome, {provider?.display_name || user?.full_name}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            City: <strong className="text-[#22D3EE]">{provider?.city || 'Bangalore'}</strong> • Rate: <strong className="text-white">₹{provider?.hourly_rate_inr || 600}/hr</strong>
          </p>
        </div>

        <Link
          to="/dashboard/provider/requests"
          className="px-5 py-2.5 rounded-xl bg-[#A3E635] text-slate-950 font-bold text-xs hover:bg-[#84CC16] transition-colors"
        >
          View Requests ({pendingRequests.length})
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#151C2F] border border-[#232D48]">
          <span className="text-xs font-bold text-slate-400 uppercase">Gross Revenue</span>
          <div className="text-2xl font-extrabold text-[#22D3EE] mt-1">₹{totalEarningsGross}</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#151C2F] border border-[#232D48]">
          <span className="text-xs font-bold text-slate-400 uppercase">Net Companion Payout</span>
          <div className="text-2xl font-extrabold text-[#A3E635] mt-1">₹{netPayout}</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#151C2F] border border-[#232D48]">
          <span className="text-xs font-bold text-slate-400 uppercase">Pending Requests</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{pendingRequests.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#151C2F] border border-[#232D48]">
          <span className="text-xs font-bold text-slate-400 uppercase">Rating Score</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            ⭐ {provider?.rating.toFixed(2) || '5.00'}
          </div>
        </div>
      </div>

      {/* Pending Requests Highlight */}
      <div className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#A3E635]" />
            <span>Pending Booking Requests</span>
          </h2>
          <Link to="/dashboard/provider/requests" className="text-xs text-[#22D3EE] hover:underline">
            Manage All
          </Link>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-6 text-center bg-[#0B1020] border border-[#232D48] rounded-xl text-slate-400 text-xs">
            No pending booking requests at the moment.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl bg-[#0B1020] border border-[#232D48] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="text-sm font-bold text-white">{b.customer_name}</h3>
                  <p className="text-xs font-semibold text-[#22D3EE]">{b.activity_name}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {b.date} • {b.start_time} - {b.end_time} • {b.location_name}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white">Earn ₹{Math.round(b.total_amount_inr * 0.85)}</span>
                  <Link
                    to="/dashboard/provider/requests"
                    className="px-3 py-1.5 rounded-lg bg-[#A3E635] text-slate-950 font-bold text-xs"
                  >
                    Accept / Decline
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

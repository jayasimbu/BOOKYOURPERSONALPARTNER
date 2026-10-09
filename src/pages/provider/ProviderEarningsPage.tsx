import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { Booking } from '../../types';
import { IndianRupee, ArrowDownLeft, CheckCircle2, Shield } from 'lucide-react';

export const ProviderEarningsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (user) {
      setBookings(ApiService.getUserBookings(user.user_id, 'provider'));
    }
  }, [user]);

  const paidBookings = bookings.filter((b) => ['CONFIRMED', 'COMPLETED'].includes(b.status));

  const grossTotal = paidBookings.reduce((sum, b) => sum + b.total_amount_inr, 0);
  const platformFees = paidBookings.reduce((sum, b) => sum + b.platform_fee_inr, 0);
  const netEarnings = grossTotal - platformFees;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Earnings & Payout Breakdown</h1>
        <p className="text-xs text-[#94A3B8]">Transparent 85% net payout calculations for completed meetups</p>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-[#151C2F] border border-[#232D48]">
          <span className="text-xs font-bold text-slate-400 uppercase">Gross Booking Volume</span>
          <div className="text-3xl font-extrabold text-white mt-1">₹{grossTotal}</div>
        </div>

        <div className="p-6 rounded-2xl bg-[#151C2F] border border-[#232D48]">
          <span className="text-xs font-bold text-slate-400 uppercase">Platform Fee (15%)</span>
          <div className="text-3xl font-extrabold text-slate-400 mt-1">₹{platformFees}</div>
        </div>

        <div className="p-6 rounded-2xl bg-[#151C2F] border border-[#232D48]">
          <span className="text-xs font-bold text-slate-400 uppercase">Net Payout to Bank</span>
          <div className="text-3xl font-extrabold text-[#A3E635] mt-1">₹{netEarnings}</div>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white">Completed Meetup Payout Records</h2>

        {paidBookings.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No completed paid meetups recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {paidBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl bg-[#0B1020] border border-[#232D48] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">{b.customer_name}</span>
                    <span className="text-slate-400">• {b.activity_name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Meetup Date: {b.date} • Order Code: {b.booking_code}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-[#A3E635] text-sm block">
                    +₹{Math.round(b.total_amount_inr * 0.85)}
                  </span>
                  <span className="text-[10px] text-slate-400">Fee deducted: ₹{b.platform_fee_inr}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

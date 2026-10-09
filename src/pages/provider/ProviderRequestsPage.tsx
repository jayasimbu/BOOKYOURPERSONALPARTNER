import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { Booking } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { Calendar, Clock, MapPin, Check, X, MessageSquare } from 'lucide-react';

export const ProviderRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (user) {
      setBookings(ApiService.getUserBookings(user.user_id, 'provider'));
    }
  }, [user]);

  const handleAction = (bookingId: string, action: 'ACCEPTED' | 'DECLINED') => {
    const updated = ApiService.updateBookingStatus(
      bookingId,
      action,
      action === 'ACCEPTED' ? 'Confirmed meetup location in public cafe.' : 'Declined due to schedule conflict.'
    );
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Booking Requests & Schedule</h1>
        <p className="text-xs text-[#94A3B8]">Review incoming social meetup requests from customers</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-12 text-center text-slate-400 text-xs">
          No booking requests received yet.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-5 space-y-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <h3 className="text-base font-bold text-white">{b.customer_name}</h3>
                  <StatusBadge status={b.status} />
                </div>

                <p className="text-xs font-semibold text-[#22D3EE]">{b.activity_name}</p>

                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{b.date} ({b.start_time} - {b.end_time})</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{b.location_name}, {b.location_address}</span>
                  </span>
                </div>

                {b.customer_notes && (
                  <p className="text-xs text-slate-300 italic bg-[#0B1020] p-2.5 rounded-xl border border-[#232D48]">
                    "{b.customer_notes}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col items-end space-y-2">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Companion Net Payout</span>
                  <span className="text-lg font-extrabold text-[#A3E635]">₹{Math.round(b.total_amount_inr * 0.85)}</span>
                </div>

                {b.status === 'PENDING' && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAction(b.id, 'DECLINED')}
                      className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/20"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAction(b.id, 'ACCEPTED')}
                      className="px-4 py-1.5 rounded-xl bg-[#A3E635] text-slate-950 font-extrabold text-xs hover:bg-[#84CC16]"
                    >
                      Accept Request
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

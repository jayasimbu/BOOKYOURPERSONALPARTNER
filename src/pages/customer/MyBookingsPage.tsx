import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { Booking, BookingStatus } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { Calendar, Clock, MapPin, CreditCard, MessageSquare, Star } from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<string>('ALL');

  useEffect(() => {
    if (user) {
      setBookings(ApiService.getUserBookings(user.user_id, 'customer'));
    }
  }, [user]);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PENDING') return b.status === 'PENDING';
    if (activeTab === 'ACCEPTED') return b.status === 'ACCEPTED' || b.status === 'PAYMENT_PENDING';
    if (activeTab === 'CONFIRMED') return b.status === 'CONFIRMED';
    if (activeTab === 'COMPLETED') return b.status === 'COMPLETED';
    if (activeTab === 'CANCELLED') return ['DECLINED', 'CANCELLED', 'EXPIRED'].includes(b.status);
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Meetup Bookings</h1>
          <p className="text-xs text-slate-400">Track and manage your social companionship requests</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-[#151C2F] rounded-2xl border border-[#232D48]">
        {['ALL', 'PENDING', 'ACCEPTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === tab
                ? 'bg-[#22D3EE] text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <Calendar className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-xs">No bookings found under "{activeTab}" filter tab.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-card-hover"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={b.provider_avatar}
                  alt={b.provider_name}
                  className="w-14 h-14 rounded-2xl object-cover border border-[#232D48]"
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-base font-bold text-white">{b.provider_name}</h3>
                    <StatusBadge status={b.status} />
                  </div>

                  <p className="text-xs font-semibold text-[#22D3EE]">{b.activity_name}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.date} • {b.start_time} - {b.end_time}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.location_name}</span>
                    </span>
                    <span className="font-bold text-white">₹{b.total_amount_inr}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-[#232D48]">
                {b.status === 'ACCEPTED' && (
                  <Link
                    to={`/dashboard/customer/checkout/${b.id}`}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#06B6D4] text-slate-950 font-bold text-xs hover:opacity-90 shadow-md"
                  >
                    Pay & Confirm ₹{b.total_amount_inr}
                  </Link>
                )}

                {b.status === 'CONFIRMED' && (
                  <Link
                    to="/dashboard/customer/messages"
                    className="px-3.5 py-2 rounded-xl bg-[#232D48] text-[#22D3EE] font-bold text-xs hover:bg-[#1D2740] flex items-center space-x-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </Link>
                )}

                <Link
                  to={`/dashboard/customer/bookings/${b.id}`}
                  className="px-3.5 py-2 rounded-xl bg-[#0B1020] text-slate-200 border border-[#232D48] text-xs font-semibold hover:border-slate-500"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

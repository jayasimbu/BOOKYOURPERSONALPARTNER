import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { Booking, ProviderProfile } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { Calendar, Search, MessageSquare, Heart, Clock, MapPin, ArrowRight, Shield } from 'lucide-react';

export const CustomerOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<ProviderProfile[]>([]);

  useEffect(() => {
    if (user) {
      const userBookings = ApiService.getUserBookings(user.user_id, 'customer');
      setBookings(userBookings);

      const favIds = ApiService.getFavorites(user.user_id);
      const favList = favIds
        .map((id) => ApiService.getProviderById(id))
        .filter(Boolean) as ProviderProfile[];
      setFavorites(favList);
    }
  }, [user]);

  const upcomingBookings = bookings.filter((b) =>
    ['PENDING', 'ACCEPTED', 'PAYMENT_PENDING', 'CONFIRMED'].includes(b.status)
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#151C2F] via-[#1D2740] to-[#151C2F] border border-[#232D48] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#22D3EE] uppercase tracking-wider">Customer Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Welcome back, {user?.full_name || 'Aravind'}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Discover verified companions for coffee meetups, tours, and dining in South India.
          </p>
        </div>
        <Link
          to="/companions"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#06B6D4] text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity flex items-center space-x-2"
        >
          <Search className="w-4 h-4 stroke-[2.5]" />
          <span>Browse Companions</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#151C2F] border border-[#232D48] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Active Bookings</span>
            <div className="text-2xl font-extrabold text-[#22D3EE] mt-1">{upcomingBookings.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/10 text-[#22D3EE] flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#151C2F] border border-[#232D48] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Total Meetups</span>
            <div className="text-2xl font-extrabold text-[#A3E635] mt-1">{bookings.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#A3E635]/10 text-[#A3E635] flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#151C2F] border border-[#232D48] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Saved Companions</span>
            <div className="text-2xl font-extrabold text-rose-400 mt-1">{favorites.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Upcoming Meetups List */}
      <div className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#22D3EE]" />
            <span>Upcoming Meetups</span>
          </h2>
          <Link to="/dashboard/customer/bookings" className="text-xs text-[#22D3EE] hover:underline">
            View All ({bookings.length})
          </Link>
        </div>

        {upcomingBookings.length === 0 ? (
          <div className="p-8 text-center bg-[#0B1020] border border-[#232D48] rounded-xl text-slate-400 space-y-2">
            <p className="text-xs">No active or upcoming meetups scheduled.</p>
            <Link to="/companions" className="text-xs text-[#22D3EE] font-bold hover:underline inline-block">
              Browse available companions →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl bg-[#0B1020] border border-[#232D48] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={b.provider_avatar}
                    alt={b.provider_name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#232D48]"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-white">{b.provider_name}</h3>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="text-xs text-[#22D3EE] font-semibold mt-0.5">{b.activity_name}</p>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{b.date} ({b.start_time} - {b.end_time})</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{b.location_name}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  {b.status === 'ACCEPTED' && (
                    <Link
                      to={`/dashboard/customer/checkout/${b.id}`}
                      className="px-3 py-1.5 rounded-lg bg-[#22D3EE] text-slate-950 text-xs font-bold hover:bg-[#06B6D4]"
                    >
                      Pay ₹{b.total_amount_inr}
                    </Link>
                  )}
                  <Link
                    to={`/dashboard/customer/bookings/${b.id}`}
                    className="px-3 py-1.5 rounded-lg bg-[#232D48] text-slate-200 text-xs font-semibold hover:bg-[#1D2740]"
                  >
                    Details
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

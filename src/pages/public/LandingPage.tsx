import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiService } from '../../services/api';
import {
  Shield,
  Search,
  Coffee,
  MapPin,
  Calendar,
  Star,
  CheckCircle,
  Users,
  Award,
  ArrowRight,
  Heart,
  Lock,
  Sparkles
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('Bangalore');
  const [selectedActivity, setSelectedActivity] = useState('All');

  const featuredCompanions = ApiService.getProviders({ city: selectedCity === 'All' ? undefined : selectedCity }).slice(0, 4);
  const activities = ApiService.getActivities();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/companions?city=${encodeURIComponent(selectedCity)}&activity=${encodeURIComponent(selectedActivity)}`);
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-[#0B1020] via-[#151C2F] to-[#0B1020] border-b border-[#232D48]">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#22D3EE]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] text-xs font-semibold tracking-wide">
              <Sparkles className="w-4 h-4" />
              <span>Verified Non-Sexual Social Companionship Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Discover Verified Companions for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] to-[#A3E635]">Meaningful Social Meetups</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              Connect with friendly, background-verified companions in Bangalore, Chennai, Coimbatore, and Salem for coffee conversations, city tours, dining, and cultural exchange.
            </p>

            {/* Quick Search Form */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 p-3 sm:p-4 rounded-2xl bg-[#151C2F] border border-[#232D48] shadow-2xl flex flex-col md:flex-row items-center gap-3"
            >
              <div className="w-full md:w-1/3 flex items-center space-x-2 px-3 py-2 bg-[#0B1020] rounded-xl border border-[#232D48]">
                <MapPin className="w-4 h-4 text-[#22D3EE] flex-shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Cities in India</option>
                  <option value="Bangalore">Bangalore (Bengaluru)</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Salem">Salem</option>
                </select>
              </div>

              <div className="w-full md:w-1/3 flex items-center space-x-2 px-3 py-2 bg-[#0B1020] rounded-xl border border-[#232D48]">
                <Coffee className="w-4 h-4 text-[#A3E635] flex-shrink-0" />
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Permitted Activities</option>
                  {activities.map((act) => (
                    <option key={act.id} value={act.name}>
                      {act.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full md:w-1/3 py-3 px-6 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#06B6D4] text-slate-950 font-bold text-sm hover:opacity-90 shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <Search className="w-4 h-4 stroke-[3]" />
                <span>Search Companions</span>
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 pt-4">
              <span className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-[#A3E635]" />
                <span>100% ID Verified Profiles</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-[#A3E635]" />
                <span>Public Location Guarantee</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-[#A3E635]" />
                <span>Razorpay Secured Payouts (INR)</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Permitted Activities Showcase */}
      <section className="py-16 bg-[#0B1020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Lawful & Permitted Social Activities
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              All bookings are strictly restricted to non-sexual, public activities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-6 rounded-2xl bg-[#151C2F] border border-[#232D48] glass-card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#22D3EE]/10 border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE] mb-4">
                    <Coffee className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{act.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{act.description}</p>
                </div>
                <Link
                  to={`/companions?activity=${encodeURIComponent(act.name)}`}
                  className="text-xs font-semibold text-[#22D3EE] hover:underline inline-flex items-center space-x-1"
                >
                  <span>Find companion for this</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Verified Companions Grid */}
      <section className="py-16 bg-[#151C2F]/50 border-y border-[#232D48]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl font-bold text-white">Top Rated Companions in South India</h2>
              <p className="text-xs text-slate-400 mt-1">
                Background-verified adults available in Bangalore, Chennai, Coimbatore & Salem.
              </p>
            </div>
            <Link
              to="/companions"
              className="px-4 py-2 rounded-xl bg-[#232D48] text-[#22D3EE] text-xs font-semibold hover:bg-[#1D2740] transition-colors"
            >
              View All Companions →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCompanions.map((provider) => (
              <div
                key={provider.id}
                className="bg-[#151C2F] border border-[#232D48] rounded-2xl overflow-hidden glass-card-hover flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                  <img
                    src={provider.avatar_url}
                    alt={provider.display_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-[#0B1020]/80 backdrop-blur-md border border-[#22D3EE]/40 text-[#22D3EE] text-[10px] font-bold flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-[#22D3EE]" />
                    <span>ID Verified</span>
                  </div>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-[#0B1020]/90 text-white text-xs font-bold flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 fill-[#A3E635] text-[#A3E635]" />
                    <span>{provider.rating.toFixed(2)} ({provider.review_count})</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">{provider.display_name}</h3>
                      <span className="text-sm font-extrabold text-[#22D3EE]">
                        ₹{provider.hourly_rate_inr}/hr
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#22D3EE]" />
                      <span>{provider.city} ({provider.locality || 'City Center'})</span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-3 leading-relaxed">
                      {provider.bio}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#232D48] flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {provider.languages.map((lang) => (
                        <span key={lang} className="px-1.5 py-0.5 rounded bg-[#0B1020] text-[10px] text-slate-400">
                          {lang}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/companions/${provider.id}`}
                      className="px-3 py-1.5 rounded-lg bg-[#22D3EE] text-slate-950 font-bold text-xs hover:bg-[#06B6D4] transition-colors"
                    >
                      Book Meetup
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Code & Verification Guarantee */}
      <section className="py-16 bg-[#0B1020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#151C2F] to-[#1D2740] border border-[#232D48] relative overflow-hidden">
            <div className="max-w-2xl space-y-4 relative z-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#A3E635]/10 border border-[#A3E635]/30 text-[#A3E635] text-xs font-semibold">
                <Shield className="w-4 h-4" />
                <span>Zero Tolerance Policy</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white">
                Safety, Dignity & Transparency First
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                We maintain strict standards for adult companions and customers. All profiles undergo mandatory identity verification. All meetups take place strictly in public cafes, restaurants, tours, and public venues.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/safety"
                  className="px-5 py-2.5 rounded-xl bg-[#A3E635] text-slate-950 font-bold text-xs hover:bg-[#84CC16] transition-colors"
                >
                  Read Platform Safety Policy
                </Link>
                <Link
                  to="/how-it-works"
                  className="px-5 py-2.5 rounded-xl bg-[#0B1020] text-slate-200 font-semibold text-xs border border-[#232D48] hover:border-slate-500"
                >
                  How Booking Works
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

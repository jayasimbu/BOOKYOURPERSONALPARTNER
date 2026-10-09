import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ApiService } from '../../services/api';
import { ProviderProfile, SearchFilters } from '../../types';
import { Search, MapPin, Filter, Star, Shield, Coffee, RotateCcw, ArrowUpDown } from 'lucide-react';

export const BrowseCompanionsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<SearchFilters>({
    city: searchParams.get('city') || 'All',
    activity: searchParams.get('activity') || 'All',
    language: searchParams.get('language') || 'All',
    maxPrice: 2000,
    minRating: 0,
    date: '',
    sortBy: 'rating_desc'
  });

  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const results = ApiService.getProviders(filters);
    setProviders(results);
    setLoading(false);
  }, [filters]);

  const handleCityChange = (city: string) => {
    setFilters((prev) => ({ ...prev, city }));
    setSearchParams((params) => {
      if (city === 'All') params.delete('city');
      else params.set('city', city);
      return params;
    });
  };

  const handleResetFilters = () => {
    setFilters({
      city: 'All',
      activity: 'All',
      language: 'All',
      maxPrice: 2000,
      minRating: 0,
      date: '',
      sortBy: 'rating_desc'
    });
    setSearchParams({});
  };

  const activities = ApiService.getActivities();

  return (
    <div className="min-h-screen bg-[#0B1020] py-8 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#232D48] pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Browse Verified Companions</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Find background-verified companions in Bangalore, Chennai, Coimbatore, and Salem for lawful social meetups.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-[#151C2F] px-3 py-1.5 rounded-xl border border-[#232D48] text-xs">
            <Shield className="w-4 h-4 text-[#A3E635]" />
            <span className="text-slate-300">Strictly Non-Sexual Companion Policy</span>
          </div>
        </div>

        {/* Filter Controls & Sort Bar */}
        <div className="bg-[#151C2F] p-5 rounded-2xl border border-[#232D48] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* City Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">City</label>
              <select
                value={filters.city}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#22D3EE]"
              >
                <option value="All">All Cities</option>
                <option value="Bangalore">Bangalore (Bengaluru)</option>
                <option value="Chennai">Chennai</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Salem">Salem</option>
              </select>
            </div>

            {/* Activity Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Activity</label>
              <select
                value={filters.activity}
                onChange={(e) => setFilters({ ...filters, activity: e.target.value })}
                className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#22D3EE]"
              >
                <option value="All">All Activities</option>
                {activities.map((act) => (
                  <option key={act.id} value={act.name}>
                    {act.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Language</label>
              <select
                value={filters.language}
                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#22D3EE]"
              >
                <option value="All">All Languages</option>
                <option value="English">English</option>
                <option value="Tamil">Tamil</option>
                <option value="Hindi">Hindi</option>
                <option value="Kannada">Kannada</option>
                <option value="Malayalam">Malayalam</option>
                <option value="Telugu">Telugu</option>
              </select>
            </div>

            {/* Max Hourly Rate Slider */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase mb-1">
                <span>Max Rate</span>
                <span className="text-[#22D3EE]">₹{filters.maxPrice}/hr</span>
              </div>
              <input
                type="range"
                min="400"
                max="2000"
                step="50"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full accent-[#22D3EE] cursor-pointer"
              />
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#22D3EE]"
              >
                <option value="rating_desc">Highest Rated ⭐</option>
                <option value="price_asc">Price: Low to High ₹</option>
                <option value="price_desc">Price: High to Low ₹</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#232D48] text-xs">
            <span className="text-slate-400">
              Showing <strong className="text-white">{providers.length}</strong> verified companions
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-400 hover:text-[#22D3EE] flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Companion Grid & Skeleton Loading */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-[#151C2F] rounded-2xl animate-pulse border border-[#232D48]" />
            ))}
          </div>
        ) : providers.length === 0 ? (
          <div className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#232D48] text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">No companions found for this criteria</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Try adjusting your city, activity filter, or max hourly rate to discover available companions.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-[#22D3EE] text-slate-950 font-bold text-xs rounded-xl hover:bg-[#06B6D4]"
            >
              Reset Search Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="bg-[#151C2F] border border-[#232D48] rounded-2xl overflow-hidden glass-card-hover flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
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
                    <span>{provider.rating.toFixed(2)} ({provider.review_count} reviews)</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">{provider.display_name}</h3>
                      <span className="text-base font-extrabold text-[#22D3EE]">
                        ₹{provider.hourly_rate_inr}/hr
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 text-xs text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#22D3EE]" />
                      <span>{provider.city} ({provider.locality || 'City Center'})</span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-3 mt-3 leading-relaxed">
                      {provider.bio}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {provider.permitted_activities.slice(0, 2).map((act) => (
                        <span
                          key={act}
                          className="px-2 py-0.5 rounded-md bg-[#0B1020] border border-[#232D48] text-[10px] font-medium text-slate-300"
                        >
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#232D48] flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      Spoken: <strong className="text-slate-200">{provider.languages.join(', ')}</strong>
                    </div>
                    <Link
                      to={`/companions/${provider.id}`}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#06B6D4] text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity"
                    >
                      View & Book
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

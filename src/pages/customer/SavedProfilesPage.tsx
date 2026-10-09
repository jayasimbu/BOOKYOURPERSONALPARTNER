import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { ProviderProfile } from '../../types';
import { Heart, Star, MapPin, Shield } from 'lucide-react';

export const SavedProfilesPage: React.FC = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<ProviderProfile[]>([]);

  useEffect(() => {
    if (user) {
      const favIds = ApiService.getFavorites(user.user_id);
      const list = favIds.map((id) => ApiService.getProviderById(id)).filter(Boolean) as ProviderProfile[];
      setFavorites(list);
    }
  }, [user]);

  const handleRemoveFav = (providerId: string) => {
    if (!user) return;
    ApiService.toggleFavorite(user.user_id, providerId);
    setFavorites((prev) => prev.filter((p) => p.id !== providerId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Heart className="w-6 h-6 text-rose-400 fill-rose-400" />
          <span>Saved Companion Profiles</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Your bookmarked companions for quick meetup booking</p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <Heart className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-xs">No saved companion profiles yet.</p>
          <Link to="/companions" className="text-xs text-[#22D3EE] font-bold hover:underline inline-block">
            Browse companions →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((p) => (
            <div key={p.id} className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-5 space-y-4">
              <div className="flex items-center space-x-3">
                <img src={p.avatar_url} alt={p.display_name} className="w-14 h-14 rounded-xl object-cover" />
                <div>
                  <h3 className="text-base font-bold text-white">{p.display_name}</h3>
                  <div className="flex items-center space-x-1 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-[#22D3EE]" />
                    <span>{p.city}</span>
                  </div>
                  <span className="text-xs font-bold text-[#22D3EE]">₹{p.hourly_rate_inr}/hr</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#232D48]">
                <button
                  onClick={() => handleRemoveFav(p.id)}
                  className="text-xs text-rose-400 hover:underline"
                >
                  Remove
                </button>
                <Link
                  to={`/companions/${p.id}`}
                  className="px-3.5 py-1.5 rounded-lg bg-[#22D3EE] text-slate-950 font-bold text-xs"
                >
                  Book Meetup
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

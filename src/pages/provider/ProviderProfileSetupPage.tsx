import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { ProviderProfile } from '../../types';
import { User, MapPin, Coffee, CheckCircle } from 'lucide-react';

export const ProviderProfileSetupPage: React.FC = () => {
  const { user } = useAuth();
  const [provider, setProvider] = useState<ProviderProfile | null>(null);

  const [displayName, setDisplayName] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [locality, setLocality] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState(600);
  const [languages, setLanguages] = useState('English, Tamil');
  const [activities, setActivities] = useState<string[]>([
    'Coffee & Conversation',
    'City Sightseeing & Tours'
  ]);

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user) {
      const p = ApiService.getProviderById(user.user_id);
      if (p) {
        setProvider(p);
        setDisplayName(p.display_name);
        setCity(p.city);
        setLocality(p.locality || '');
        setBio(p.bio);
        setHourlyRate(p.hourly_rate_inr);
        setLanguages(p.languages.join(', '));
        setActivities(p.permitted_activities);
      }
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider) return;

    const langArray = languages.split(',').map((l) => l.trim()).filter(Boolean);

    const updated = ApiService.updateProviderProfile(provider.id, {
      display_name: displayName,
      city,
      locality,
      bio,
      hourly_rate_inr: Number(hourlyRate),
      languages: langArray,
      permitted_activities: activities
    });

    setProvider(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const toggleActivity = (actName: string) => {
    if (activities.includes(actName)) {
      setActivities(activities.filter((a) => a !== actName));
    } else {
      setActivities([...activities, actName]);
    }
  };

  const allActivities = ApiService.getActivities();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Companion Profile Setup</h1>
        <p className="text-xs text-slate-400">Configure your biography, hourly rate in INR (₹), city, and permitted activities</p>
      </div>

      <div className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-6 space-y-6">
        {isSaved && (
          <div className="p-3 bg-[#A3E635]/10 border border-[#A3E635]/30 text-[#A3E635] text-xs font-bold rounded-xl flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Profile details saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Hourly Rate (INR ₹)</label>
              <input
                type="number"
                min="300"
                max="2500"
                step="50"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                required
                className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Primary City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-white"
              >
                <option value="Bangalore">Bangalore (Bengaluru)</option>
                <option value="Chennai">Chennai</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Salem">Salem</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Locality / Neighborhood</label>
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Indiranagar, Nungambakkam, Race Course"
                className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Spoken Languages (Comma separated)</label>
            <input
              type="text"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              placeholder="English, Tamil, Hindi, Kannada"
              className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Biography & Social Interests</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              required
              className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-2">Permitted Non-Sexual Activities Checklist</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allActivities.map((act) => {
                const checked = activities.includes(act.name);
                return (
                  <button
                    type="button"
                    key={act.id}
                    onClick={() => toggleActivity(act.name)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                      checked
                        ? 'bg-[#22D3EE]/10 border-[#22D3EE] text-white font-bold'
                        : 'bg-[#0B1020] border-[#232D48] text-slate-400'
                    }`}
                  >
                    <span>{act.name}</span>
                    {checked && <span className="text-[#22D3EE]">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#22D3EE] text-slate-950 font-bold text-xs hover:bg-[#06B6D4]"
          >
            Save Profile Settings
          </button>
        </form>
      </div>
    </div>
  );
};

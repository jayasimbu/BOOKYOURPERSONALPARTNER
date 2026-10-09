import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, Shield, Lock } from 'lucide-react';

export const CustomerSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone_number || '+91 98765 43210');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>
        <p className="text-xs text-slate-400">Manage your profile details and safety preferences</p>
      </div>

      <div className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-6 space-y-6">
        {isSaved && (
          <div className="p-3 bg-[#A3E635]/10 border border-[#A3E635]/30 text-[#A3E635] text-xs font-bold rounded-xl">
            ✓ Account preferences updated.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Full Legal Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Email Address</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#22D3EE] text-slate-950 font-bold text-xs hover:bg-[#06B6D4]"
            >
              Save Profile Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

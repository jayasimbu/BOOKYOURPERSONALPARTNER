import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import { UserProfile } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { Users, UserX, UserCheck, Shield } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    setUsers(ApiService.getAllUsers());
  }, []);

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const updated = ApiService.updateUserAccountStatus(userId, nextStatus as any);
    setUsers((prev) => prev.map((u) => (u.id === userId || u.user_id === userId ? updated : u)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Users className="w-6 h-6 text-[#A3E635]" />
          <span>User Accounts Management</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor all registered customer and companion accounts, suspend rule violators, and inspect roles.
        </p>
      </div>

      <div className="bg-[#151C2F] border border-[#232D48] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0B1020] border-b border-[#232D48] text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">18+ Adult Verified</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232D48]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#1D2740]">
                  <td className="p-4 font-bold text-white flex items-center space-x-3">
                    <img
                      src={u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={u.full_name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <span>{u.full_name}</span>
                  </td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-[#0B1020] text-[#22D3EE] font-bold uppercase text-[10px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-[#A3E635] font-bold">
                    {u.is_adult_verified ? '✓ Verified 18+' : '❌ Unverified'}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(u.id, u.status)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                        u.status === 'active'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'
                          : 'bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/30 hover:bg-[#A3E635]/20'
                      }`}
                    >
                      {u.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

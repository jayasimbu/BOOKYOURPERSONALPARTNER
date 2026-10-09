import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import { VerificationSubmission, ProviderProfile } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { Shield, Check, X, FileText, Eye, AlertCircle } from 'lucide-react';

export const AdminVerificationQueuePage: React.FC = () => {
  const [queue, setQueue] = useState<VerificationSubmission[]>([]);
  const [selectedSub, setSelectedSub] = useState<VerificationSubmission | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');

  useEffect(() => {
    setQueue(ApiService.getVerificationQueue());
  }, []);

  const handleReview = (id: string, status: 'approved' | 'rejected', notes?: string) => {
    const updated = ApiService.reviewVerification(id, status, notes);
    setQueue((prev) => prev.map((s) => (s.id === id ? updated : s)));
    setSelectedSub(null);
    setRejectNotes('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Shield className="w-6 h-6 text-[#22D3EE]" />
          <span>Provider Verification Queue</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review uploaded government identity documents and approve companion profile visibility.
        </p>
      </div>

      {queue.length === 0 ? (
        <div className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-12 text-center text-slate-400 text-xs">
          No verification submissions recorded.
        </div>
      ) : (
        <div className="space-y-4">
          {queue.map((sub) => {
            const provider = ApiService.getProviderById(sub.provider_id);

            return (
              <div
                key={sub.id}
                className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-5 space-y-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={provider?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={provider?.display_name || 'Companion'}
                    className="w-14 h-14 rounded-xl object-cover border border-[#232D48]"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-base font-bold text-white">{provider?.display_name || 'Companion Profile'}</h3>
                      <StatusBadge status={sub.status} />
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-slate-300">
                      <span className="uppercase font-bold text-[#22D3EE]">{sub.id_type}</span>
                      <span>• {sub.id_number_masked}</span>
                      <span>• City: {provider?.city}</span>
                    </div>

                    <span className="text-[10px] text-slate-400 block">
                      Submitted: {new Date(sub.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <a
                    href={sub.document_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-[#0B1020] text-slate-300 border border-[#232D48] text-xs font-semibold hover:border-slate-500 flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Doc</span>
                  </a>

                  {sub.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleReview(sub.id, 'rejected', 'Document image unreadable.')}
                        className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs hover:bg-red-500/20"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleReview(sub.id, 'approved')}
                        className="px-4 py-1.5 rounded-xl bg-[#A3E635] text-slate-950 font-extrabold text-xs hover:bg-[#84CC16]"
                      >
                        Approve Profile
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

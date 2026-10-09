import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { VerificationSubmission, ProviderProfile } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { Shield, Lock, FileText, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

export const ProviderVerificationPage: React.FC = () => {
  const { user } = useAuth();
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [submissions, setSubmissions] = useState<VerificationSubmission[]>([]);

  const [idType, setIdType] = useState<'aadhaar' | 'pan' | 'passport' | 'voter_id'>('aadhaar');
  const [idNumber, setIdNumber] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [selfieUrl, setSelfieUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      const p = ApiService.getProviderById(user.user_id);
      if (p) {
        setProvider(p);
        const allSubs = ApiService.getVerificationQueue();
        const mySubs = allSubs.filter((s) => s.provider_id === p.id);
        setSubmissions(mySubs);
      }
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider) return;

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Mask ID number for privacy
      const masked = idNumber.length > 4 ? `XXXX-XXXX-${idNumber.slice(-4)}` : 'XXXX-XXXX-9999';

      const newSub = ApiService.submitVerification({
        provider_id: provider.id,
        id_type: idType,
        id_number_masked: masked,
        document_url: docUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
        selfie_url: selfieUrl || provider.avatar_url
      });

      setSubmissions((prev) => [newSub, ...prev]);
      setSuccessMsg('Government ID submission received. Operations admin will verify your identity within 24 hours.');
      setIdNumber('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Shield className="w-6 h-6 text-[#A3E635]" />
          <span>Government ID Verification</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Identity verification is required for all companion profiles to maintain platform trust & safety.
        </p>
      </div>

      {/* Confidentiality Box */}
      <div className="p-4 rounded-2xl bg-[#151C2F] border border-[#232D48] text-xs text-slate-300 space-y-2">
        <div className="flex items-center space-x-2 text-[#22D3EE] font-bold">
          <Lock className="w-4 h-4" />
          <span>Strict Document Confidentiality Guarantee</span>
        </div>
        <p className="leading-relaxed text-[#94A3B8]">
          Your identity documents are encrypted in private database storage buckets. Documents are accessed strictly by authorized platform administration during verification review and are never shown publicly or shared with customers.
        </p>
      </div>

      {/* Submission Form */}
      <div className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-6 space-y-6">
        <h2 className="text-base font-bold text-white">Submit Verification Document</h2>

        {successMsg && (
          <div className="p-3 bg-[#A3E635]/10 border border-[#A3E635]/30 text-[#A3E635] text-xs font-bold rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Select Government ID Type</label>
            <select
              value={idType}
              onChange={(e) => setIdType(e.target.value as any)}
              className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-white"
            >
              <option value="aadhaar">Aadhaar Card (India)</option>
              <option value="pan">PAN Card</option>
              <option value="passport">Indian Passport</option>
              <option value="voter_id">Voter ID Card</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">ID Card Number</label>
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="e.g. 9876 5432 1098"
              required
              className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Document Front Image URL / Demo File</label>
            <input
              type="text"
              value={docUrl}
              onChange={(e) => setDocUrl(e.target.value)}
              placeholder="Paste document URL or leave empty for default demo card"
              className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-[#A3E635] text-slate-950 font-bold text-xs hover:bg-[#84CC16]"
          >
            {isSubmitting ? 'Uploading...' : 'Submit Verification Documents'}
          </button>
        </form>
      </div>

      {/* History Log */}
      <div className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white">Verification Submissions History</h2>

        {submissions.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No verification submissions recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {submissions.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-xl bg-[#0B1020] border border-[#232D48] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white uppercase">{s.id_type}</span>
                    <span className="text-slate-400">({s.id_number_masked})</span>
                    <StatusBadge status={s.status} />
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Submitted: {new Date(s.created_at).toLocaleDateString()}
                  </span>
                  {s.rejection_reason && (
                    <span className="text-xs text-red-400 block mt-1">
                      Reason: {s.rejection_reason}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

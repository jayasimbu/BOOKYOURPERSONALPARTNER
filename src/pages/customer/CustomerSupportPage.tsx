import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

export const CustomerSupportPage: React.FC = () => {
  const { user } = useAuth();
  const [reason, setReason] = useState('Safety Concern');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    ApiService.submitReport({
      reporter_id: user.user_id,
      reporter_name: user.full_name,
      reported_user_id: 'usr-provider-1',
      reported_user_name: 'Platform Support Inquiry',
      reason,
      details
    });

    setSubmitted(true);
    setDetails('');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Shield className="w-6 h-6 text-[#A3E635]" />
          <span>Safety & Confidential Support</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Submit confidential tickets or safety reports directly to platform administration</p>
      </div>

      <div className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-6 space-y-4">
        {submitted && (
          <div className="p-3 bg-[#A3E635]/10 border border-[#A3E635]/30 text-[#A3E635] text-xs font-bold rounded-xl flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Support ticket submitted to operations admin. Investigation window: 24h.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Support Category</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-white"
            >
              <option value="Safety Concern">Safety Concern / Code of Conduct</option>
              <option value="Booking Refund">Booking Cancellation & Refund</option>
              <option value="Payment Issue">Razorpay Payment Inquiry</option>
              <option value="General Support">General Platform Question</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Describe Issue</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              required
              placeholder="Provide relevant details, booking IDs, or questions..."
              className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-white"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#06B6D4] text-slate-950 font-bold text-xs"
          >
            Submit Confidential Support Ticket
          </button>
        </form>
      </div>
    </div>
  );
};

import React from 'react';

export const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B1020] py-12 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
        <p className="text-xs text-slate-400">Last updated: October 2026</p>

        <div className="p-8 rounded-2xl bg-[#151C2F] border border-[#232D48] space-y-6 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase">1. Platform Nature & Permitted Scope</h2>
            <p>
              Companion Connect operates exclusively as a social companionship marketplace facilitating non-sexual adult meetups for activities such as coffee conversations, city sightseeing, food dining, and cultural exchange in India.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase">2. Prohibition of Sexual Services</h2>
            <p>
              Sexual services, physical intimacy, escorting, or sexual solicitation of any kind are strictly forbidden. Users violating this provision will be immediately banned and reported to relevant authorities.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase">3. Adult Eligibility (18+ Requirement)</h2>
            <p>
              Users must be at least 18 years of age to register as a Customer or Companion. Verification checks are enforced for all providers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase">4. Payments & Cancellation Terms</h2>
            <p>
              All transactions are processed through Razorpay in Indian Rupees (INR ₹). Cancellations made at least 24 hours prior to the scheduled meetup are eligible for full refund processing.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

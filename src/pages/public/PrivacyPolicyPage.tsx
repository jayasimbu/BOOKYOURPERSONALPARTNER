import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B1020] py-12 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-3xl font-extrabold text-white">Privacy Policy & Document Retention</h1>
        <p className="text-xs text-slate-400">Last updated: October 2026</p>

        <div className="p-8 rounded-2xl bg-[#151C2F] border border-[#232D48] space-y-6 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase">1. Data Collection & Purpose</h2>
            <p>
              We collect minimal required profile information (name, email, city, spoken languages) to provide social companionship services and prevent fraudulent activity.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase">2. Strict Identity Document Confidentiality</h2>
            <p>
              Identity verification documents (Aadhaar, Passport, Voter ID) uploaded by companions are stored in private, restricted-access Supabase storage buckets. Documents are accessed strictly by authorized platform administrators during the verification review process and are never disclosed to third parties or customers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase">3. Data Retention & Right to Erasure</h2>
            <p>
              Users may request account deletion at any time. Upon account termination, personal profile data and sensitive verification records are permanently expunged from primary operational storage within 30 days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

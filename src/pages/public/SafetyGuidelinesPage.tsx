import React from 'react';
import { Shield, AlertOctagon, CheckCircle2, Lock, PhoneCall, AlertTriangle } from 'lucide-react';

export const SafetyGuidelinesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B1020] py-12 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#A3E635]/10 border border-[#A3E635]/30 text-[#A3E635] text-xs font-semibold">
            <Shield className="w-4 h-4" />
            <span>Platform Code of Conduct</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Safety Guidelines & Non-Sexual Guarantee</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Companion Connect is built on mutual respect, personal dignity, and zero tolerance for illegal or sexual solicitation.
          </p>
        </div>

        {/* Core Guarantees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#151C2F] border border-[#232D48] space-y-3">
            <AlertOctagon className="w-6 h-6 text-red-400" />
            <h3 className="text-base font-bold text-white">Strictly Non-Sexual Policy</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Companion Connect does not facilitate adult services, sexual solicitation, physical intimacy, or illegal activities. Any user attempting sexual solicitation will face immediate account termination and reporting to law enforcement.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#151C2F] border border-[#232D48] space-y-3">
            <CheckCircle2 className="w-6 h-6 text-[#A3E635]" />
            <h3 className="text-base font-bold text-white">Public Location Mandate</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              All meetups must take place in public cafes, restaurants, parks, or registered event venues. Meetups in private homes, hotel rooms, or secluded places are prohibited.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#151C2F] border border-[#232D48] space-y-3">
            <Lock className="w-6 h-6 text-[#22D3EE]" />
            <h3 className="text-base font-bold text-white">Identity Verification Privacy</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Companion verification documents (Aadhaar, Passport, PAN) are stored securely in restricted private database buckets. Document details are never publicly exposed or shared with customers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#151C2F] border border-[#232D48] space-y-3">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <h3 className="text-base font-bold text-white">Zero Tolerance Reporting</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Both customers and companions have access to one-click block and report features. Administrative staff investigate reports within 24 hours.
            </p>
          </div>
        </div>

        {/* Safety Advice Checklist */}
        <div className="p-6 rounded-2xl bg-[#151C2F] border border-[#232D48] space-y-4">
          <h2 className="text-lg font-bold text-white">Personal Safety Tips for Meetups</h2>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="text-[#22D3EE] font-bold">1.</span>
              <span>Always inform a friend or family member about your meetup location and expected return time.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#22D3EE] font-bold">2.</span>
              <span>Keep all initial communication inside the Companion Connect in-app messaging system.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#22D3EE] font-bold">3.</span>
              <span>Never send money outside of the platform’s official Razorpay checkout workflow.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#22D3EE] font-bold">4.</span>
              <span>If you feel uncomfortable at any point during a meetup, excuse yourself politely and leave immediately.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

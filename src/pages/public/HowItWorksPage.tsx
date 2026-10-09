import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Search, Calendar, CreditCard, MessageSquare, CheckCircle, Coffee, ArrowRight } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B1020] py-12 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] text-xs font-semibold">
            <Shield className="w-4 h-4" />
            <span>Platform Workflow Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">How Companion Connect Works</h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            A transparent, safe, and lawful process for booking social meetups with verified companions across Bangalore, Chennai, Coimbatore, and Salem.
          </p>
        </div>

        {/* For Customers */}
        <div className="bg-[#151C2F] border border-[#232D48] rounded-3xl p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/10 text-[#22D3EE] flex items-center justify-center font-bold">
              01
            </div>
            <h2 className="text-xl font-bold text-white">For Customers seeking Social Companionship</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-[#0B1020] border border-[#232D48] space-y-3">
              <Search className="w-6 h-6 text-[#22D3EE]" />
              <h3 className="text-sm font-bold text-white">1. Search & Filter</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter verified companion profiles by city (Bangalore, Chennai, Coimbatore, Salem), activity, spoken languages, and hourly rate (INR ₹).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0B1020] border border-[#232D48] space-y-3">
              <Calendar className="w-6 h-6 text-[#A3E635]" />
              <h3 className="text-sm font-bold text-white">2. Request & Public Venue</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select an open slot, specify a public cafe or venue, choose your activity, and send a booking request.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0B1020] border border-[#232D48] space-y-3">
              <CreditCard className="w-6 h-6 text-[#22D3EE]" />
              <h3 className="text-sm font-bold text-white">3. Pay & Connect</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Once accepted by the companion, complete payment via Razorpay. Realtime chat activates to coordinate public meetup details.
              </p>
            </div>
          </div>
        </div>

        {/* For Companions */}
        <div className="bg-[#151C2F] border border-[#232D48] rounded-3xl p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#A3E635]/10 text-[#A3E635] flex items-center justify-center font-bold">
              02
            </div>
            <h2 className="text-xl font-bold text-white">For Companions / Providers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-[#0B1020] border border-[#232D48] space-y-3">
              <Shield className="w-6 h-6 text-[#A3E635]" />
              <h3 className="text-sm font-bold text-white">1. Secure ID Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Register as a companion provider, submit government ID (Aadhaar, Passport, PAN) for confidential admin verification.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0B1020] border border-[#232D48] space-y-3">
              <Coffee className="w-6 h-6 text-[#22D3EE]" />
              <h3 className="text-sm font-bold text-white">2. Set Rates & Activities</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Define your hourly rate in INR, set permitted non-sexual activities (cafe coffee, city tours, dining), and update availability slots.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0B1020] border border-[#232D48] space-y-3">
              <CheckCircle className="w-6 h-6 text-[#A3E635]" />
              <h3 className="text-sm font-bold text-white">3. Meet & Earn</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Accept requests that suit your schedule, meet in safe public venues, and receive direct payouts to your bank account.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            to="/companions"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#06B6D4] text-slate-950 font-extrabold text-sm hover:opacity-90 transition-opacity"
          >
            <span>Explore Companions Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

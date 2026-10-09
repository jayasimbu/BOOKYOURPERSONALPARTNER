import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Coffee, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#080C19] border-t border-[#1E293B] text-slate-400 text-sm">
      {/* Non-Sexual Platform Guarantee Banner */}
      <div className="bg-gradient-to-r from-[#151C2F] via-[#1D2740] to-[#151C2F] border-b border-[#232D48] py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-[#A3E635] flex-shrink-0" />
            <p className="text-xs font-semibold text-slate-200">
              <strong className="text-[#A3E635]">100% Lawful & Non-Sexual Marketplace:</strong> Companion Connect facilitates strictly social companionship, cafe conversations, and local sightseeing in public venues.
            </p>
          </div>
          <Link
            to="/safety"
            className="text-xs font-bold text-[#22D3EE] hover:underline flex items-center space-x-1"
          >
            <span>Read Safety & Code of Conduct</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#22D3EE] to-[#A3E635] flex items-center justify-center text-slate-950 font-bold">
                <Shield className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Companion<span className="text-[#22D3EE]">Connect</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's premier social companionship platform connecting adults for coffee meetups, city tours, dining, and event companionship.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Lock className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>Razorpay Secured Payments (INR ₹)</span>
            </div>
          </div>

          {/* Featured Cities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Active Cities</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/companions?city=Bangalore" className="hover:text-[#22D3EE] transition-colors">
                  Bangalore (Bengaluru)
                </Link>
              </li>
              <li>
                <Link to="/companions?city=Chennai" className="hover:text-[#22D3EE] transition-colors">
                  Chennai
                </Link>
              </li>
              <li>
                <Link to="/companions?city=Coimbatore" className="hover:text-[#22D3EE] transition-colors">
                  Coimbatore
                </Link>
              </li>
              <li>
                <Link to="/companions?city=Salem" className="hover:text-[#22D3EE] transition-colors">
                  Salem
                </Link>
              </li>
            </ul>
          </div>

          {/* Permitted Activities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Permitted Meetups</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3 h-3 text-[#A3E635]" />
                <span>Coffee & Conversation</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3 h-3 text-[#A3E635]" />
                <span>City Sightseeing & Heritage</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3 h-3 text-[#A3E635]" />
                <span>Event & Concert Companionship</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3 h-3 text-[#A3E635]" />
                <span>Restaurant Dining</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3 h-3 text-[#A3E635]" />
                <span>Language & Culture Exchange</span>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Legal & Support</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/how-it-works" className="hover:text-[#22D3EE]">How It Works</Link>
              </li>
              <li>
                <Link to="/safety" className="hover:text-[#22D3EE]">Safety Guidelines & Zero-Tolerance</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#22D3EE]">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#22D3EE]">Privacy & Identity Retention</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#22D3EE] text-slate-400">Admin Portal Sign In</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#1E293B] flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Companion Connect Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span>Prices listed in INR (₹)</span>
            <span>•</span>
            <span>English (Tamil localization ready)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

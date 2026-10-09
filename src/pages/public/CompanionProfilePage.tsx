import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ApiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ProviderProfile, Review } from '../../types';
import { Modal } from '../../components/common/Modal';
import {
  Shield,
  Star,
  MapPin,
  Clock,
  Calendar,
  Coffee,
  Heart,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Info
} from 'lucide-react';

export const CompanionProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState('2026-10-15');
  const [startTime, setStartTime] = useState('16:00');
  const [durationHours, setDurationHours] = useState(2);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [locationName, setLocationName] = useState('Third Wave Coffee');
  const [locationAddress, setLocationAddress] = useState('100 Feet Road, Indiranagar');
  const [customerNotes, setCustomerNotes] = useState('');

  const [bookingError, setBookingError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate content');
  const [reportDetails, setReportDetails] = useState('');

  useEffect(() => {
    if (id) {
      const p = ApiService.getProviderById(id);
      if (p) {
        setProvider(p);
        setSelectedActivity(p.permitted_activities[0] || 'Coffee & Conversation');
        setReviews(ApiService.getProviderReviews(p.id));
        if (user) {
          const favs = ApiService.getFavorites(user.user_id);
          setIsFavorite(favs.includes(p.id));
        }
      }
    }
  }, [id, user]);

  if (!provider) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center text-slate-400">
        <div className="text-center space-y-3">
          <p className="text-[#22D3EE] font-bold">Companion profile not found</p>
          <button
            onClick={() => navigate('/companions')}
            className="px-4 py-2 bg-[#151C2F] rounded-xl text-xs text-white border border-[#232D48]"
          >
            Back to Companion Browse
          </button>
        </div>
      </div>
    );
  }

  const handleToggleFavorite = () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    const nextState = ApiService.toggleFavorite(user.user_id, provider.id);
    setIsFavorite(nextState);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    setBookingError('');
    setIsSubmitting(true);

    try {
      // Calculate end time
      const [startH, startM] = startTime.split(':').map(Number);
      const endH = startH + durationHours;
      const endTime = `${endH < 10 ? '0' : ''}${endH}:${startM < 10 ? '0' : ''}${startM}`;

      // Create booking via state machine engine
      const booking = ApiService.createBooking({
        customer_id: user.user_id,
        customer_name: user.full_name,
        customer_avatar: user.avatar_url,
        provider_id: provider.id,
        date: bookingDate,
        start_time: startTime,
        end_time: endTime,
        location_name: locationName,
        location_address: locationAddress,
        activity_name: selectedActivity,
        duration_hours: durationHours,
        customer_notes: customerNotes
      });

      setIsBookingModalOpen(false);
      // Redirect to customer checkout page
      navigate(`/dashboard/customer/checkout/${booking.id}`);
    } catch (err: any) {
      setBookingError(err.message || 'Failed to create booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    ApiService.submitReport({
      reporter_id: user.user_id,
      reporter_name: user.full_name,
      reported_user_id: provider.user_id,
      reported_user_name: provider.display_name,
      reason: reportReason,
      details: reportDetails
    });

    setIsReportModalOpen(false);
    alert('Report submitted to platform administration for safety investigation.');
  };

  const totalCost = provider.hourly_rate_inr * durationHours;

  return (
    <div className="min-h-screen bg-[#0B1020] py-10 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Companion Header Card */}
        <div className="bg-[#151C2F] border border-[#232D48] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-slate-900 border-2 border-[#22D3EE]/30 flex-shrink-0">
              <img src={provider.avatar_url} alt={provider.display_name} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{provider.display_name}</h1>
                <span className="px-2.5 py-1 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] text-[11px] font-bold flex items-center space-x-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>ID Verified</span>
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-300">
                <MapPin className="w-4 h-4 text-[#22D3EE]" />
                <span>{provider.city} ({provider.locality || 'Indiranagar / City Center'})</span>
              </div>

              <div className="flex items-center space-x-4 pt-1">
                <div className="flex items-center space-x-1.5 text-xs text-slate-200">
                  <Star className="w-4 h-4 fill-[#A3E635] text-[#A3E635]" />
                  <span className="font-bold text-white">{provider.rating.toFixed(2)}</span>
                  <span className="text-slate-400">({provider.review_count} verified reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Booking CTA Box */}
          <div className="w-full md:w-auto bg-[#0B1020] p-6 rounded-2xl border border-[#232D48] space-y-4 flex flex-col justify-center">
            <div className="text-center md:text-right">
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Meetup Rate</span>
              <div className="text-3xl font-extrabold text-[#22D3EE]">₹{provider.hourly_rate_inr}<span className="text-xs font-normal text-slate-400"> / hour</span></div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleFavorite}
                className={`p-3 rounded-xl border transition-colors ${
                  isFavorite
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    : 'bg-[#151C2F] border-[#232D48] text-slate-400 hover:text-white'
                }`}
                title="Save Profile"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-400' : ''}`} />
              </button>

              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#06B6D4] text-slate-950 font-extrabold text-sm hover:opacity-90 shadow-lg transition-all"
              >
                Request Meetup Booking
              </button>
            </div>
          </div>
        </div>

        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info (Bio, Activities, Spoken Languages) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Biography */}
            <div className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-6 space-y-3">
              <h2 className="text-lg font-bold text-white">About {provider.display_name}</h2>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {provider.bio}
              </p>
            </div>

            {/* Permitted Non-Sexual Activities */}
            <div className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Coffee className="w-5 h-5 text-[#22D3EE]" />
                <span>Permitted Non-Sexual Activities</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {provider.permitted_activities.map((act) => (
                  <div
                    key={act}
                    className="p-3 rounded-xl bg-[#0B1020] border border-[#232D48] flex items-center space-x-3"
                  >
                    <CheckCircle className="w-4 h-4 text-[#A3E635] flex-shrink-0" />
                    <span className="text-xs font-semibold text-slate-200">{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Spoken Languages */}
            <div className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-6 space-y-3">
              <h2 className="text-lg font-bold text-white">Spoken Languages</h2>
              <div className="flex flex-wrap gap-2">
                {provider.languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1.5 rounded-xl bg-[#0B1020] border border-[#232D48] text-xs font-semibold text-[#22D3EE]"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Verified Customer Reviews</h2>
                <span className="text-xs text-slate-400">{reviews.length} reviews</span>
              </div>

              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No reviews submitted yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-[#0B1020] border border-[#232D48] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white">{rev.customer_name}</span>
                          <span className="text-[10px] text-slate-400">• Verified Meetup</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs">
                          <Star className="w-3.5 h-3.5 fill-[#A3E635] text-[#A3E635]" />
                          <span className="font-bold text-white">{rev.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Guidelines & Reporting */}
          <div className="space-y-6">
            {/* Safety Code Card */}
            <div className="bg-[#151C2F] border border-[#232D48] rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-2 text-[#A3E635]">
                <Shield className="w-5 h-5" />
                <h3 className="text-sm font-bold">Public Location Rule</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                All meetups booked through Companion Connect must occur strictly in public places (cafes, malls, parks, public tours). Private residences or hotel rooms are strictly forbidden.
              </p>
              <div className="pt-2 border-t border-[#232D48]">
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="text-xs text-slate-400 hover:text-red-400 flex items-center space-x-1"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Report Profile or Policy Concern</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title={`Request Meetup with ${provider.display_name}`}
      >
        <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
          {bookingError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              {bookingError}
            </div>
          )}

          <div>
            <label className="block text-slate-400 font-bold mb-1">Select Permitted Activity</label>
            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#22D3EE]"
            >
              {provider.permitted_activities.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Meetup Date</label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#22D3EE]"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-bold mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#22D3EE]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Duration (Hours)</label>
            <select
              value={durationHours}
              onChange={(e) => setDurationHours(Number(e.target.value))}
              className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#22D3EE]"
            >
              <option value={1}>1 Hour</option>
              <option value={2}>2 Hours</option>
              <option value={3}>3 Hours</option>
              <option value={4}>4 Hours</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Public Venue Name</label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g. Third Wave Coffee, Starbucks, Cubbon Park"
              required
              className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#22D3EE]"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Public Location Address</label>
            <input
              type="text"
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
              placeholder="e.g. 100 Feet Road, Indiranagar, Bangalore"
              required
              className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#22D3EE]"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Note for Companion (Optional)</label>
            <textarea
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              rows={2}
              placeholder="Any specific topics or preferences for the meetup..."
              className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#22D3EE]"
            />
          </div>

          {/* Pricing Summary Breakdown */}
          <div className="p-4 rounded-xl bg-[#0B1020] border border-[#232D48] space-y-2">
            <div className="flex justify-between text-slate-300">
              <span>Hourly Rate ({durationHours} hr):</span>
              <span>₹{provider.hourly_rate_inr} × {durationHours}</span>
            </div>
            <div className="flex justify-between text-white font-extrabold text-sm border-t border-[#232D48] pt-2">
              <span>Total Payable Amount:</span>
              <span className="text-[#22D3EE]">₹{totalCost}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#06B6D4] text-slate-950 font-bold text-sm hover:opacity-90 shadow-lg"
          >
            {isSubmitting ? 'Processing...' : 'Proceed to Checkout →'}
          </button>
        </form>
      </Modal>

      {/* Report Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report Companion Profile"
      >
        <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-bold mb-1">Reason for Report</label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-white"
            >
              <option value="Inappropriate content">Inappropriate profile content</option>
              <option value="Solicitation attempt">Solicitation or inappropriate request</option>
              <option value="Fake profile">Fake profile / Misrepresentation</option>
              <option value="Other safety concern">Other safety concern</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Details</label>
            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              rows={3}
              placeholder="Provide context for admin investigation..."
              required
              className="w-full bg-[#0B1020] border border-[#232D48] rounded-xl px-3 py-2 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600"
          >
            Submit Confidential Safety Report
          </button>
        </form>
      </Modal>
    </div>
  );
};

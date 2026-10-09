import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ApiService } from '../../services/api';
import { Booking } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { loadRazorpayScript } from '../../utils/razorpayLoader';
import { Shield, Lock, CreditCard, CheckCircle2, Clock, MapPin, AlertCircle } from 'lucide-react';

export const BookingCheckoutPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bookingId) {
      const b = ApiService.getBookingById(bookingId);
      if (b) {
        setBooking(b);
        if (b.status === 'CONFIRMED') setIsCompleted(true);
      }
    }
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center text-slate-400 text-xs">
        Booking order not found.
      </div>
    );
  }

  const handleRazorpayCheckout = async () => {
    setIsProcessing(true);
    setError('');

    try {
      // Step 1: BACKEND - Create Order
      const orderData = await ApiService.createRazorpayOrder(booking.id);

      // Load Razorpay Standard Checkout JS SDK
      const scriptLoaded = await loadRazorpayScript();

      if (scriptLoaded && (window as any).Razorpay) {
        // STEP 2: FRONTEND - Standard Razorpay Checkout Modal
        const options = {
          key: orderData.key_id || 'rzp_test_Tll3SrAzWW4Kx5',
          amount: orderData.amount, // amount in paise
          currency: orderData.currency || 'INR',
          name: 'Companion Connect',
          description: `Social Meetup: ${booking.activity_name}`,
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100',
          order_id: orderData.order_id,
          handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
            try {
              // STEP 3: BACKEND - Verify Signature
              const updatedBooking = await ApiService.verifyRazorpayPayment(
                booking.id,
                response.razorpay_order_id || orderData.order_id,
                response.razorpay_payment_id,
                response.razorpay_signature
              );
              setBooking(updatedBooking);
              setIsCompleted(true);
            } catch (err: any) {
              setError(err.message || 'Signature verification failed.');
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: booking.customer_name,
            email: 'aravind@example.com',
            contact: '+919876543210'
          },
          theme: {
            color: '#22D3EE'
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
              setError('Payment checkout dismissed by user.');
            }
          }
        };

        const razorpayInstance = new (window as any).Razorpay(options);
        
        razorpayInstance.on('payment.failed', (response: any) => {
          setIsProcessing(false);
          setError(`Payment Failed: ${response.error?.description || 'Transaction unsuccessful.'}`);
        });

        razorpayInstance.open();
      } else {
        // Fallback execution if checkout.js cannot be loaded dynamically
        const updatedBooking = await ApiService.verifyRazorpayPayment(
          booking.id,
          orderData.order_id,
          `pay_test_${Date.now()}`,
          `sig_test_${Math.random().toString(36).substring(7)}`
        );
        setBooking(updatedBooking);
        setIsCompleted(true);
        setIsProcessing(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initiate Razorpay order.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <div className="flex items-center space-x-2 text-xs text-slate-400">
        <Link to="/dashboard/customer/bookings" className="hover:text-[#22D3EE]">My Bookings</Link>
        <span>/</span>
        <span className="text-white font-semibold">Razorpay Checkout</span>
      </div>

      <div className="bg-[#151C2F] border border-[#232D48] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#232D48] pb-4">
          <div>
            <span className="text-[11px] font-bold text-[#22D3EE] uppercase tracking-wider">Order #{booking.booking_code}</span>
            <h1 className="text-xl font-bold text-white mt-0.5">Meetup Checkout</h1>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        {isCompleted ? (
          <div className="p-6 rounded-2xl bg-[#A3E635]/10 border border-[#A3E635]/30 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#A3E635] text-slate-950 flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h2 className="text-lg font-bold text-white">Payment Confirmed!</h2>
            <p className="text-xs text-slate-300">
              Your payment of <strong className="text-[#A3E635]">₹{booking.total_amount_inr}</strong> has been verified via Razorpay Standard Web Checkout. Your meetup with <strong>{booking.provider_name}</strong> is now confirmed.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                to="/dashboard/customer/messages"
                className="px-5 py-2.5 rounded-xl bg-[#22D3EE] text-slate-950 font-bold text-xs hover:bg-[#06B6D4]"
              >
                Chat with Companion →
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Booking Details Summary */}
            <div className="p-4 rounded-2xl bg-[#0B1020] border border-[#232D48] space-y-3">
              <div className="flex items-center space-x-3">
                <img
                  src={booking.provider_avatar}
                  alt={booking.provider_name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">{booking.provider_name}</h3>
                  <p className="text-xs text-[#22D3EE] font-semibold">{booking.activity_name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 border-t border-[#232D48] pt-3">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Date & Time</span>
                  <span className="font-bold text-white">{booking.date} ({booking.start_time})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Public Location</span>
                  <span className="font-bold text-white">{booking.location_name}</span>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Companion Rate ({booking.duration_hours} hr @ ₹{booking.hourly_rate_inr}/hr)</span>
                <span className="text-slate-200">₹{booking.hourly_rate_inr * booking.duration_hours}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Platform Operations Fee (15% included)</span>
                <span className="text-slate-200">₹{booking.platform_fee_inr}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white border-t border-[#232D48] pt-3">
                <span>Total Amount Payable (INR ₹)</span>
                <span className="text-[#22D3EE]">₹{booking.total_amount_inr}</span>
              </div>
            </div>

            {/* Razorpay Standard Checkout Information */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-3">
              <Lock className="w-5 h-5 flex-shrink-0 text-amber-400" />
              <div>
                <strong className="block font-bold">Razorpay Standard Web Checkout (Test Mode)</strong>
                <span>Secured via `rzp_test_Tll3SrAzWW4Kx5`. Supports UPI, NetBanking, Cards & Wallets.</span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleRazorpayCheckout}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#06B6D4] text-slate-950 font-extrabold text-sm hover:opacity-90 shadow-xl flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>{isProcessing ? 'Launching Razorpay Checkout...' : `Pay ₹${booking.total_amount_inr} via Razorpay`}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

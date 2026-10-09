import {
  UserProfile,
  UserRole,
  ProviderProfile,
  Activity,
  Booking,
  BookingStatus,
  Payment,
  Review,
  Conversation,
  Message,
  NotificationItem,
  Report,
  VerificationSubmission,
  AdminAuditLog,
  SearchFilters
} from '../types';
import { RazorpayBackendService } from './razorpayService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  INITIAL_ACTIVITIES,
  INITIAL_DEMO_USERS,
  INITIAL_PROVIDERS,
  INITIAL_VERIFICATIONS,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_ADMIN_LOGS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES
} from './mockData';

// LocalStorage Persistence Keys
const KEYS = {
  CURRENT_USER: 'cc_current_user',
  USERS: 'cc_users_list',
  PROVIDERS: 'cc_providers_list',
  BOOKINGS: 'cc_bookings_list',
  PAYMENTS: 'cc_payments_list',
  CONVERSATIONS: 'cc_conversations_list',
  MESSAGES: 'cc_messages_list',
  REVIEWS: 'cc_reviews_list',
  FAVORITES: 'cc_favorites_list',
  VERIFICATIONS: 'cc_verifications_list',
  REPORTS: 'cc_reports_list',
  AUDIT_LOGS: 'cc_audit_logs_list'
};

// Storage helper functions
function getStored<T>(key: string, defaultData: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultData;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultData;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

// Initialize default storage data if missing
if (!localStorage.getItem(KEYS.USERS)) setStored(KEYS.USERS, INITIAL_DEMO_USERS);
if (!localStorage.getItem(KEYS.PROVIDERS)) setStored(KEYS.PROVIDERS, INITIAL_PROVIDERS);
if (!localStorage.getItem(KEYS.BOOKINGS)) setStored(KEYS.BOOKINGS, INITIAL_BOOKINGS);
if (!localStorage.getItem(KEYS.VERIFICATIONS)) setStored(KEYS.VERIFICATIONS, INITIAL_VERIFICATIONS);
if (!localStorage.getItem(KEYS.REVIEWS)) setStored(KEYS.REVIEWS, INITIAL_REVIEWS);
if (!localStorage.getItem(KEYS.AUDIT_LOGS)) setStored(KEYS.AUDIT_LOGS, INITIAL_ADMIN_LOGS);
if (!localStorage.getItem(KEYS.CONVERSATIONS)) setStored(KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
if (!localStorage.getItem(KEYS.MESSAGES)) setStored(KEYS.MESSAGES, INITIAL_MESSAGES);
if (!localStorage.getItem(KEYS.FAVORITES)) setStored(KEYS.FAVORITES, []);
if (!localStorage.getItem(KEYS.REPORTS)) setStored(KEYS.REPORTS, []);
if (!localStorage.getItem(KEYS.CURRENT_USER)) setStored(KEYS.CURRENT_USER, INITIAL_DEMO_USERS[0]); // Customer demo default

export const ApiService = {
  // --- AUTHENTICATION ---
  getCurrentUser(): UserProfile | null {
    return getStored<UserProfile | null>(KEYS.CURRENT_USER, null);
  },

  setCurrentUser(user: UserProfile | null): void {
    setStored(KEYS.CURRENT_USER, user);
  },

  login(email: string, role: 'customer' | 'provider' | 'admin'): UserProfile {
    const users = getStored<UserProfile[]>(KEYS.USERS, INITIAL_DEMO_USERS);
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Auto-create demo profile if not found
      user = {
        id: `usr-${Date.now()}`,
        user_id: `usr-${Date.now()}`,
        email,
        full_name: email.split('@')[0].toUpperCase(),
        is_adult_verified: true,
        role,
        status: 'active',
        created_at: new Date().toISOString()
      };
      users.push(user);
      setStored(KEYS.USERS, users);
    } else {
      // Ensure role matches requested tab for smooth testing
      user.role = role;
    }

    setStored(KEYS.CURRENT_USER, user);
    return user;
  },

  register(
    full_name: string,
    email: string,
    role: UserRole,
    is_adult_verified: boolean
  ): UserProfile {
    if (!is_adult_verified) {
      throw new Error('You must be 18 years or older to register on Companion Connect.');
    }

    const users = getStored<UserProfile[]>(KEYS.USERS, INITIAL_DEMO_USERS);
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      user_id: `usr-${Date.now()}`,
      email,
      full_name,
      is_adult_verified: true,
      role,
      status: 'active',
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    setStored(KEYS.USERS, users);
    setStored(KEYS.CURRENT_USER, newUser);

    // If provider, create initial unapproved provider profile
    if (role === 'provider') {
      const providers = getStored<ProviderProfile[]>(KEYS.PROVIDERS, INITIAL_PROVIDERS);
      const newProvProfile: ProviderProfile = {
        id: `prov-${Date.now()}`,
        user_id: newUser.user_id,
        display_name: full_name,
        city: 'Bangalore',
        bio: 'Newly registered companion profile. Complete onboarding and submit ID verification to get approved.',
        languages: ['English'],
        hourly_rate_inr: 600,
        rating: 5.0,
        review_count: 0,
        verification_status: 'pending',
        is_visible: false,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        permitted_activities: ['Coffee & Conversation'],
        created_at: new Date().toISOString()
      };
      providers.push(newProvProfile);
      setStored(KEYS.PROVIDERS, providers);
    }

    return newUser;
  },

  // --- DISCOVERY & PROVIDERS ---
  getActivities(): Activity[] {
    return INITIAL_ACTIVITIES;
  },

  getProviders(filters?: Partial<SearchFilters>): ProviderProfile[] {
    const providers = getStored<ProviderProfile[]>(KEYS.PROVIDERS, INITIAL_PROVIDERS);
    let result = providers.filter((p) => p.verification_status === 'approved' && p.is_visible);

    if (!filters) return result;

    if (filters.city && filters.city !== 'All') {
      result = result.filter((p) => p.city.toLowerCase() === filters.city?.toLowerCase());
    }

    if (filters.activity && filters.activity !== 'All') {
      result = result.filter((p) =>
        p.permitted_activities.some((act) => act.toLowerCase().includes(filters.activity!.toLowerCase()))
      );
    }

    if (filters.language && filters.language !== 'All') {
      result = result.filter((p) =>
        p.languages.some((l) => l.toLowerCase() === filters.language?.toLowerCase())
      );
    }

    if (filters.maxPrice) {
      result = result.filter((p) => p.hourly_rate_inr <= filters.maxPrice!);
    }

    if (filters.minRating) {
      result = result.filter((p) => p.rating >= filters.minRating!);
    }

    if (filters.sortBy === 'rating_desc') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'price_asc') {
      result.sort((a, b) => a.hourly_rate_inr - b.hourly_rate_inr);
    } else if (filters.sortBy === 'price_desc') {
      result.sort((a, b) => b.hourly_rate_inr - a.hourly_rate_inr);
    }

    return result;
  },

  getProviderById(id: string): ProviderProfile | undefined {
    const providers = getStored<ProviderProfile[]>(KEYS.PROVIDERS, INITIAL_PROVIDERS);
    return providers.find((p) => p.id === id || p.user_id === id);
  },

  updateProviderProfile(providerId: string, updates: Partial<ProviderProfile>): ProviderProfile {
    const providers = getStored<ProviderProfile[]>(KEYS.PROVIDERS, INITIAL_PROVIDERS);
    const index = providers.findIndex((p) => p.id === providerId || p.user_id === providerId);
    if (index === -1) throw new Error('Provider profile not found.');

    providers[index] = { ...providers[index], ...updates };
    setStored(KEYS.PROVIDERS, providers);
    return providers[index];
  },

  // --- FAVORITES ---
  getFavorites(customerId: string): string[] {
    const favs = getStored<{ customer_id: string; provider_id: string }[]>(KEYS.FAVORITES, []);
    return favs.filter((f) => f.customer_id === customerId).map((f) => f.provider_id);
  },

  toggleFavorite(customerId: string, providerId: string): boolean {
    const favs = getStored<{ customer_id: string; provider_id: string }[]>(KEYS.FAVORITES, []);
    const index = favs.findIndex((f) => f.customer_id === customerId && f.provider_id === providerId);
    let isFav = false;

    if (index >= 0) {
      favs.splice(index, 1);
      isFav = false;
    } else {
      favs.push({ customer_id: customerId, provider_id: providerId });
      isFav = true;
    }

    setStored(KEYS.FAVORITES, favs);
    return isFav;
  },

  // --- BOOKING ENGINE & CONCURRENCY CONTROL ---
  checkDoubleBooking(providerId: string, date: string, startTime: string, endTime: string, ignoreBookingId?: string): boolean {
    const bookings = getStored<Booking[]>(KEYS.BOOKINGS, INITIAL_BOOKINGS);
    return bookings.some(
      (b) =>
        b.provider_id === providerId &&
        b.date === date &&
        ['ACCEPTED', 'PAYMENT_PENDING', 'CONFIRMED'].includes(b.status) &&
        b.id !== ignoreBookingId &&
        ((b.start_time <= startTime && b.end_time > startTime) ||
          (b.start_time < endTime && b.end_time >= endTime) ||
          (b.start_time >= startTime && b.end_time <= endTime))
    );
  },

  createBooking(params: {
    customer_id: string;
    customer_name: string;
    customer_avatar?: string;
    provider_id: string;
    date: string;
    start_time: string;
    end_time: string;
    location_name: string;
    location_address: string;
    activity_name: string;
    duration_hours: number;
    customer_notes?: string;
  }): Booking {
    const provider = this.getProviderById(params.provider_id);
    if (!provider) throw new Error('Provider not found.');

    // Server-side Double Booking Check
    const isConflict = this.checkDoubleBooking(provider.id, params.date, params.start_time, params.end_time);
    if (isConflict) {
      throw new Error('This companion is already booked for the selected date and time slot.');
    }

    // Server-side Pricing Calculation
    const hourly_rate_inr = provider.hourly_rate_inr;
    const total_amount_inr = hourly_rate_inr * params.duration_hours;
    const platform_fee_inr = Math.round(total_amount_inr * 0.15); // 15% platform commission

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      booking_code: `CC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_id: params.customer_id,
      customer_name: params.customer_name,
      customer_avatar: params.customer_avatar,
      provider_id: provider.id,
      provider_name: provider.display_name,
      provider_avatar: provider.avatar_url,
      provider_user_id: provider.user_id,
      date: params.date,
      start_time: params.start_time,
      end_time: params.end_time,
      location_name: params.location_name,
      location_address: params.location_address,
      activity_name: params.activity_name,
      hourly_rate_inr,
      duration_hours: params.duration_hours,
      total_amount_inr,
      platform_fee_inr,
      status: 'PENDING',
      customer_notes: params.customer_notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const bookings = getStored<Booking[]>(KEYS.BOOKINGS, INITIAL_BOOKINGS);
    bookings.unshift(newBooking);
    setStored(KEYS.BOOKINGS, bookings);

    return newBooking;
  },

  getBookingById(id: string): Booking | undefined {
    const bookings = getStored<Booking[]>(KEYS.BOOKINGS, INITIAL_BOOKINGS);
    return bookings.find((b) => b.id === id || b.booking_code === id);
  },

  getUserBookings(userId: string, role: 'customer' | 'provider'): Booking[] {
    const bookings = getStored<Booking[]>(KEYS.BOOKINGS, INITIAL_BOOKINGS);
    if (role === 'customer') {
      return bookings.filter((b) => b.customer_id === userId);
    } else {
      const provider = this.getProviderById(userId);
      const provId = provider ? provider.id : userId;
      return bookings.filter((b) => b.provider_id === provId || b.provider_user_id === userId);
    }
  },

  updateBookingStatus(bookingId: string, status: BookingStatus, provider_notes?: string): Booking {
    const bookings = getStored<Booking[]>(KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) throw new Error('Booking not found.');

    bookings[index].status = status;
    if (provider_notes) bookings[index].provider_notes = provider_notes;
    bookings[index].updated_at = new Date().toISOString();

    setStored(KEYS.BOOKINGS, bookings);

    // If accepted by provider, create/ensure chat conversation exists
    if (status === 'ACCEPTED') {
      this.ensureConversation(bookings[index].customer_id, bookings[index].provider_user_id, bookings[index].id);
    }

    return bookings[index];
  },

  // --- PAYMENTS & RAZORPAY EDGE FUNCTION INTEGRATION ---
  async createRazorpayOrder(bookingId: string): Promise<{ order_id: string; amount: number; currency: string; key_id: string }> {
    const booking = this.getBookingById(bookingId);
    if (!booking) throw new Error('Booking not found.');

    const amountPaise = Math.round(booking.total_amount_inr * 100);
    if (amountPaise < 100) {
      throw new Error('Payment amount must be at least 100 paise (₹1.00).');
    }

    // Call Supabase Edge Function if cloud is configured
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
          body: { booking_id: bookingId }
        });
        if (!error && data?.order_id) {
          return data;
        }
      } catch (e) {
        console.warn('Edge Function create-razorpay-order fallback:', e);
      }
    }

    let order_id = `order_rzp_${Date.now()}`;
    try {
      const order = await RazorpayBackendService.createOrder({
        amountPaise,
        currency: 'INR',
        receipt: `bk_rcpt_${booking.id}`
      });
      order_id = order.order_id;
    } catch (err: any) {
      console.warn('Backend Razorpay order creation fallback:', err);
    }

    // Store pending payment record locally
    const payments = getStored<Payment[]>(KEYS.PAYMENTS, []);
    payments.push({
      id: `pay-${Date.now()}`,
      booking_id: booking.id,
      customer_id: booking.customer_id,
      razorpay_order_id: order_id,
      amount_inr: booking.total_amount_inr,
      currency: 'INR',
      status: 'pending',
      created_at: new Date().toISOString()
    });
    setStored(KEYS.PAYMENTS, payments);

    const key_id = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_Tll3SrAzWW4Kx5';

    return {
      order_id,
      amount: amountPaise,
      currency: 'INR',
      key_id
    };
  },

  async verifyRazorpayPayment(bookingId: string, razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string): Promise<Booking> {
    const booking = this.getBookingById(bookingId);
    if (!booking) throw new Error('Booking not found.');

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error('Missing required Razorpay payment verification fields.');
    }

    // Invoke Edge Function for signature verification if connected to Supabase Cloud
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
          body: {
            booking_id: bookingId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
          }
        });

        if (error || (data && !data.success)) {
          throw new Error(error?.message || data?.error || 'Razorpay signature verification failed.');
        }
      } catch (e: any) {
        if (e.message?.includes('failed') || e.message?.includes('Invalid')) {
          throw e;
        }
      }
    }

    // Verify HMAC SHA-256 signature locally
    RazorpayBackendService.verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    // Update payment record to captured
    const payments = getStored<Payment[]>(KEYS.PAYMENTS, []);
    const payment = payments.find((p) => p.booking_id === bookingId || p.razorpay_order_id === razorpay_order_id);
    if (payment) {
      payment.razorpay_payment_id = razorpay_payment_id;
      payment.razorpay_signature = razorpay_signature;
      payment.status = 'captured';
      payment.payment_mode = 'Razorpay Standard Checkout (Test Mode)';
      setStored(KEYS.PAYMENTS, payments);
    }

    // Transition booking state machine to CONFIRMED
    return this.updateBookingStatus(bookingId, 'CONFIRMED');
  },

  // --- MESSAGING ---
  ensureConversation(customerId: string, providerUserId: string, bookingId?: string): Conversation {
    const conversations = getStored<Conversation[]>(KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
    let conv = conversations.find((c) => c.customer_id === customerId && c.provider_user_id === providerUserId);

    if (!conv) {
      const customer = getStored<UserProfile[]>(KEYS.USERS, INITIAL_DEMO_USERS).find((u) => u.user_id === customerId);
      const provider = this.getProviderById(providerUserId);

      conv = {
        id: `conv-${Date.now()}`,
        customer_id: customerId,
        customer_name: customer ? customer.full_name : 'Customer',
        customer_avatar: customer?.avatar_url,
        provider_user_id: providerUserId,
        provider_name: provider ? provider.display_name : 'Companion',
        provider_avatar: provider?.avatar_url,
        booking_id: bookingId,
        last_message: 'Conversation started.',
        last_message_at: new Date().toISOString(),
        unread_count: 0
      };
      conversations.unshift(conv);
      setStored(KEYS.CONVERSATIONS, conversations);
    }

    return conv;
  },

  getConversations(userId: string): Conversation[] {
    const conversations = getStored<Conversation[]>(KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
    return conversations.filter((c) => c.customer_id === userId || c.provider_user_id === userId);
  },

  getMessages(conversationId: string): Message[] {
    const messages = getStored<Message[]>(KEYS.MESSAGES, INITIAL_MESSAGES);
    return messages.filter((m) => m.conversation_id === conversationId);
  },

  sendMessage(conversationId: string, senderId: string, content: string): Message {
    const user = getStored<UserProfile[]>(KEYS.USERS, INITIAL_DEMO_USERS).find((u) => u.user_id === senderId);

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: senderId,
      sender_name: user ? user.full_name : 'User',
      sender_avatar: user?.avatar_url,
      content,
      is_read: false,
      created_at: new Date().toISOString()
    };

    const messages = getStored<Message[]>(KEYS.MESSAGES, INITIAL_MESSAGES);
    messages.push(newMessage);
    setStored(KEYS.MESSAGES, messages);

    // Update conversation last message
    const conversations = getStored<Conversation[]>(KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
    const conv = conversations.find((c) => c.id === conversationId);
    if (conv) {
      conv.last_message = content;
      conv.last_message_at = newMessage.created_at;
      setStored(KEYS.CONVERSATIONS, conversations);
    }

    return newMessage;
  },

  // --- REVIEWS ---
  getProviderReviews(providerId: string): Review[] {
    const reviews = getStored<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
    return reviews.filter((r) => r.provider_id === providerId && r.is_moderated);
  },

  createReview(bookingId: string, rating: number, comment: string): Review {
    const booking = this.getBookingById(bookingId);
    if (!booking) throw new Error('Booking not found.');

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      booking_id: bookingId,
      customer_id: booking.customer_id,
      customer_name: booking.customer_name,
      customer_avatar: booking.customer_avatar,
      provider_id: booking.provider_id,
      rating,
      comment,
      is_moderated: true,
      created_at: new Date().toISOString()
    };

    const reviews = getStored<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
    reviews.unshift(newReview);
    setStored(KEYS.REVIEWS, reviews);

    // Update provider rating average
    const provReviews = reviews.filter((r) => r.provider_id === booking.provider_id);
    const avgRating = provReviews.reduce((sum, r) => sum + r.rating, 0) / provReviews.length;
    this.updateProviderProfile(booking.provider_id, {
      rating: parseFloat(avgRating.toFixed(2)),
      review_count: provReviews.length
    });

    return newReview;
  },

  // --- VERIFICATION WORKFLOW & ADMIN ---
  submitVerification(data: { provider_id: string; id_type: 'aadhaar' | 'pan' | 'passport' | 'voter_id'; id_number_masked: string; document_url: string; selfie_url: string }): VerificationSubmission {
    const submissions = getStored<VerificationSubmission[]>(KEYS.VERIFICATIONS, INITIAL_VERIFICATIONS);
    const newSubmission: VerificationSubmission = {
      id: `verif-${Date.now()}`,
      provider_id: data.provider_id,
      id_type: data.id_type,
      id_number_masked: data.id_number_masked,
      document_url: data.document_url,
      selfie_url: data.selfie_url,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    submissions.unshift(newSubmission);
    setStored(KEYS.VERIFICATIONS, submissions);

    // Update provider status
    this.updateProviderProfile(data.provider_id, { verification_status: 'pending' });

    return newSubmission;
  },

  getVerificationQueue(): VerificationSubmission[] {
    return getStored<VerificationSubmission[]>(KEYS.VERIFICATIONS, INITIAL_VERIFICATIONS);
  },

  reviewVerification(submissionId: string, status: 'approved' | 'rejected', notes?: string, adminUserId = 'usr-admin-1'): VerificationSubmission {
    const submissions = getStored<VerificationSubmission[]>(KEYS.VERIFICATIONS, INITIAL_VERIFICATIONS);
    const sub = submissions.find((s) => s.id === submissionId);
    if (!sub) throw new Error('Verification submission not found.');

    sub.status = status;
    if (notes) sub.rejection_reason = notes;
    sub.reviewed_at = new Date().toISOString();
    sub.reviewed_by = adminUserId;

    setStored(KEYS.VERIFICATIONS, submissions);

    // Update provider profile status and visibility
    this.updateProviderProfile(sub.provider_id, {
      verification_status: status,
      is_visible: status === 'approved',
      verification_notes: notes
    });

    // Record Admin Audit Log
    this.addAdminAuditLog({
      admin_id: adminUserId,
      admin_name: 'Platform Operations Admin',
      action: status === 'approved' ? 'APPROVE_PROVIDER_VERIFICATION' : 'REJECT_PROVIDER_VERIFICATION',
      target_type: 'verification_submission',
      target_id: submissionId,
      details: { status, notes }
    });

    return sub;
  },

  getAllUsers(): UserProfile[] {
    return getStored<UserProfile[]>(KEYS.USERS, INITIAL_DEMO_USERS);
  },

  updateUserAccountStatus(userId: string, status: 'active' | 'suspended'): UserProfile {
    const users = getStored<UserProfile[]>(KEYS.USERS, INITIAL_DEMO_USERS);
    const u = users.find((usr) => usr.id === userId || usr.user_id === userId);
    if (!u) throw new Error('User not found.');

    u.status = status;
    setStored(KEYS.USERS, users);

    // Audit log
    this.addAdminAuditLog({
      admin_id: 'usr-admin-1',
      admin_name: 'Platform Operations Admin',
      action: status === 'suspended' ? 'SUSPEND_USER_ACCOUNT' : 'ACTIVATE_USER_ACCOUNT',
      target_type: 'user_profile',
      target_id: userId,
      details: { email: u.email, status }
    });

    return u;
  },

  getAllBookings(): Booking[] {
    return getStored<Booking[]>(KEYS.BOOKINGS, INITIAL_BOOKINGS);
  },

  getAllPayments(): Payment[] {
    return getStored<Payment[]>(KEYS.PAYMENTS, []);
  },

  getReports(): Report[] {
    return getStored<Report[]>(KEYS.REPORTS, []);
  },

  submitReport(params: { reporter_id: string; reporter_name: string; reported_user_id: string; reported_user_name: string; booking_id?: string; reason: string; details?: string }): Report {
    const reports = getStored<Report[]>(KEYS.REPORTS, []);
    const newReport: Report = {
      id: `rep-${Date.now()}`,
      reporter_id: params.reporter_id,
      reporter_name: params.reporter_name,
      reported_user_id: params.reported_user_id,
      reported_user_name: params.reported_user_name,
      booking_id: params.booking_id,
      reason: params.reason,
      details: params.details,
      status: 'open',
      created_at: new Date().toISOString()
    };

    reports.unshift(newReport);
    setStored(KEYS.REPORTS, reports);

    return newReport;
  },

  resolveReport(reportId: string, status: 'resolved' | 'dismissed', notes?: string): Report {
    const reports = getStored<Report[]>(KEYS.REPORTS, []);
    const rep = reports.find((r) => r.id === reportId);
    if (!rep) throw new Error('Report not found.');

    rep.status = status;
    rep.resolution_notes = notes;
    setStored(KEYS.REPORTS, reports);

    return rep;
  },

  getAdminAuditLogs(): AdminAuditLog[] {
    return getStored<AdminAuditLog[]>(KEYS.AUDIT_LOGS, INITIAL_ADMIN_LOGS);
  },

  addAdminAuditLog(log: Omit<AdminAuditLog, 'id' | 'created_at' | 'ip_address'>): void {
    const logs = getStored<AdminAuditLog[]>(KEYS.AUDIT_LOGS, INITIAL_ADMIN_LOGS);
    logs.unshift({
      ...log,
      id: `log-${Date.now()}`,
      ip_address: '106.51.72.18',
      created_at: new Date().toISOString()
    });
    setStored(KEYS.AUDIT_LOGS, logs);
  },

  getAdminMetrics() {
    const users = this.getAllUsers();
    const providers = getStored<ProviderProfile[]>(KEYS.PROVIDERS, INITIAL_PROVIDERS);
    const verifications = this.getVerificationQueue();
    const bookings = this.getAllBookings();
    const reports = this.getReports();

    const totalUsers = users.length;
    const approvedProviders = providers.filter((p) => p.verification_status === 'approved').length;
    const pendingVerifications = verifications.filter((v) => v.status === 'pending').length;
    const totalBookings = bookings.length;
    const completedBookings = bookings.filter((b) => b.status === 'COMPLETED' || b.status === 'CONFIRMED').length;
    const totalRevenueINR = bookings
      .filter((b) => ['CONFIRMED', 'COMPLETED'].includes(b.status))
      .reduce((sum, b) => sum + b.total_amount_inr, 0);
    const openReportsCount = reports.filter((r) => r.status === 'open').length;

    return {
      totalUsers,
      approvedProviders,
      pendingVerifications,
      totalBookings,
      completedBookings,
      totalRevenueINR,
      openReportsCount
    };
  }
};

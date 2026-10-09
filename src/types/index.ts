export type UserRole = 'customer' | 'provider' | 'admin';
export type AccountStatus = 'active' | 'suspended' | 'pending';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export type BookingStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'ACCEPTED'
  | 'PAYMENT_PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'DECLINED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'DISPUTED';

export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded';
export type ReportStatus = 'open' | 'investigating' | 'resolved' | 'dismissed';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone_number?: string;
  gender?: string;
  date_of_birth?: string;
  is_adult_verified: boolean;
  role: UserRole;
  status: AccountStatus;
  created_at: string;
}

export interface ProviderProfile {
  id: string;
  user_id: string;
  display_name: string;
  city: 'Bangalore' | 'Chennai' | 'Coimbatore' | 'Salem' | string;
  locality?: string;
  bio: string;
  languages: string[];
  hourly_rate_inr: number;
  rating: number;
  review_count: number;
  verification_status: VerificationStatus;
  verification_notes?: string;
  is_visible: boolean;
  avatar_url: string;
  permitted_activities: string[];
  created_at: string;
}

export interface VerificationSubmission {
  id: string;
  provider_id: string;
  id_type: 'aadhaar' | 'pan' | 'passport' | 'voter_id';
  id_number_masked: string;
  document_url: string;
  selfie_url: string;
  status: VerificationStatus;
  rejection_reason?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  created_at: string;
}

export interface Activity {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  icon_name: string;
  is_active: boolean;
}

export interface AvailabilitySlot {
  id: string;
  provider_id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  is_booked: boolean;
  is_recurring?: boolean;
}

export interface Booking {
  id: string;
  booking_code: string;
  customer_id: string;
  customer_name: string;
  customer_avatar?: string;
  provider_id: string;
  provider_name: string;
  provider_avatar: string;
  provider_user_id: string;
  slot_id?: string;
  date: string;
  start_time: string;
  end_time: string;
  location_name: string;
  location_address: string;
  activity_name: string;
  hourly_rate_inr: number;
  duration_hours: number;
  total_amount_inr: number;
  platform_fee_inr: number;
  status: BookingStatus;
  customer_notes?: string;
  provider_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  customer_id: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  amount_inr: number;
  currency: string;
  status: PaymentStatus;
  payment_mode?: string;
  created_at: string;
}

export interface Refund {
  id: string;
  payment_id: string;
  booking_id: string;
  amount_inr: number;
  reason: string;
  status: 'requested' | 'approved' | 'processed' | 'rejected';
  created_at: string;
}

export interface Conversation {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_avatar?: string;
  provider_user_id: string;
  provider_name: string;
  provider_avatar?: string;
  booking_id?: string;
  last_message?: string;
  last_message_at: string;
  unread_count: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  customer_name: string;
  customer_avatar?: string;
  provider_id: string;
  rating: number;
  comment: string;
  is_moderated: boolean;
  created_at: string;
}

export interface Favorite {
  id: string;
  customer_id: string;
  provider_id: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'booking';
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reporter_name: string;
  reported_user_id: string;
  reported_user_name: string;
  booking_id?: string;
  reason: string;
  details?: string;
  status: ReportStatus;
  resolution_notes?: string;
  created_at: string;
}

export interface Block {
  id: string;
  blocker_id: string;
  blocked_id: string;
  reason?: string;
  created_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  admin_name: string;
  action: string;
  target_type: string;
  target_id?: string;
  details?: Record<string, any>;
  ip_address: string;
  created_at: string;
}

export interface SearchFilters {
  city: string;
  activity: string;
  language: string;
  maxPrice: number;
  minRating: number;
  date: string;
  sortBy: 'relevance' | 'rating_desc' | 'price_asc' | 'price_desc';
}

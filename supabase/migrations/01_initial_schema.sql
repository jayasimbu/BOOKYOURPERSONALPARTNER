-- Supabase SQL Schema for Companion Connect
-- Version: 1.0.0

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum Types
CREATE TYPE user_role_enum AS ENUM ('customer', 'provider', 'admin');
CREATE TYPE user_status_enum AS ENUM ('active', 'suspended', 'pending');
CREATE TYPE verification_status_enum AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE booking_status_enum AS ENUM (
  'DRAFT', 'PENDING', 'ACCEPTED', 'PAYMENT_PENDING', 
  'CONFIRMED', 'COMPLETED', 'DECLINED', 'CANCELLED', 
  'EXPIRED', 'REFUND_PENDING', 'REFUNDED', 'DISPUTED'
);
CREATE TYPE payment_status_enum AS ENUM ('pending', 'authorized', 'captured', 'failed', 'refunded');
CREATE TYPE report_status_enum AS ENUM ('open', 'investigating', 'resolved', 'dismissed');

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone_number TEXT,
  gender TEXT,
  date_of_birth DATE,
  is_adult_verified BOOLEAN DEFAULT FALSE,
  role user_role_enum DEFAULT 'customer',
  status user_status_enum DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Roles Table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  role user_role_enum NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- 3. Provider Profiles Table
CREATE TABLE IF NOT EXISTS public.provider_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  city TEXT NOT NULL,
  locality TEXT,
  bio TEXT,
  languages TEXT[] DEFAULT '{}',
  hourly_rate_inr NUMERIC(10,2) NOT NULL DEFAULT 500.00,
  rating NUMERIC(3,2) DEFAULT 5.00,
  review_count INT DEFAULT 0,
  verification_status verification_status_enum DEFAULT 'pending',
  verification_notes TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Verification Submissions Table
CREATE TABLE IF NOT EXISTS public.verification_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
  id_type TEXT NOT NULL, -- 'aadhaar', 'pan', 'passport', 'voter_id'
  id_number_masked TEXT NOT NULL,
  document_url TEXT NOT NULL,
  selfie_url TEXT NOT NULL,
  status verification_status_enum DEFAULT 'pending',
  rejection_reason TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Activities Table (Permitted non-sexual activities)
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  icon_name TEXT DEFAULT 'Coffee',
  is_active BOOLEAN DEFAULT TRUE
);

-- 6. Provider Activities Junction Table
CREATE TABLE IF NOT EXISTS public.provider_activities (
  provider_id UUID REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE,
  PRIMARY KEY (provider_id, activity_id)
);

-- 7. Availability Slots Table
CREATE TABLE IF NOT EXISTS public.availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_booked BOOLEAN DEFAULT FALSE,
  is_recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_slot_time CHECK (end_time > start_time)
);

-- 8. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE RESTRICT,
  provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE RESTRICT,
  slot_id UUID REFERENCES public.availability_slots(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location_name TEXT NOT NULL,
  location_address TEXT NOT NULL,
  activity_name TEXT NOT NULL,
  hourly_rate_inr NUMERIC(10,2) NOT NULL,
  duration_hours NUMERIC(4,2) NOT NULL DEFAULT 1.0,
  total_amount_inr NUMERIC(10,2) NOT NULL,
  platform_fee_inr NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  status booking_status_enum NOT NULL DEFAULT 'PENDING',
  customer_notes TEXT,
  provider_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE RESTRICT,
  customer_id UUID NOT NULL REFERENCES public.profiles(user_id),
  razorpay_order_id TEXT UNIQUE NOT NULL,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature TEXT,
  amount_inr NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status payment_status_enum NOT NULL DEFAULT 'pending',
  payment_mode TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Refunds Table
CREATE TABLE IF NOT EXISTS public.refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE RESTRICT,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE RESTRICT,
  amount_inr NUMERIC(10,2) NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'requested', -- 'requested', 'approved', 'processed', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(user_id),
  provider_user_id UUID NOT NULL REFERENCES public.profiles(user_id),
  booking_id UUID REFERENCES public.bookings(id),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Conversation Participants Table
CREATE TABLE IF NOT EXISTS public.conversation_participants (
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (conversation_id, user_id)
);

-- 13. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(user_id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID UNIQUE NOT NULL REFERENCES public.bookings(id) ON DELETE RESTRICT,
  customer_id UUID NOT NULL REFERENCES public.profiles(user_id),
  provider_id UUID NOT NULL REFERENCES public.provider_profiles(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_moderated BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Favorites Table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, provider_id)
);

-- 16. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(user_id),
  reported_user_id UUID NOT NULL REFERENCES public.profiles(user_id),
  booking_id UUID REFERENCES public.bookings(id),
  reason TEXT NOT NULL,
  details TEXT,
  status report_status_enum DEFAULT 'open',
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. Blocks Table
CREATE TABLE IF NOT EXISTS public.blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id)
);

-- 19. Admin Audit Logs Table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.profiles(user_id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_provider_profiles_city ON public.provider_profiles(city);
CREATE INDEX IF NOT EXISTS idx_provider_profiles_status ON public.provider_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_availability_provider_date ON public.availability_slots(provider_id, date);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON public.bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- Row Level Security Setup
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper SQL Function: Double Booking Prevention Check
CREATE OR REPLACE FUNCTION check_double_booking(
  p_provider_id UUID,
  p_date DATE,
  p_start_time TIME,
  p_end_time TIME,
  p_ignore_booking_id UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  v_count INT;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM public.bookings
  WHERE provider_id = p_provider_id
    AND date = p_date
    AND status IN ('ACCEPTED', 'PAYMENT_PENDING', 'CONFIRMED')
    AND (id <> p_ignore_booking_id OR p_ignore_booking_id IS NULL)
    AND (
      (start_time <= p_start_time AND end_time > p_start_time) OR
      (start_time < p_end_time AND end_time >= p_end_time) OR
      (start_time >= p_start_time AND end_time <= p_end_time)
    );
  
  RETURN v_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

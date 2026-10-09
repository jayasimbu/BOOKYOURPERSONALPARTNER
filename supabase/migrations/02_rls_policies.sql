-- Supabase SQL RLS Policies Migration
-- Version: 1.0.2
-- Idempotent, robust least-privilege security policy definitions on all 19 PostgreSQL tables

-- Helper Macro / Pre-drop to guarantee idempotent rerun
DROP POLICY IF EXISTS "Public profiles read access" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin full access profiles" ON public.profiles;

DROP POLICY IF EXISTS "Public user_roles read access" ON public.user_roles;
DROP POLICY IF EXISTS "Admin user_roles access" ON public.user_roles;

DROP POLICY IF EXISTS "Public read approved provider profiles" ON public.provider_profiles;
DROP POLICY IF EXISTS "Providers update own profile" ON public.provider_profiles;
DROP POLICY IF EXISTS "Admin full access provider profiles" ON public.provider_profiles;

DROP POLICY IF EXISTS "Providers insert own submission" ON public.verification_submissions;
DROP POLICY IF EXISTS "Providers read own submission" ON public.verification_submissions;
DROP POLICY IF EXISTS "Admin full access verification submissions" ON public.verification_submissions;

DROP POLICY IF EXISTS "Public read activities" ON public.activities;
DROP POLICY IF EXISTS "Admin edit activities" ON public.activities;

DROP POLICY IF EXISTS "Public read provider_activities" ON public.provider_activities;
DROP POLICY IF EXISTS "Providers update provider_activities" ON public.provider_activities;

DROP POLICY IF EXISTS "Public read availability_slots" ON public.availability_slots;
DROP POLICY IF EXISTS "Providers manage availability_slots" ON public.availability_slots;

DROP POLICY IF EXISTS "Customer view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Customer create booking" ON public.bookings;
DROP POLICY IF EXISTS "Provider view assigned bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admin view all bookings" ON public.bookings;

DROP POLICY IF EXISTS "Participants view payments" ON public.payments;
DROP POLICY IF EXISTS "Admin view all payments" ON public.payments;

DROP POLICY IF EXISTS "Participants view refunds" ON public.refunds;
DROP POLICY IF EXISTS "Admin manage refunds" ON public.refunds;

DROP POLICY IF EXISTS "Participants view conversation" ON public.conversations;
DROP POLICY IF EXISTS "Participants insert conversation" ON public.conversations;

DROP POLICY IF EXISTS "Participants view conversation_participants" ON public.conversation_participants;

DROP POLICY IF EXISTS "Participants view messages" ON public.messages;
DROP POLICY IF EXISTS "Participants send message" ON public.messages;

DROP POLICY IF EXISTS "Public read moderated reviews" ON public.reviews;
DROP POLICY IF EXISTS "Customer create review" ON public.reviews;
DROP POLICY IF EXISTS "Admin moderate reviews" ON public.reviews;

DROP POLICY IF EXISTS "Customer view own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Customer manage favorites" ON public.favorites;

DROP POLICY IF EXISTS "Users view own notifications" ON public.notifications;

DROP POLICY IF EXISTS "Users insert reports" ON public.reports;
DROP POLICY IF EXISTS "Admin view and resolve reports" ON public.reports;

DROP POLICY IF EXISTS "Users manage blocks" ON public.blocks;

DROP POLICY IF EXISTS "Admin view audit logs" ON public.admin_audit_logs;

-- 1. Profiles Table Policies
CREATE POLICY "Public profiles read access" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admin full access profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- 2. User Roles Policies
CREATE POLICY "Public user_roles read access" ON public.user_roles
  FOR SELECT USING (true);

CREATE POLICY "Admin user_roles access" ON public.user_roles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- 3. Provider Profiles Policies
CREATE POLICY "Public read approved provider profiles" ON public.provider_profiles
  FOR SELECT USING (verification_status = 'approved' AND is_visible = true);

CREATE POLICY "Providers update own profile" ON public.provider_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admin full access provider profiles" ON public.provider_profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- 4. Verification Submissions Policies (STRICT DOCUMENT CONFIDENTIALITY)
CREATE POLICY "Providers insert own submission" ON public.verification_submissions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.provider_profiles WHERE id = provider_id AND user_id = auth.uid())
  );

CREATE POLICY "Providers read own submission" ON public.verification_submissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.provider_profiles WHERE id = provider_id AND user_id = auth.uid())
  );

CREATE POLICY "Admin full access verification submissions" ON public.verification_submissions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- 5. Activities Policies
CREATE POLICY "Public read activities" ON public.activities
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin edit activities" ON public.activities
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- 6. Provider Activities Policies
CREATE POLICY "Public read provider_activities" ON public.provider_activities
  FOR SELECT USING (true);

CREATE POLICY "Providers update provider_activities" ON public.provider_activities
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.provider_profiles WHERE id = provider_id AND user_id = auth.uid())
  );

-- 7. Availability Slots Policies
CREATE POLICY "Public read availability_slots" ON public.availability_slots
  FOR SELECT USING (true);

CREATE POLICY "Providers manage availability_slots" ON public.availability_slots
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.provider_profiles WHERE id = provider_id AND user_id = auth.uid())
  );

-- 8. Bookings Policies
CREATE POLICY "Customer view own bookings" ON public.bookings
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Customer create booking" ON public.bookings
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Provider view assigned bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.provider_profiles WHERE id = provider_id AND user_id = auth.uid())
  );

CREATE POLICY "Admin view all bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- 9. Payments & 10. Refunds Policies
CREATE POLICY "Participants view payments" ON public.payments
  FOR SELECT USING (
    customer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.bookings b 
      JOIN public.provider_profiles p ON b.provider_id = p.id 
      WHERE b.id = booking_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin view all payments" ON public.payments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Participants view refunds" ON public.refunds
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings b 
      WHERE b.id = booking_id AND (b.customer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.provider_profiles p WHERE p.id = b.provider_id AND p.user_id = auth.uid()))
    )
  );

CREATE POLICY "Admin manage refunds" ON public.refunds
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- 11. Conversations & 12. Participants & 13. Messages Policies
CREATE POLICY "Participants view conversation" ON public.conversations
  FOR SELECT USING (customer_id = auth.uid() OR provider_user_id = auth.uid());

CREATE POLICY "Participants insert conversation" ON public.conversations
  FOR INSERT WITH CHECK (customer_id = auth.uid() OR provider_user_id = auth.uid());

CREATE POLICY "Participants view conversation_participants" ON public.conversation_participants
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Participants view messages" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations c 
      WHERE c.id = conversation_id AND (c.customer_id = auth.uid() OR c.provider_user_id = auth.uid())
    )
  );

CREATE POLICY "Participants send message" ON public.messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.conversations c 
      WHERE c.id = conversation_id AND (c.customer_id = auth.uid() OR c.provider_user_id = auth.uid())
    )
  );

-- 14. Reviews Policies
CREATE POLICY "Public read moderated reviews" ON public.reviews
  FOR SELECT USING (is_moderated = true);

CREATE POLICY "Customer create review" ON public.reviews
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Admin moderate reviews" ON public.reviews
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- 15. Favorites Policies
CREATE POLICY "Customer view own favorites" ON public.favorites
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Customer manage favorites" ON public.favorites
  FOR ALL USING (customer_id = auth.uid());

-- 16. Notifications Policies
CREATE POLICY "Users view own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

-- 17. Reports Policies
CREATE POLICY "Users insert reports" ON public.reports
  FOR INSERT WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Admin view and resolve reports" ON public.reports
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- 18. Blocks Policies
CREATE POLICY "Users manage blocks" ON public.blocks
  FOR ALL USING (blocker_id = auth.uid());

-- 19. Admin Audit Logs Policies
CREATE POLICY "Admin view audit logs" ON public.admin_audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Storage Buckets Setup & Security Policies
INSERT INTO storage.buckets (id, name, public) 
VALUES ('id-documents', 'id-documents', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Private ID documents access by Admin & Owner" ON storage.objects;

CREATE POLICY "Private ID documents access by Admin & Owner" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'id-documents' AND (
      auth.uid()::text = (storage.foldername(name))[1] OR
      EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
    )
  );

-- Seed Data for Companion Connect
-- Cities: Bangalore, Chennai, Coimbatore, Salem

-- 1. Permitted Non-Sexual Activities
INSERT INTO public.activities (id, name, slug, description, category, icon_name, is_active)
VALUES
  (gen_random_uuid(), 'Coffee & Conversation', 'coffee-conversation', 'Casual meetup over coffee or tea to chat and share stories in a public cafe', 'Social', 'Coffee', true),
  (gen_random_uuid(), 'City Sightseeing & Tours', 'city-sightseeing', 'Guided exploration of historical monuments, parks, and cultural highlights in the city', 'Tourism', 'MapPin', true),
  (gen_random_uuid(), 'Event Companionship', 'event-companionship', 'Attending music concerts, art exhibitions, tech expos, or corporate networking events', 'Events', 'Ticket', true),
  (gen_random_uuid(), 'Restaurant & Dining', 'restaurant-dining', 'Sharing a delicious lunch or dinner at popular restaurants, exploring local cuisine', 'Food', 'Utensils', true),
  (gen_random_uuid(), 'Language & Cultural Exchange', 'cultural-exchange', 'Practice speaking English or Tamil, exchange cultural insights, and learn local customs', 'Learning', 'Languages', true),
  (gen_random_uuid(), 'Shopping & Styling Buddy', 'shopping-buddy', 'Accompaniment to local markets, malls, and boutiques for outfit selection and advice', 'Lifestyle', 'ShoppingBag', true)
ON CONFLICT (slug) DO NOTHING;

-- Demo Profiles & Providers will be dynamically populated in mock data store & seed helpers for local dev.

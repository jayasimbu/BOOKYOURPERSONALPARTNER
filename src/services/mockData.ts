import {
  UserProfile,
  ProviderProfile,
  Activity,
  AvailabilitySlot,
  Booking,
  Payment,
  Review,
  Conversation,
  Message,
  NotificationItem,
  Report,
  VerificationSubmission,
  AdminAuditLog
} from '../types';

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    name: 'Coffee & Conversation',
    slug: 'coffee-conversation',
    description: 'Casual meetup over coffee or tea to discuss books, technology, career, or life in public cafes.',
    category: 'Social',
    icon_name: 'Coffee',
    is_active: true
  },
  {
    id: 'act-2',
    name: 'City Sightseeing & Tours',
    slug: 'city-sightseeing',
    description: 'Guided exploration of historical landmarks, parks, heritage sites, and local secrets.',
    category: 'Tourism',
    icon_name: 'MapPin',
    is_active: true
  },
  {
    id: 'act-3',
    name: 'Event Companionship',
    slug: 'event-companionship',
    description: 'Attending tech summits, live music concerts, theater shows, or art exhibitions together.',
    category: 'Events',
    icon_name: 'Ticket',
    is_active: true
  },
  {
    id: 'act-4',
    name: 'Restaurant & Fine Dining',
    slug: 'restaurant-dining',
    description: 'Exploring food trails, roof-top dining, and trying new authentic regional cuisines.',
    category: 'Food',
    icon_name: 'Utensils',
    is_active: true
  },
  {
    id: 'act-5',
    name: 'Language & Cultural Exchange',
    slug: 'cultural-exchange',
    description: 'Practice conversational English, Tamil, or Hindi while discovering local cultural nuances.',
    category: 'Learning',
    icon_name: 'Languages',
    is_active: true
  },
  {
    id: 'act-6',
    name: 'Shopping & Styling Buddy',
    slug: 'shopping-buddy',
    description: 'Accompaniment to local markets, traditional textile stores, and modern malls for fashion advice.',
    category: 'Lifestyle',
    icon_name: 'ShoppingBag',
    is_active: true
  }
];

export const INITIAL_DEMO_USERS: UserProfile[] = [
  {
    id: 'usr-customer-1',
    user_id: 'usr-customer-1',
    email: 'aravind@example.com',
    full_name: 'Aravind Swaminathan',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    phone_number: '+91 98765 43210',
    gender: 'Male',
    date_of_birth: '1995-06-15',
    is_adult_verified: true,
    role: 'customer',
    status: 'active',
    created_at: '2026-01-10T10:00:00Z'
  },
  {
    id: 'usr-provider-1',
    user_id: 'usr-provider-1',
    email: 'ananya@companionconnect.in',
    full_name: 'Ananya Sharma',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    phone_number: '+91 98400 11223',
    gender: 'Female',
    date_of_birth: '1997-04-20',
    is_adult_verified: true,
    role: 'provider',
    status: 'active',
    created_at: '2026-01-05T09:00:00Z'
  },
  {
    id: 'usr-admin-1',
    user_id: 'usr-admin-1',
    email: 'admin@companionconnect.in',
    full_name: 'Platform Operations Admin',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    phone_number: '+91 90000 00000',
    gender: 'Other',
    date_of_birth: '1990-01-01',
    is_adult_verified: true,
    role: 'admin',
    status: 'active',
    created_at: '2025-12-01T00:00:00Z'
  }
];

export const INITIAL_PROVIDERS: ProviderProfile[] = [
  {
    id: 'prov-1',
    user_id: 'usr-provider-1',
    display_name: 'Ananya Sharma',
    city: 'Bangalore',
    locality: 'Indiranagar & MG Road',
    bio: 'Product UI designer & cafe enthusiast based in Bangalore. Love discussing tech trends, modern architecture, filter coffee, and acoustic indie music. Verified non-sexual companion for cafe meetups & events.',
    languages: ['English', 'Kannada', 'Hindi'],
    hourly_rate_inr: 750,
    rating: 4.95,
    review_count: 28,
    verification_status: 'approved',
    is_visible: true,
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    permitted_activities: ['Coffee & Conversation', 'City Sightseeing & Tours', 'Event Companionship'],
    created_at: '2026-01-05T09:00:00Z'
  },
  {
    id: 'prov-2',
    user_id: 'usr-provider-2',
    display_name: 'Karthik Rajan',
    city: 'Chennai',
    locality: 'Nungambakkam & Besant Nagar',
    bio: 'Architecture student & food explorer in Chennai. Passionate about Dravidian history, beachside cafes, regional South Indian street food, and photography. Always happy to show people around Chennai.',
    languages: ['English', 'Tamil'],
    hourly_rate_inr: 600,
    rating: 4.88,
    review_count: 19,
    verification_status: 'approved',
    is_visible: true,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    permitted_activities: ['Restaurant & Fine Dining', 'Language & Cultural Exchange', 'City Sightseeing & Tours'],
    created_at: '2026-01-08T11:30:00Z'
  },
  {
    id: 'prov-3',
    user_id: 'usr-provider-3',
    display_name: 'Priya Ramanathan',
    city: 'Coimbatore',
    locality: 'Race Course & RS Puram',
    bio: 'Avid reader, classical dance practitioner, and soft skills mentor based in Coimbatore. Excellent conversationalist for quiet coffee meetups, book store visits, and local textile shopping.',
    languages: ['English', 'Tamil'],
    hourly_rate_inr: 650,
    rating: 4.92,
    review_count: 15,
    verification_status: 'approved',
    is_visible: true,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    permitted_activities: ['Coffee & Conversation', 'Shopping & Styling Buddy', 'Language & Cultural Exchange'],
    created_at: '2026-01-12T14:20:00Z'
  },
  {
    id: 'prov-4',
    user_id: 'usr-provider-4',
    display_name: 'Vidyut Varma',
    city: 'Bangalore',
    locality: 'Koramangala & HSR Layout',
    bio: 'Startup founder & outdoor photographer. Great buddy for attending tech expos, concert events, co-working sessions, and discovering craft breweries in Bangalore.',
    languages: ['English', 'Hindi', 'Telugu'],
    hourly_rate_inr: 800,
    rating: 4.90,
    review_count: 22,
    verification_status: 'approved',
    is_visible: true,
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    permitted_activities: ['Event Companionship', 'Restaurant & Fine Dining', 'City Sightseeing & Tours'],
    created_at: '2026-01-15T16:00:00Z'
  },
  {
    id: 'prov-5',
    user_id: 'usr-provider-5',
    display_name: 'Divya Sundaram',
    city: 'Salem',
    locality: 'Fairlands & Hasthampatti',
    bio: 'Postgraduate literature student in Salem. Passionate about Tamil literature, historical temples, traditional silk markets, and quiet garden coffee conversations.',
    languages: ['English', 'Tamil'],
    hourly_rate_inr: 500,
    rating: 4.85,
    review_count: 11,
    verification_status: 'approved',
    is_visible: true,
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    permitted_activities: ['Coffee & Conversation', 'Language & Cultural Exchange', 'City Sightseeing & Tours'],
    created_at: '2026-01-18T10:15:00Z'
  },
  {
    id: 'prov-6',
    user_id: 'usr-provider-6',
    display_name: 'Meera Nair',
    city: 'Chennai',
    locality: 'Adyar & ECR',
    bio: 'Art curator and yoga practitioner residing near ECR Chennai. Enjoys gallery walks, beachside breakfast meetups, and hosting cultural exchange conversations.',
    languages: ['English', 'Tamil', 'Malayalam'],
    hourly_rate_inr: 700,
    rating: 4.98,
    review_count: 34,
    verification_status: 'approved',
    is_visible: true,
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
    permitted_activities: ['Event Companionship', 'Restaurant & Fine Dining', 'Language & Cultural Exchange'],
    created_at: '2026-01-20T08:45:00Z'
  }
];

export const INITIAL_VERIFICATIONS: VerificationSubmission[] = [
  {
    id: 'verif-1',
    provider_id: 'prov-1',
    id_type: 'aadhaar',
    id_number_masked: 'XXXX-XXXX-4892',
    document_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
    selfie_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    status: 'approved',
    reviewed_at: '2026-01-06T11:00:00Z',
    reviewed_by: 'usr-admin-1',
    created_at: '2026-01-05T10:00:00Z'
  },
  {
    id: 'verif-pending-1',
    provider_id: 'prov-5',
    id_type: 'passport',
    id_number_masked: 'T890XXXX12',
    document_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
    selfie_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    status: 'pending',
    created_at: '2026-02-01T14:30:00Z'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-1001',
    booking_code: 'CC-2026-9812',
    customer_id: 'usr-customer-1',
    customer_name: 'Aravind Swaminathan',
    customer_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    provider_id: 'prov-1',
    provider_name: 'Ananya Sharma',
    provider_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500',
    provider_user_id: 'usr-provider-1',
    date: '2026-10-15',
    start_time: '16:00',
    end_time: '18:00',
    location_name: 'Third Wave Coffee, Indiranagar',
    location_address: '100 Feet Rd, Indiranagar, Bangalore, KA 560038',
    activity_name: 'Coffee & Conversation',
    hourly_rate_inr: 750,
    duration_hours: 2,
    total_amount_inr: 1500,
    platform_fee_inr: 225,
    status: 'CONFIRMED',
    customer_notes: 'Looking forward to discussing startup UI designs and cafe spots in Indiranagar.',
    provider_notes: 'Confirmed slot. I will be at the 1st floor outdoor seating.',
    created_at: '2026-10-08T12:00:00Z',
    updated_at: '2026-10-08T12:30:00Z'
  },
  {
    id: 'bk-1002',
    booking_code: 'CC-2026-4410',
    customer_id: 'usr-customer-1',
    customer_name: 'Aravind Swaminathan',
    customer_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    provider_id: 'prov-2',
    provider_name: 'Karthik Rajan',
    provider_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
    provider_user_id: 'usr-provider-2',
    date: '2026-10-20',
    start_time: '18:30',
    end_time: '20:30',
    location_name: 'Sangeetha Restaurant, Nungambakkam',
    location_address: 'Nungambakkam High Rd, Chennai, TN 600034',
    activity_name: 'Restaurant & Fine Dining',
    hourly_rate_inr: 600,
    duration_hours: 2,
    total_amount_inr: 1200,
    platform_fee_inr: 180,
    status: 'PENDING',
    customer_notes: 'Would love to explore traditional South Indian dinner choices in Chennai.',
    created_at: '2026-10-09T09:15:00Z',
    updated_at: '2026-10-09T09:15:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    booking_id: 'bk-1001',
    customer_id: 'usr-customer-1',
    customer_name: 'Aravind S.',
    customer_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    provider_id: 'prov-1',
    rating: 5,
    comment: 'Ananya was extremely polite, punctual, and insightful! We had a fantastic 2-hour conversation about technology, mobile apps, and Bangalore cafe culture. 100% professional and respectful.',
    is_moderated: true,
    created_at: '2026-10-01T18:00:00Z'
  },
  {
    id: 'rev-2',
    booking_id: 'bk-historical-2',
    customer_id: 'usr-customer-2',
    customer_name: 'Rajesh K.',
    customer_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    provider_id: 'prov-2',
    rating: 5,
    comment: 'Karthik gave me an incredible historical tour around Kapaleeshwarar temple and Marina beach in Chennai. Very safe and wonderful company.',
    is_moderated: true,
    created_at: '2026-09-25T14:20:00Z'
  }
];

export const INITIAL_ADMIN_LOGS: AdminAuditLog[] = [
  {
    id: 'log-1',
    admin_id: 'usr-admin-1',
    admin_name: 'Platform Operations Admin',
    action: 'APPROVE_PROVIDER_VERIFICATION',
    target_type: 'provider_profile',
    target_id: 'prov-1',
    details: { provider_name: 'Ananya Sharma', id_type: 'aadhaar' },
    ip_address: '106.51.72.18',
    created_at: '2026-01-06T11:00:00Z'
  },
  {
    id: 'log-2',
    admin_id: 'usr-admin-1',
    admin_name: 'Platform Operations Admin',
    action: 'UPDATE_SYSTEM_SETTINGS',
    target_type: 'platform_config',
    details: { fee_percentage: 15, razorpay_mode: 'test' },
    ip_address: '106.51.72.18',
    created_at: '2026-01-10T15:30:00Z'
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    customer_id: 'usr-customer-1',
    customer_name: 'Aravind Swaminathan',
    customer_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    provider_user_id: 'usr-provider-1',
    provider_name: 'Ananya Sharma',
    provider_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500',
    booking_id: 'bk-1001',
    last_message: 'Hi Aravind! I confirmed our coffee meetup at Third Wave Coffee for Oct 15th.',
    last_message_at: '2026-10-08T12:35:00Z',
    unread_count: 0
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    conversation_id: 'conv-1',
    sender_id: 'usr-customer-1',
    sender_name: 'Aravind Swaminathan',
    sender_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    content: 'Hello Ananya! Looking forward to our coffee meetup next week in Indiranagar.',
    is_read: true,
    created_at: '2026-10-08T12:30:00Z'
  },
  {
    id: 'msg-2',
    conversation_id: 'conv-1',
    sender_id: 'usr-provider-1',
    sender_name: 'Ananya Sharma',
    sender_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500',
    content: 'Hi Aravind! I confirmed our coffee meetup at Third Wave Coffee for Oct 15th.',
    is_read: true,
    created_at: '2026-10-08T12:35:00Z'
  }
];

// Supabase Edge Function: Create Razorpay Order
// Language: Deno / TypeScript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID') || 'rzp_test_Tll3SrAzWW4Kx5';
const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify JWT user auth
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized user request' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { booking_id } = await req.json();
    if (!booking_id) {
      return new Response(JSON.stringify({ error: 'Missing booking_id parameter' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch booking details from database
    const { data: booking, error: bookingErr } = await supabaseClient
      .from('bookings')
      .select('*')
      .eq('id', booking_id)
      .single();

    if (bookingErr || !booking) {
      return new Response(JSON.stringify({ error: 'Booking record not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Ownership Check: Customer requesting order must match booking customer_id
    if (booking.customer_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Forbidden: You do not own this booking' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Status Check: Booking must be ACCEPTED or PAYMENT_PENDING
    if (!['ACCEPTED', 'PAYMENT_PENDING'].includes(booking.status)) {
      return new Response(JSON.stringify({ error: `Booking status '${booking.status}' cannot accept payment` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Server-Side Price Calculation (Amount in paise)
    const amountPaise = Math.round(Number(booking.total_amount_inr) * 100);
    if (amountPaise < 100) {
      return new Response(JSON.stringify({ error: 'Booking amount must be at least 100 paise (₹1.00)' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Basic Auth header for Razorpay API
    const credentials = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: 'INR',
        receipt: `bk_${booking.id.slice(0, 8)}`,
        payment_capture: 1,
      }),
    });

    if (!rzpRes.ok) {
      const errorData = await rzpRes.json();
      return new Response(JSON.stringify({ error: errorData.error?.description || 'Razorpay order creation failed' }), {
        status: rzpRes.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const orderData = await rzpRes.json();

    // Create payment record in database
    await supabaseClient.from('payments').insert({
      booking_id: booking.id,
      customer_id: user.id,
      razorpay_order_id: orderData.id,
      amount_inr: booking.total_amount_inr,
      currency: 'INR',
      status: 'pending',
    });

    // Transition booking state to PAYMENT_PENDING
    await supabaseClient
      .from('bookings')
      .update({ status: 'PAYMENT_PENDING', updated_at: new Date().toISOString() })
      .eq('id', booking.id);

    return new Response(
      JSON.stringify({
        order_id: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        key_id: RAZORPAY_KEY_ID,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

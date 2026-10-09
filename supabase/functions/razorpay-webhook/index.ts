// Supabase Edge Function: Razorpay Webhook Handler
// Language: Deno / TypeScript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const RAZORPAY_WEBHOOK_SECRET = Deno.env.get('RAZORPAY_WEBHOOK_SECRET') || 'test_webhook_secret';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Helper for HMAC SHA256 signature calculation
async function verifySignature(body: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const hexBytes = new Uint8Array(signature.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
  return await crypto.subtle.verify('HMAC', key, hexBytes, encoder.encode(body));
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const signature = req.headers.get('x-razorpay-signature');
    const rawBody = await req.text();

    if (!signature) {
      return new Response(JSON.stringify({ error: 'Missing Razorpay signature' }), { status: 400 });
    }

    // Verify Webhook Signature
    const isValid = await verifySignature(rawBody, signature, RAZORPAY_WEBHOOK_SECRET);
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid webhook signature' }), { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    const refundEntity = payload.payload?.refund?.entity;

    const razorpayOrderId = paymentEntity?.order_id;
    const razorpayPaymentId = paymentEntity?.id || refundEntity?.payment_id;

    if (!razorpayOrderId && !razorpayPaymentId) {
      return new Response(JSON.stringify({ message: 'No payment or order entity found' }), { status: 200 });
    }

    // Idempotency check in Supabase database
    if (razorpayPaymentId && event === 'payment.captured') {
      const { data: existingPayment } = await supabase
        .from('payments')
        .select('*')
        .eq('razorpay_payment_id', razorpayPaymentId)
        .single();

      if (existingPayment && existingPayment.status === 'captured') {
        return new Response(JSON.stringify({ message: 'Event already processed (Idempotent)' }), { status: 200 });
      }
    }

    if (event === 'payment.captured') {
      // Find booking payment
      const { data: paymentRecord } = await supabase
        .from('payments')
        .select('*')
        .eq('razorpay_order_id', razorpayOrderId)
        .single();

      if (paymentRecord) {
        // Update Payment Record
        await supabase
          .from('payments')
          .update({
            razorpay_payment_id: razorpayPaymentId,
            status: 'captured',
            payment_mode: paymentEntity?.method
          })
          .eq('id', paymentRecord.id);

        // Update Booking Status to CONFIRMED
        await supabase
          .from('bookings')
          .update({ status: 'CONFIRMED', updated_at: new Date().toISOString() })
          .eq('id', paymentRecord.booking_id);
      }
    } else if (event === 'payment.failed') {
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('razorpay_order_id', razorpayOrderId);
    } else if (event === 'refund.created' || event === 'refund.processed') {
      const targetPaymentId = refundEntity?.payment_id;

      if (targetPaymentId) {
        const { data: paymentRecord } = await supabase
          .from('payments')
          .select('*')
          .eq('razorpay_payment_id', targetPaymentId)
          .single();

        if (paymentRecord) {
          const refundAmountPaise = refundEntity?.amount || 0;
          const totalAmountPaise = Math.round((paymentRecord.amount_inr || 0) * 100);
          const refundStatus = refundEntity?.status || 'processed';
          const isFullRefund = refundAmountPaise >= totalAmountPaise;

          // Record refund audit in public.refunds table
          await supabase.from('refunds').insert({
            payment_id: paymentRecord.id,
            booking_id: paymentRecord.booking_id,
            amount_inr: refundAmountPaise / 100,
            reason: refundEntity?.notes?.reason || 'Razorpay webhook refund',
            status: refundStatus === 'processed' ? 'processed' : 'requested'
          });

          // Transition payment and booking status only if fully processed
          if (refundStatus === 'processed' && isFullRefund) {
            await supabase
              .from('payments')
              .update({ status: 'refunded' })
              .eq('id', paymentRecord.id);

            await supabase
              .from('bookings')
              .update({ status: 'REFUNDED', updated_at: new Date().toISOString() })
              .eq('id', paymentRecord.booking_id);
          } else if (refundStatus !== 'processed') {
            await supabase
              .from('bookings')
              .update({ status: 'REFUND_PENDING', updated_at: new Date().toISOString() })
              .eq('id', paymentRecord.booking_id);
          }
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});

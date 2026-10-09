import { describe, it, expect, beforeEach } from 'vitest';
import { ApiService } from '../services/api';
import { RazorpayBackendService } from '../services/razorpayService';

describe('Companion Connect Platform Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('1. Authentication and role-based account initialization', () => {
    const customer = ApiService.register('Test Customer', 'testcustomer@example.com', 'customer', true);
    expect(customer.role).toBe('customer');
    expect(customer.is_adult_verified).toBe(true);

    const loggedIn = ApiService.login('testcustomer@example.com', 'customer');
    expect(loggedIn.email).toBe('testcustomer@example.com');
  });

  it('2. Rejects registration if 18+ adult eligibility check fails', () => {
    expect(() => {
      ApiService.register('Underage User', 'minor@example.com', 'customer', false);
    }).toThrow('You must be 18 years or older');
  });

  it('3. Provider discovery and city search filtering', () => {
    const blrProviders = ApiService.getProviders({ city: 'Bangalore' });
    expect(blrProviders.every((p) => p.city === 'Bangalore')).toBe(true);

    const priceFiltered = ApiService.getProviders({ maxPrice: 650 });
    expect(priceFiltered.every((p) => p.hourly_rate_inr <= 650)).toBe(true);
  });

  it('4. Booking creation & Double-booking prevention check', () => {
    const booking = ApiService.createBooking({
      customer_id: 'usr-customer-1',
      customer_name: 'Aravind Swaminathan',
      provider_id: 'prov-1',
      date: '2026-11-01',
      start_time: '14:00',
      end_time: '16:00',
      location_name: 'Third Wave Coffee',
      location_address: 'Indiranagar',
      activity_name: 'Coffee & Conversation',
      duration_hours: 2
    });

    expect(booking.status).toBe('PENDING');

    // Provider accepts booking
    const accepted = ApiService.updateBookingStatus(booking.id, 'ACCEPTED');
    expect(accepted.status).toBe('ACCEPTED');

    // Attempting another booking at the same overlapping slot must be rejected by double booking engine
    expect(() => {
      ApiService.createBooking({
        customer_id: 'usr-customer-2',
        customer_name: 'Second Customer',
        provider_id: 'prov-1',
        date: '2026-11-01',
        start_time: '15:00',
        end_time: '17:00',
        location_name: 'Starbucks',
        location_address: 'MG Road',
        activity_name: 'Coffee & Conversation',
        duration_hours: 2
      });
    }).toThrow('already booked');
  });

  it('5. Razorpay server order creation and payment signature verification', async () => {
    const booking = ApiService.createBooking({
      customer_id: 'usr-customer-1',
      customer_name: 'Aravind Swaminathan',
      provider_id: 'prov-1',
      date: '2026-11-05',
      start_time: '18:00',
      end_time: '20:00',
      location_name: 'Cafe Coffee Day',
      location_address: 'Koramangala',
      activity_name: 'Coffee & Conversation',
      duration_hours: 2
    });

    // Companion accepts
    ApiService.updateBookingStatus(booking.id, 'ACCEPTED');

    // Razorpay Order creation
    const order = await ApiService.createRazorpayOrder(booking.id);
    expect(order.order_id).toBeDefined();

    // Generate valid HMAC SHA256 signature for test order
    const paymentId = 'pay_test_98765';
    const secret = process.env.RAZORPAY_KEY_SECRET || 'LPVBUgWftn0mIoKq3umxHUjN';
    const crypto = await import('crypto');
    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(`${order.order_id}|${paymentId}`)
      .digest('hex');

    // Signature verification transitions status to CONFIRMED
    const confirmedBooking = await ApiService.verifyRazorpayPayment(
      booking.id,
      order.order_id,
      paymentId,
      validSignature
    );

    expect(confirmedBooking.status).toBe('CONFIRMED');
  });

  it('6. Rejects tampered / invalid Razorpay payment signature', () => {
    expect(() => {
      RazorpayBackendService.verifyPaymentSignature({
        razorpay_order_id: 'order_test_123',
        razorpay_payment_id: 'pay_test_456',
        razorpay_signature: 'invalid_tampered_signature_hex'
      });
    }).toThrow();
  });

  it('7. Rejects Razorpay order creation with invalid or tampered amount (< 100 paise)', async () => {
    await expect(
      RazorpayBackendService.createOrder({
        amountPaise: 50, // Less than 100 paise minimum
        currency: 'INR'
      })
    ).rejects.toMatchObject({ status: 400 });
  });

  it('8. Provider ID verification review & admin audit log', () => {
    const sub = ApiService.submitVerification({
      provider_id: 'prov-5',
      id_type: 'passport',
      id_number_masked: 'XXXX-1234',
      document_url: 'https://example.com/doc.jpg',
      selfie_url: 'https://example.com/selfie.jpg'
    });

    expect(sub.status).toBe('pending');

    // Admin approves verification
    const reviewed = ApiService.reviewVerification(sub.id, 'approved', undefined, 'usr-admin-1');
    expect(reviewed.status).toBe('approved');

    // Verify admin audit log entry
    const logs = ApiService.getAdminAuditLogs();
    expect(logs.some((l) => l.action === 'APPROVE_PROVIDER_VERIFICATION')).toBe(true);
  });

  it('9. Safety Report submission & resolution', () => {
    const report = ApiService.submitReport({
      reporter_id: 'usr-customer-1',
      reporter_name: 'Aravind',
      reported_user_id: 'usr-provider-2',
      reported_user_name: 'Karthik',
      reason: 'Inappropriate content',
      details: 'Test safety concern'
    });

    expect(report.status).toBe('open');

    const resolved = ApiService.resolveReport(report.id, 'resolved', 'Handled by admin');
    expect(resolved.status).toBe('resolved');
  });

  it('10. User account suspension by platform administrator', () => {
    const user = ApiService.updateUserAccountStatus('usr-customer-1', 'suspended');
    expect(user.status).toBe('suspended');
  });
});

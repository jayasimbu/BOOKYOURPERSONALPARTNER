import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { BrowseCompanionsPage } from './pages/public/BrowseCompanionsPage';
import { CompanionProfilePage } from './pages/public/CompanionProfilePage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { SafetyGuidelinesPage } from './pages/public/SafetyGuidelinesPage';
import { TermsOfServicePage } from './pages/public/TermsOfServicePage';
import { PrivacyPolicyPage } from './pages/public/PrivacyPolicyPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// Customer Dashboard Pages
import { CustomerOverviewPage } from './pages/customer/CustomerOverviewPage';
import { MyBookingsPage } from './pages/customer/MyBookingsPage';
import { BookingCheckoutPage } from './pages/customer/BookingCheckoutPage';
import { MessagesPage } from './pages/customer/MessagesPage';
import { SavedProfilesPage } from './pages/customer/SavedProfilesPage';
import { CustomerSettingsPage } from './pages/customer/CustomerSettingsPage';
import { CustomerSupportPage } from './pages/customer/CustomerSupportPage';

// Provider Dashboard Pages
import { ProviderOverviewPage } from './pages/provider/ProviderOverviewPage';
import { ProviderProfileSetupPage } from './pages/provider/ProviderProfileSetupPage';
import { ProviderVerificationPage } from './pages/provider/ProviderVerificationPage';
import { ProviderRequestsPage } from './pages/provider/ProviderRequestsPage';
import { ProviderEarningsPage } from './pages/provider/ProviderEarningsPage';

// Admin Dashboard Pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminVerificationQueuePage } from './pages/admin/AdminVerificationQueuePage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

const PublicLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen bg-[#0B1020]">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Navbar and Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/companions" element={<BrowseCompanionsPage />} />
            <Route path="/companions/:id" element={<CompanionProfilePage />} />
            <Route path="/safety" element={<SafetyGuidelinesPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Customer Protected Dashboard Routes */}
          <Route
            path="/dashboard/customer"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CustomerOverviewPage />} />
            <Route path="bookings" element={<MyBookingsPage />} />
            <Route path="checkout/:bookingId" element={<BookingCheckoutPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="favorites" element={<SavedProfilesPage />} />
            <Route path="settings" element={<CustomerSettingsPage />} />
            <Route path="support" element={<CustomerSupportPage />} />
          </Route>

          {/* Provider Protected Dashboard Routes */}
          <Route
            path="/dashboard/provider"
            element={
              <ProtectedRoute allowedRoles={['provider']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProviderOverviewPage />} />
            <Route path="profile" element={<ProviderProfileSetupPage />} />
            <Route path="verification" element={<ProviderVerificationPage />} />
            <Route path="requests" element={<ProviderRequestsPage />} />
            <Route path="earnings" element={<ProviderEarningsPage />} />
          </Route>

          {/* Admin Protected Dashboard Routes */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverviewPage />} />
            <Route path="verification" element={<AdminVerificationQueuePage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="audit-logs" element={<AdminAuditLogsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

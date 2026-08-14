import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute, RoleGuard, USER_ROLES } from './features/auth';

/* ── Layouts ── */
import PublicLayout from './layouts/PublicLayout';
import AuthLayout  from './layouts/AuthLayout';
import FarmerLayout from './layouts/FarmerLayout';
import OwnerLayout  from './layouts/OwnerLayout';
import AdminLayout  from './layouts/AdminLayout';

/* ── Public Pages ── */
const WelcomePage = React.lazy(() => import('./pages/public/WelcomePage'));
const ExplorePage = React.lazy(() => import('./pages/public/ExplorePage'));

/* ── Auth Module Pages ── */
const RoleSelectionPage = React.lazy(() => import('./pages/auth/RoleSelectionPage'));
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/auth/ForgotPasswordPage'));
const OTPVerificationPage = React.lazy(() => import('./pages/auth/OTPVerificationPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/auth/ResetPasswordPage'));
const VerifySuccessPage = React.lazy(() => import('./pages/auth/VerifySuccessPage'));

/* ── Legacy Auth Route Wrappers ── */
const FarmerLogin = React.lazy(() => import('./pages/auth/FarmerLogin'));
const FarmerRegister = React.lazy(() => import('./pages/auth/FarmerRegister'));
const OwnerLogin = React.lazy(() => import('./pages/auth/OwnerLogin'));
const OwnerRegister = React.lazy(() => import('./pages/auth/OwnerRegister'));
const AdminLogin = React.lazy(() => import('./pages/auth/AdminLogin'));

/* ── Farmer Pages ── */
const FarmerDashboard = React.lazy(() => import('./pages/farmer/FarmerDashboard'));
const EquipmentSearch = React.lazy(() => import('./pages/farmer/EquipmentSearch'));
const EquipmentDetail = React.lazy(() => import('./pages/farmer/EquipmentDetail'));
const EquipmentAvailabilityPage = React.lazy(() => import('./pages/farmer/EquipmentAvailabilityPage'));
const RentalDurationPage = React.lazy(() => import('./pages/farmer/RentalDurationPage'));
const BookingConfirm = React.lazy(() => import('./pages/farmer/BookingConfirm'));
const MarketplacePage = React.lazy(() => import('./pages/farmer/MarketplacePage'));
const ProductDetail = React.lazy(() => import('./pages/farmer/ProductDetail'));
const CartPage = React.lazy(() => import('./pages/farmer/CartPage'));
const CheckoutPage = React.lazy(() => import('./pages/farmer/CheckoutPage'));
const PaymentPage = React.lazy(() => import('./pages/farmer/PaymentPage'));
const OrderSuccessPage = React.lazy(() => import('./pages/farmer/OrderSuccessPage'));
const MyOrdersPage = React.lazy(() => import('./pages/farmer/MyOrdersPage'));
const SprayerServices = React.lazy(() => import('./pages/farmer/SprayerServices'));
const SprayerDetail = React.lazy(() => import('./pages/farmer/SprayerDetail'));
const ServiceBookingTimePage = React.lazy(() => import('./pages/farmer/ServiceBookingTimePage'));
const ServiceLocationPage = React.lazy(() => import('./pages/farmer/ServiceLocationPage'));
const ServiceBookingSummaryPage = React.lazy(() => import('./pages/farmer/ServiceBookingSummaryPage'));
const ServiceBookingSuccessPage = React.lazy(() => import('./pages/farmer/ServiceBookingSuccessPage'));
const SprayerHistoryPage = React.lazy(() => import('./pages/farmer/SprayerHistoryPage'));
const BookingHistory = React.lazy(() => import('./pages/farmer/BookingHistory'));
const AiDoctorHome = React.lazy(() => import('./pages/farmer/AiDoctorHome'));
const AiDoctorUpload = React.lazy(() => import('./pages/farmer/AiDoctorUpload'));
const AiDoctorResult = React.lazy(() => import('./pages/farmer/AiDoctorResult'));
const AiDoctorReport = React.lazy(() => import('./pages/farmer/AiDoctorReport'));
const AiDoctorHistory = React.lazy(() => import('./pages/farmer/AiDoctorHistory'));
const FarmerProfilePage = React.lazy(() => import('./pages/farmer/FarmerProfilePage'));
const EditProfilePage = React.lazy(() => import('./pages/farmer/EditProfilePage'));
const NotificationsPage = React.lazy(() => import('./pages/farmer/NotificationsPage'));
const SettingsPage = React.lazy(() => import('./pages/farmer/SettingsPage'));

/* ── Owner Pages ── */
const OwnerDashboard = React.lazy(() => import('./pages/owner/OwnerDashboard'));
const OwnerEquipment = React.lazy(() => import('./pages/owner/OwnerEquipment'));
const AddEquipment = React.lazy(() => import('./pages/owner/AddEquipment'));
const EditEquipment = React.lazy(() => import('./pages/owner/EditEquipment'));
const OwnerBookings = React.lazy(() => import('./pages/owner/OwnerBookings'));
const OwnerCalendar = React.lazy(() => import('./pages/owner/OwnerCalendar'));
const OwnerEarnings = React.lazy(() => import('./pages/owner/OwnerEarnings'));
const OwnerReviews = React.lazy(() => import('./pages/owner/OwnerReviews'));
const OwnerNotifications = React.lazy(() => import('./pages/owner/OwnerNotifications'));
const OwnerProfile = React.lazy(() => import('./pages/owner/OwnerProfile'));
const OwnerEditProfile = React.lazy(() => import('./pages/owner/OwnerEditProfile'));


/* ── Operator Pages ── */
import OperatorLayout         from './layouts/OperatorLayout';
const OperatorDashboard = React.lazy(() => import('./pages/operator/OperatorDashboard'));
const OperatorJobs = React.lazy(() => import('./pages/operator/OperatorJobs'));
const OperatorJobDetails = React.lazy(() => import('./pages/operator/OperatorJobDetails'));
const OperatorCalendar = React.lazy(() => import('./pages/operator/OperatorCalendar'));
const OperatorEarnings = React.lazy(() => import('./pages/operator/OperatorEarnings'));
const OperatorCustomers = React.lazy(() => import('./pages/operator/OperatorCustomers'));
const OperatorReviews = React.lazy(() => import('./pages/operator/OperatorReviews'));
const OperatorNotifications = React.lazy(() => import('./pages/operator/OperatorNotifications'));
const OperatorProfile = React.lazy(() => import('./pages/operator/OperatorProfile'));
const OperatorEditProfile = React.lazy(() => import('./pages/operator/OperatorEditProfile'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const UserManagement = React.lazy(() => import('./pages/admin/UserManagement'));
const AdminVerifications = React.lazy(() => import('./pages/admin/AdminVerifications'));
const AdminEquipment = React.lazy(() => import('./pages/admin/AdminEquipment'));
const AdminMarketplace = React.lazy(() => import('./pages/admin/AdminMarketplace'));
const AdminBookings = React.lazy(() => import('./pages/admin/AdminBookings'));
const AdminPayments = React.lazy(() => import('./pages/admin/AdminPayments'));
const AdminAiReports = React.lazy(() => import('./pages/admin/AdminAiReports'));
const AdminReviews = React.lazy(() => import('./pages/admin/AdminReviews'));
const AdminSupport = React.lazy(() => import('./pages/admin/AdminSupport'));
const AdminNotifications = React.lazy(() => import('./pages/admin/AdminNotifications'));
const AdminReports = React.lazy(() => import('./pages/admin/AdminReports'));
const AdminActivityLogs = React.lazy(() => import('./pages/admin/AdminActivityLogs'));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings'));
const AdminProfile = React.lazy(() => import('./pages/admin/AdminProfile'));

/* ── Guards Imported from Auth Feature ── */

export default function App() {
  return (
    <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
      <Routes>
      {/* ═══════════════════════════════════════
          PUBLIC PAGES (No Auth Required)
         ═══════════════════════════════════════ */}
      <Route element={<PublicLayout />}>
        <Route index element={<WelcomePage />} />
        <Route path="explore" element={<ExplorePage />} />
      </Route>

      {/* ═══════════════════════════════════════
          AUTHENTICATION MODULE (Dark Premium Layout)
         ═══════════════════════════════════════ */}
      <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
        {/* Core Auth Routes */}
        <Route path="auth/select-role"     element={<RoleSelectionPage />} />
        <Route path="auth/login"           element={<LoginPage />} />
        <Route path="auth/register"        element={<RegisterPage />} />
        <Route path="auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="auth/verify-otp"      element={<OTPVerificationPage />} />
        <Route path="auth/reset-password"  element={<ResetPasswordPage />} />
        <Route path="auth/verify-success"  element={<VerifySuccessPage />} />

        {/* Role Specific Shortcuts */}
        <Route path="farmer/login"    element={<FarmerLogin />} />
        <Route path="farmer/register" element={<FarmerRegister />} />
        <Route path="owner/login"     element={<OwnerLogin />} />
        <Route path="owner/register"  element={<OwnerRegister />} />
        <Route path="sprayer/login"   element={<LoginPage initialRole="sprayer" />} />
        <Route path="sprayer/register" element={<RegisterPage initialRole="sprayer" />} />
        <Route path="admin/login"     element={<AdminLogin />} />
      </Route>

      {/* ═══════════════════════════════════════
          FARMER APP (Role: FARMER / SPRAYER)
         ═══════════════════════════════════════ */}
      <Route path="farmer" element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={[USER_ROLES.FARMER, USER_ROLES.SPRAYER, USER_ROLES.ADMIN]}>
            <FarmerLayout />
          </RoleGuard>
        </ProtectedRoute>
      }>
        <Route path="dashboard"                 element={<FarmerDashboard />} />
        <Route path="equipment"                 element={<EquipmentSearch />} />
        <Route path="equipment/:id"             element={<EquipmentDetail />} />
        <Route path="equipment/:id/availability" element={<EquipmentAvailabilityPage />} />
        <Route path="equipment/:id/duration"    element={<RentalDurationPage />} />
        <Route path="equipment/:id/book"        element={<BookingConfirm />} />
        <Route path="marketplace"        element={<MarketplacePage />} />
        <Route path="marketplace/:id"    element={<ProductDetail />} />
        <Route path="cart"               element={<CartPage />} />
        <Route path="checkout"           element={<CheckoutPage />} />
        <Route path="payment"            element={<PaymentPage />} />
        <Route path="order-success"      element={<OrderSuccessPage />} />
        <Route path="orders"             element={<MyOrdersPage />} />
        <Route path="sprayers"           element={<SprayerServices />} />
        <Route path="sprayers/:id"       element={<SprayerDetail />} />
        <Route path="sprayers/:id/book-time" element={<ServiceBookingTimePage />} />
        <Route path="sprayers/:id/location" element={<ServiceLocationPage />} />
        <Route path="sprayers/:id/review"   element={<ServiceBookingSummaryPage />} />
        <Route path="sprayers/history"      element={<SprayerHistoryPage />} />
        <Route path="sprayers/success"      element={<ServiceBookingSuccessPage />} />
        <Route path="bookings"           element={<BookingHistory />} />
        <Route path="ai-doctor"          element={<AiDoctorHome />} />
        <Route path="ai-doctor/upload"   element={<AiDoctorUpload />} />
        <Route path="ai-doctor/result/:id" element={<AiDoctorResult />} />
        <Route path="ai-doctor/report/:id" element={<AiDoctorReport />} />
        <Route path="ai-doctor/history"  element={<AiDoctorHistory />} />
        <Route path="notifications"      element={<NotificationsPage />} />
        <Route path="messages"          element={<FarmerDashboard />} />
        <Route path="profile"            element={<FarmerProfilePage />} />
        <Route path="profile/edit"       element={<EditProfilePage />} />
        <Route path="settings"           element={<SettingsPage />} />
      </Route>

      {/* ═══════════════════════════════════════
          OWNER APP (Role: EQUIPMENT_OWNER)
         ═══════════════════════════════════════ */}
      <Route path="owner" element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={[USER_ROLES.EQUIPMENT_OWNER, USER_ROLES.ADMIN]}>
            <OwnerLayout />
          </RoleGuard>
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"          element={<OwnerDashboard />} />
        <Route path="equipment"          element={<OwnerEquipment />} />
        <Route path="equipment/add"      element={<AddEquipment />} />
        <Route path="equipment/edit/:id" element={<EditEquipment />} />
        <Route path="bookings"           element={<OwnerBookings />} />
        <Route path="calendar"           element={<OwnerCalendar />} />
        <Route path="earnings"           element={<OwnerEarnings />} />
        <Route path="reviews"            element={<OwnerReviews />} />
        <Route path="notifications"      element={<OwnerNotifications />} />
        <Route path="profile"            element={<OwnerProfile />} />
        <Route path="profile/edit"       element={<OwnerEditProfile />} />
      </Route>

      {/* ═══════════════════════════════════════
          OPERATOR PORTAL
      ═══════════════════════════════════════ */}
      <Route path="operator" element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={[USER_ROLES.SPRAYER, USER_ROLES.ADMIN]}>
            <OperatorLayout />
          </RoleGuard>
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"          element={<OperatorDashboard />} />
        <Route path="jobs"               element={<OperatorJobs />} />
        <Route path="jobs/:id"           element={<OperatorJobDetails />} />
        <Route path="calendar"           element={<OperatorCalendar />} />
        <Route path="earnings"           element={<OperatorEarnings />} />
        <Route path="customers"          element={<OperatorCustomers />} />
        <Route path="reviews"            element={<OperatorReviews />} />
        <Route path="notifications"      element={<OperatorNotifications />} />
        <Route path="profile"            element={<OperatorProfile />} />
        <Route path="profile/edit"       element={<OperatorEditProfile />} />
      </Route>

      {/* ═══════════════════════════════════════
          ADMIN PORTAL
         ═══════════════════════════════════════ */}
      <Route path="admin" element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
            <AdminLayout />
          </RoleGuard>
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"       element={<AdminDashboard />} />
        <Route path="users"           element={<UserManagement />} />
        <Route path="verifications"   element={<AdminVerifications />} />
        <Route path="equipment"       element={<AdminEquipment />} />
        <Route path="marketplace"     element={<AdminMarketplace />} />
        <Route path="bookings"        element={<AdminBookings />} />
        <Route path="payments"        element={<AdminPayments />} />
        <Route path="ai-reports"      element={<AdminAiReports />} />
        <Route path="reviews"         element={<AdminReviews />} />
        <Route path="support"         element={<AdminSupport />} />
        <Route path="notifications"   element={<AdminNotifications />} />
        <Route path="reports"         element={<AdminReports />} />
        <Route path="activity-logs"   element={<AdminActivityLogs />} />
        <Route path="settings"        element={<AdminSettings />} />
        <Route path="profile"         element={<AdminProfile />} />
      </Route>

      {/* ── Catch-all → back to Welcome ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
      </Suspense>
  );
}
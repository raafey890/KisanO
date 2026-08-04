import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

/* ── Layouts ── */
import PublicLayout from './layouts/PublicLayout';
import AuthLayout  from './layouts/AuthLayout';
import FarmerLayout from './layouts/FarmerLayout';
import OwnerLayout  from './layouts/OwnerLayout';
import AdminLayout  from './layouts/AdminLayout';

/* ── Public Pages ── */
import WelcomePage  from './pages/public/WelcomePage';
import ExplorePage  from './pages/public/ExplorePage';

/* ── Auth Module Pages ── */
import RoleSelectionPage   from './pages/auth/RoleSelectionPage';
import LoginPage           from './pages/auth/LoginPage';
import RegisterPage        from './pages/auth/RegisterPage';
import ForgotPasswordPage  from './pages/auth/ForgotPasswordPage';
import OTPVerificationPage from './pages/auth/OTPVerificationPage';
import ResetPasswordPage   from './pages/auth/ResetPasswordPage';
import VerifySuccessPage   from './pages/auth/VerifySuccessPage';

/* ── Legacy Auth Route Wrappers ── */
import FarmerLogin    from './pages/auth/FarmerLogin';
import FarmerRegister from './pages/auth/FarmerRegister';
import OwnerLogin     from './pages/auth/OwnerLogin';
import OwnerRegister  from './pages/auth/OwnerRegister';
import AdminLogin     from './pages/auth/AdminLogin';

/* ── Farmer Pages ── */
import FarmerDashboard           from './pages/farmer/FarmerDashboard';
import EquipmentSearch           from './pages/farmer/EquipmentSearch';
import EquipmentDetail           from './pages/farmer/EquipmentDetail';
import EquipmentAvailabilityPage from './pages/farmer/EquipmentAvailabilityPage';
import RentalDurationPage        from './pages/farmer/RentalDurationPage';
import BookingConfirm            from './pages/farmer/BookingConfirm';
import MarketplacePage           from './pages/farmer/MarketplacePage';
import ProductDetail             from './pages/farmer/ProductDetail';
import CartPage                  from './pages/farmer/CartPage';
import CheckoutPage              from './pages/farmer/CheckoutPage';
import PaymentPage               from './pages/farmer/PaymentPage';
import OrderSuccessPage          from './pages/farmer/OrderSuccessPage';
import MyOrdersPage              from './pages/farmer/MyOrdersPage';
import SprayerServices           from './pages/farmer/SprayerServices';
import SprayerDetail             from './pages/farmer/SprayerDetail';
import ServiceBookingTimePage    from './pages/farmer/ServiceBookingTimePage';
import ServiceLocationPage       from './pages/farmer/ServiceLocationPage';
import ServiceBookingSummaryPage from './pages/farmer/ServiceBookingSummaryPage';
import ServiceBookingSuccessPage from './pages/farmer/ServiceBookingSuccessPage';
import SprayerHistoryPage        from './pages/farmer/SprayerHistoryPage';
import BookingHistory            from './pages/farmer/BookingHistory';
import AiDoctorHome              from './pages/farmer/AiDoctorHome';
import AiDoctorUpload            from './pages/farmer/AiDoctorUpload';
import AiDoctorResult            from './pages/farmer/AiDoctorResult';
import AiDoctorReport            from './pages/farmer/AiDoctorReport';
import AiDoctorHistory           from './pages/farmer/AiDoctorHistory';
import FarmerProfilePage         from './pages/farmer/FarmerProfilePage';
import EditProfilePage           from './pages/farmer/EditProfilePage';
import NotificationsPage         from './pages/farmer/NotificationsPage';
import SettingsPage              from './pages/farmer/SettingsPage';

/* ── Owner Pages ── */
import OwnerDashboard      from './pages/owner/OwnerDashboard';
import OwnerEquipment      from './pages/owner/OwnerEquipment';
import AddEquipment        from './pages/owner/AddEquipment';
import EditEquipment       from './pages/owner/EditEquipment';
import OwnerBookings       from './pages/owner/OwnerBookings';
import OwnerCalendar       from './pages/owner/OwnerCalendar';
import OwnerEarnings       from './pages/owner/OwnerEarnings';
import OwnerReviews        from './pages/owner/OwnerReviews';
import OwnerNotifications  from './pages/owner/OwnerNotifications';
import OwnerProfile        from './pages/owner/OwnerProfile';
import OwnerEditProfile    from './pages/owner/OwnerEditProfile';


/* ── Operator Pages ── */
import OperatorLayout         from './layouts/OperatorLayout';
import OperatorDashboard      from './pages/operator/OperatorDashboard';
import OperatorJobs           from './pages/operator/OperatorJobs';
import OperatorJobDetails     from './pages/operator/OperatorJobDetails';
import OperatorCalendar       from './pages/operator/OperatorCalendar';
import OperatorEarnings       from './pages/operator/OperatorEarnings';
import OperatorCustomers      from './pages/operator/OperatorCustomers';
import OperatorReviews        from './pages/operator/OperatorReviews';
import OperatorNotifications  from './pages/operator/OperatorNotifications';
import OperatorProfile        from './pages/operator/OperatorProfile';
import OperatorEditProfile    from './pages/operator/OperatorEditProfile';
import AdminDashboard      from './pages/admin/AdminDashboard';
import UserManagement      from './pages/admin/UserManagement';
import AdminVerifications  from './pages/admin/AdminVerifications';
import AdminEquipment      from './pages/admin/AdminEquipment';
import AdminMarketplace    from './pages/admin/AdminMarketplace';
import AdminBookings       from './pages/admin/AdminBookings';
import AdminPayments       from './pages/admin/AdminPayments';
import AdminAiReports      from './pages/admin/AdminAiReports';
import AdminReviews        from './pages/admin/AdminReviews';
import AdminSupport        from './pages/admin/AdminSupport';
import AdminNotifications  from './pages/admin/AdminNotifications';
import AdminReports        from './pages/admin/AdminReports';
import AdminActivityLogs   from './pages/admin/AdminActivityLogs';
import AdminSettings       from './pages/admin/AdminSettings';
import AdminProfile        from './pages/admin/AdminProfile';

/* ── Protected Route Wrapper ── */
function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth/select-role" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
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
      <Route element={<AuthLayout />}>
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
        <ProtectedRoute allowedRoles={['FARMER', 'SPRAYER', 'ADMIN']}>
          <FarmerLayout />
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
        <ProtectedRoute allowedRoles={['EQUIPMENT_OWNER', 'ADMIN']}>
          <OwnerLayout />
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
        <ProtectedRoute allowedRoles={['SPRAYER', 'ADMIN']}>
          <OperatorLayout />
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
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminLayout />
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
  );
}
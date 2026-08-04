import React from 'react';
import NotificationsPage from '../farmer/NotificationsPage';

export default function OwnerNotifications() {
  // Reusing the robust Notifications component we built for the farmer module
  // In a real app, this would fetch owner-specific notifications.
  return <NotificationsPage />;
}

import React from 'react';
import NotificationsPage from '../farmer/NotificationsPage';

export default function OperatorNotifications() {
  // Reusing the robust Notifications component we built for the farmer module
  // In a real app, this would fetch Operator specific notifications.
  return <NotificationsPage />;
}

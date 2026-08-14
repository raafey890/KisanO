import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Check, Trash2, CalendarDays, Sprout, 
  Bot, Tag, Info, CheckCircle2 
} from 'lucide-react';
import { 
  useNotifications, 
  useMarkNotificationAsRead, 
  useMarkAllNotificationsAsRead, 
  useDeleteNotification 
} from '../../features/notifications/hooks/useNotifications';

const TABS = ['All', 'Bookings', 'Marketplace', 'AI Alerts', 'Offers', 'System'];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('All');

  const { data: notifications = [], isLoading } = useNotifications();
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();

  const filteredNotifications = notifications.filter(
    n => activeTab === 'All' || n.category === activeTab
  );

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const handleDelete = (id) => {
    deleteNotification(id);
  };

  const handleMarkRead = (id) => {
    markAsRead(id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 sm:pt-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Notifications</h1>
          <p className="text-sm font-medium text-gray-500 mt-2">Stay updated on your farm, bookings, and orders.</p>
        </div>
        
        {notifications.some(n => n.unread) && (
          <button 
            onClick={handleMarkAllRead}
            className="h-10 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-green-600" /> Mark All Read
          </button>
        )}
      </div>

      {/* 2. TABS */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {TABS.map(tab => {
          const count = tab === 'All' 
            ? notifications.filter(n => n.unread).length 
            : notifications.filter(n => n.category === tab && n.unread).length;
          
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap border-2 ${
                activeTab === tab 
                  ? 'bg-gray-900 text-white border-gray-900 shadow-sm' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tab}
              {count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === tab ? 'bg-white text-gray-900' : 'bg-green-100 text-green-700'
                }`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* 3. NOTIFICATIONS LIST */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <motion.div 
                key={notification.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-white border rounded-[1.5rem] p-5 sm:p-6 transition-all hover:shadow-md flex flex-col sm:flex-row gap-5 relative overflow-hidden group ${
                  notification.unread ? 'border-green-300 shadow-sm' : 'border-gray-200 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Unread indicator bar */}
                {notification.unread && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500"></div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${notification.bg} ${notification.color}`}>
                  <notification.icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-4 mb-1">
                    <h3 className={`text-lg font-black tracking-tight ${notification.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs font-bold text-gray-400 whitespace-nowrap">{notification.time}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 leading-relaxed max-w-2xl">
                    {notification.description}
                  </p>
                </div>

                {/* Actions (Hover) */}
                <div className="sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-none border-gray-100">
                  {notification.unread && (
                    <button 
                      onClick={() => handleMarkRead(notification.id)}
                      className="flex-1 sm:flex-none p-2 bg-gray-50 hover:bg-green-50 text-gray-500 hover:text-green-600 rounded-xl transition-colors flex items-center justify-center"
                      title="Mark as read"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(notification.id)}
                    className="flex-1 sm:flex-none p-2 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-xl transition-colors flex items-center justify-center"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

              </motion.div>
            ))
          ) : (
            /* EMPTY STATE */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-gray-200 shadow-sm"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center shadow-inner mb-6">
                <Bell className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">You're all caught up!</h3>
              <p className="text-gray-500 font-medium max-w-sm mb-4">
                You don't have any {activeTab.toLowerCase() !== 'all' ? activeTab.toLowerCase() : 'new'} notifications right now.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

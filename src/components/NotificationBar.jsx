import React, { useEffect, useRef } from "react";
import { useNotifications } from "../context/NotificationContext";
import { FiBell, FiCheck, FiX, FiChevronDown } from "react-icons/fi";
import { BsCalendarEvent, BsCheckAll } from "react-icons/bs";
import { MdNotificationsOff } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";

const NotificationBar = () => {
  const { 
    notifications, 
    isNotificationBarOpen, 
    markAllAsRead, 
    toggleNotificationBar,
    markAsRead 
  } = useNotifications();
  
  const notificationRef = useRef(null);
  
  // Handle clicks outside to close the notification bar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        if (isNotificationBarOpen) toggleNotificationBar();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationBarOpen, toggleNotificationBar]);

  // Count unread notifications
  const unreadCount = notifications.filter(notif => !notif.isRead).length;
  
  // Group notifications by date (today, yesterday, older)
  const getNotificationDate = (timestamp) => {
    const today = new Date();
    const notifDate = new Date(timestamp);
    
    if (today.toDateString() === notifDate.toDateString()) {
      return "Today";
    } else if (
      new Date(today.setDate(today.getDate() - 1)).toDateString() === notifDate.toDateString()
    ) {
      return "Yesterday";
    }
    return "Older";
  };
  
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const dateGroup = getNotificationDate(notification.timestamp);
    if (!groups[dateGroup]) {
      groups[dateGroup] = [];
    }
    groups[dateGroup].push(notification);
    return groups;
  }, {});

  const handleSingleNotificationRead = (id) => {
    markAsRead(id);
  };

  if (!isNotificationBarOpen) {
    return null;
  }

  // Get notification type icon based on content
  const getNotificationIcon = (message) => {
    if (message.includes("successfully purchased")) {
      return <BsCheckAll className="text-green-500" />;
    } else if (message.includes("reminder")) {
      return <BsCalendarEvent className="text-blue-500" />;
    } else if (message.includes("error")) {
      return <FiX className="text-red-500" />;
    } else {
      return <FiBell className="text-gray-500" />;
    }
  };

  return (
    <div 
      ref={notificationRef}
      className="absolute right-0 mt-2 w-96 bg-white shadow-xl rounded-lg border border-gray-200 z-50 transition-all duration-300 transform origin-top-right animate-dropdown"
    >
      <div className="rounded-t-lg bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FiBell className="text-xl" />
            <h3 className="text-lg font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-white text-xs hover:underline flex items-center"
                title="Mark all as read"
              >
                <BsCheckAll className="mr-1 text-lg" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
            <button
              onClick={toggleNotificationBar}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1"
              title="Close"
            >
              <FiX className="text-lg" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-8 flex flex-col items-center justify-center text-gray-500">
            <MdNotificationsOff className="text-4xl mb-2" />
            <p>No notifications</p>
            <p className="text-xs mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div>
            <div className="max-h-80 overflow-y-auto">
              {Object.entries(groupedNotifications).map(([dateGroup, notifs]) => (
                <div key={dateGroup}>
                  <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                      {dateGroup}
                    </p>
                  </div>
                  <ul>
                    {notifs.map((notification) => (
                      <li
                        key={notification.id}
                        className={`p-4 border-b last:border-b-0 flex hover:bg-gray-50 transition-colors ${
                          notification.isRead ? "bg-white" : "bg-blue-50"
                        }`}
                      >
                        <div className="mr-3 mt-1">
                          {getNotificationIcon(notification.message)}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm ${!notification.isRead && "font-medium"}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <button
                            onClick={() => handleSingleNotificationRead(notification.id)}
                            className="text-blue-500 hover:bg-blue-100 p-1 rounded-full self-start"
                            title="Mark as read"
                          >
                            <FiCheck className="text-sm" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <button className="text-xs text-blue-600 hover:underline flex items-center">
                <FiChevronDown className="mr-1" />
                View all notifications
              </button>
              <button className="text-xs text-gray-500 hover:underline flex items-center">
                <IoMdSettings className="mr-1" />
                Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationBar;
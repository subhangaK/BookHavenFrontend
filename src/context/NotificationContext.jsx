import React, { createContext, useContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import axios from "axios";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isNotificationBarOpen, setIsNotificationBarOpen] = useState(false);
  const { user, token } = useAuth();
  const [connection, setConnection] = useState(null);

  // Fetch unread notifications
  const fetchUnreadNotifications = async () => {
    try {
      const response = await axios.get("https://localhost:7189/api/notification/unread", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched unread notifications:", JSON.stringify(response.data, null, 2));
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch unread notifications:", error.message);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.post(
        "https://localhost:7189/api/notification/mark-as-read",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Marked all notifications as read in backend.");
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error("Failed to mark notifications as read:", error.message);
    }
  };

  // Initialize SignalR connection
  useEffect(() => {
    if (user && token) {
      console.log("Initializing notifications for user:", JSON.stringify(user, null, 2));
      fetchUnreadNotifications();

      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7189/notificationHub", {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      newConnection.on("ReceiveNotification", (notification) => {
        console.log("Received SignalR notification:", JSON.stringify(notification, null, 2));
        setNotifications((prev) => [...prev, notification]);
        setIsNotificationBarOpen(true);
      });

      newConnection.onclose((error) => {
        console.error("SignalR connection closed:", error);
      });

      newConnection
        .start()
        .then(() => {
          console.log("SignalR connection started for user ID:", user?.id || user);
          setConnection(newConnection);
        })
        .catch((error) => {
          console.error("Failed to start SignalR connection:", error);
        });

      return () => {
        if (newConnection) {
          newConnection.stop().then(() => console.log("SignalR connection stopped."));
        }
      };
    }
  }, [user, token]);

  const toggleNotificationBar = () => {
    setIsNotificationBarOpen((prev) => !prev);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        isNotificationBarOpen,
        toggleNotificationBar,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

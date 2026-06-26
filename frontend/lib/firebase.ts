import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, Messaging } from "firebase/messaging";

// Client-side Firebase configuration (typically populated from .env.local)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID",
};

// Initialize Firebase only if there isn't already an instance initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/**
 * Returns the Firebase Messaging instance if supported by the browser.
 */
export const getFcmMessaging = async (): Promise<Messaging | null> => {
  if (typeof window === "undefined") return null;

  try {
    const { isSupported } = await import("firebase/messaging");
    const supported = await isSupported();
    if (!supported) {
      console.warn("Firebase Cloud Messaging is not supported in this browser environment.");
      return null;
    }
    return getMessaging(app);
  } catch (error) {
    console.error("Failed to initialize Firebase Messaging:", error);
    return null;
  }
};

/**
 * Requests browser notification permission and retrieves the FCM registration token.
 * @param vapidKey Web Push Certificate Key (VAPID key) from the Firebase Console.
 */
export const requestFcmToken = async (vapidKey: string): Promise<string | null> => {
  if (typeof window === "undefined") return null;

  try {
    const messaging = await getFcmMessaging();
    if (!messaging) return null;

    // Request notification permission from the user
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Browser notification permission denied by user.");
      return null;
    }

    // Retrieve FCM token
    const token = await getToken(messaging, { vapidKey });
    return token;
  } catch (error) {
    console.error("An error occurred while retrieving FCM registration token:", error);
    return null;
  }
};

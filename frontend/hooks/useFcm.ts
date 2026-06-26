import { useEffect, useState } from "react";
import { getFcmMessaging, requestFcmToken } from "@/lib/firebase";
import { onMessage } from "firebase/messaging";
import { toast } from "sonner";

/**
 * Custom hook to register FCM notifications in Next.js and listen for foreground messages.
 * @param vapidKey Web Push Certificate Key (VAPID key) from the Firebase Console.
 */
export const useFcm = (vapidKey?: string) => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !vapidKey) return;

    let unsubscribeFn: (() => void) | undefined;

    const setupFcm = async () => {
      // 1. Request user permission and retrieve registration token
      const token = await requestFcmToken(vapidKey);
      if (token) {
        setFcmToken(token);
        console.log("FCM Token retrieved successfully:", token);
        
        // TODO: In production, send this token to the backend API via a PUT/POST request:
        // await api.put("/users/fcm-token", { fcmToken: token });
      }

      // 2. Setup foreground message listener
      const messaging = await getFcmMessaging();
      if (messaging) {
        unsubscribeFn = onMessage(messaging, (payload) => {
          console.log("FCM foreground notification payload received:", payload);
          
          if (payload.notification) {
            toast(payload.notification.title || "New Notification", {
              description: payload.notification.body,
              duration: 5000,
            });
          }
        });
      }
    };

    setupFcm();

    return () => {
      if (unsubscribeFn) {
        unsubscribeFn();
      }
    };
  }, [vapidKey]);

  return { fcmToken };
};

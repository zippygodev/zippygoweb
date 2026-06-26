// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// Replace the values below with your Firebase Web App configuration from the Firebase Console.
firebase.initializeApp({
  apiKey: "AIzaSyBFkm63qFbg90OBefq-8AvzjhYt8jPKU20",
  authDomain: "zippygo-87717.firebaseapp.com",
  projectId: "zippygo-87717",
  storageBucket: "zippygo-87717.firebasestorage.app",
  messagingSenderId: "217073833433",
  appId: "1:217073833433:web:1d226f09795956f60f75c8"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message: ", payload);

  const notificationTitle = payload.notification?.title || "New Message";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new notification.",
    icon: "/icon.png", // Replace with your app logo/icon path if available
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  self.registration.showNotification(payload.data.title, {
    body: payload.data.body,
    data: {
      sender_id: payload.data.sender_id,
    },
  });
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const senderId = event.notification?.data?.sender_id;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((tabList) => {
        for (const tab of tabList) {
          if (tab.url.includes(self.location.origin) && "focus" in tab) {
            tab.focus();
            tab.navigate(
              `${import.meta.env.VITE_FRONTEND_URL}/chat/${senderId}`,
            );
            return;
          }
        }
        return clients.openWindow(
          `${import.meta.env.VITE_FRONTEND_URL}/chat/${senderId}`,
        );
      }),
  );
});

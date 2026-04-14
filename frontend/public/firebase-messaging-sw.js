importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyBq9ry6i-eZO714Zw8EUohzOVezYPIewN8",
  authDomain: "chat-app-94423.firebaseapp.com",
  projectId: "chat-app-94423",
  messagingSenderId: "1005782507193",
  appId: "1:1005782507193:web:186de4b8a479e620824568",
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
  const BASE_URL = "https://chat-app-swart-phi.vercel.app";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((tabList) => {
        for (const tab of tabList) {
          if (tab.url.includes(self.location.origin) && "focus" in tab) {
            tab.focus();
            tab.navigate(`${BASE_URL}/chat/${senderId}`);
            return;
          }
        }
        return clients.openWindow(`${BASE_URL}/chat/${senderId}`);
      }),
  );
});

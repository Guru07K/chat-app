import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";


export const getFcmToken = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
    });

    return token;
  } catch (error) {
    console.error("FCM Error:", error);
    return null;
  }
};
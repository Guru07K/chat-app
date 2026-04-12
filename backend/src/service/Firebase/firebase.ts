import admin from "firebase-admin";
import serviceAccount from "./firebase-service.json";
import { firbaseConfig } from "./firebase_config";

admin.initializeApp({
    credential: admin.credential.cert(firbaseConfig as admin.ServiceAccount),
});

export const messaging = admin.messaging();
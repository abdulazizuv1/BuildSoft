import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDPP4EKbN6TTPUAKA3XGd60td82yTi93EU",
  authDomain: "build-soft-8bc65.firebaseapp.com",
  projectId: "build-soft-8bc65",
  storageBucket: "build-soft-8bc65.firebasestorage.app",
  messagingSenderId: "877771172140",
  appId: "1:877771172140:web:681075710315356dc26489",
  measurementId: "G-BWK0CCYXEN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export default app;

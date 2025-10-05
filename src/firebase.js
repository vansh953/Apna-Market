import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBGOEUr2KOgO0pMeE-Hq9C_SQMMz0MYt2w",
  authDomain: "apna-market-61487.firebaseapp.com",
  projectId: "apna-market-61487",
  storageBucket: "apna-market-61487.firebasestorage.app",
  messagingSenderId: "680052365095",
  appId: "1:680052365095:web:1e202c3bc9d965a3cebb02",
  measurementId: "G-VHSDX6439V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);  // Firestore database
export const auth = getAuth(app);     // Authentication
export const analytics = getAnalytics(app);

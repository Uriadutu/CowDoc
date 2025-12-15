import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Firebase config (gantilah dengan konfigurasi proyek Firebase Anda)
const firebaseConfig = { 
  apiKey: "AIzaSyBBjmAM6d3n3gKNXvdHi93ec87-ii-yQsY",
  authDomain: "projek-ta-inda.firebaseapp.com",
  projectId: "projek-ta-inda",
  storageBucket: "projek-ta-inda.firebasestorage.app",
  messagingSenderId: "475612066881",
  appId: "1:475612066881:web:cbf1ddde0af1755d2b42c0",
  measurementId: "G-7DB9526TW1"
}; 

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
const storage = getStorage(app);

export { auth, storage };
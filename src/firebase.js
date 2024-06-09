import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdrU7W19L7C28ma-6J-x93rz3zvElV2lc",
  authDomain: "diplom-30d41.firebaseapp.com",
  projectId: "diplom-30d41",
  storageBucket: "diplom-30d41.appspot.com",
  messagingSenderId: "1095146280617",
  appId: "1:1095146280617:web:b58045b5ff4823c563fbb8",
  measurementId: "G-96ZP30QKN2",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);

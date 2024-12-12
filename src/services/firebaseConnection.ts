import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6_01mBBU5sZAqqCgNAd7gT5t1J3sf1mU",
  authDomain: "clone-udemy-37154.firebaseapp.com",
  projectId: "clone-udemy-37154",
  storageBucket: "clone-udemy-37154.firebasestorage.app",
  messagingSenderId: "407360846202",
  appId: "1:407360846202:web:1e5a8387ac4e1ffea2fec3",
  measurementId: "G-9XPHRE1PPL",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

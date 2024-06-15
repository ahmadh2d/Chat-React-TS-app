// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "react-chat-web-app-59527.firebaseapp.com",
  projectId: "react-chat-web-app-59527",
  storageBucket: "react-chat-web-app-59527.appspot.com",
  messagingSenderId: "1063312111002",
  appId: "1:1063312111002:web:77cd60fa17c7e5aa257623"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore();
export const storage = getStorage();
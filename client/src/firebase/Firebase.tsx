// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZhHWCETkcjVgHlgwj7XmUB3MUkUqWs-k",
  authDomain: "eccomerce-5d007.firebaseapp.com",
  projectId: "eccomerce-5d007",
  storageBucket: "eccomerce-5d007.firebasestorage.app",
  messagingSenderId: "644800912574",
  appId: "1:644800912574:web:fffa50f23edabaf42952ef",
  measurementId: "G-DR1J5BQPB5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services (Firestore, Auth)
export const db = getFirestore(app);
export const auth = getAuth(app);

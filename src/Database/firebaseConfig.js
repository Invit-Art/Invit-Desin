import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBHN0lYDg7dEVRJfAH6jh3gxEEIEYHYWFE",
  authDomain: "confirmacionesevento-44ba5.firebaseapp.com",
  projectId: "confirmacionesevento-44ba5",
  storageBucket: "confirmacionesevento-44ba5.firebasestorage.app",
  messagingSenderId: "351981521276",
  appId: "1:351981521276:web:5255340bc915236ff17cf9",
  measurementId: "G-5WHR7Z9BMY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);

export { db };  

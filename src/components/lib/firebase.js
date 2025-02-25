import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import  {getFirestore} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "reactchat-e50ab.firebaseapp.com",
    projectId: "reactchat-e50ab",
    storageBucket: "reactchat-e50ab.firebasestorage.app",
    messagingSenderId: "134897795717",
    appId: "1:134897795717:web:442180b989f40b63075fec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const  db = getFirestore(app);
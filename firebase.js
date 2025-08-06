import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAdQ2FA0YzOUr66-wEE4Am8P3Y-_i1-sVg",
  authDomain: "valortrading-31a26.firebaseapp.com",
  projectId: "valortrading-31a26",
  storageBucket: "valortrading-31a26.firebasestorage.app",
  messagingSenderId: "370887478045",
  appId: "1:370887478045:web:9ebcfa7a07d9912fb3aff4",
  measurementId: "G-X2P7QBFGR3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
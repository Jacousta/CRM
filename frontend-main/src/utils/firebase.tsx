import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCkqOQmLbuFE4CX9RhzM4ZzzZit1MZp_DA",
  authDomain: "xeno-crm-dfb16.firebaseapp.com",
  projectId: "xeno-crm-dfb16",
  storageBucket: "xeno-crm-dfb16.firebasestorage.app",
  messagingSenderId: "210774791437",
  appId: "1:210774791437:web:6dbfa9aeee204df1450c44"
};

const firebaseApp = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account ",
});
export const auth = getAuth();
export const googleProvider = () => signInWithPopup(auth, provider);
export type { User };

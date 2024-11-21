import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC1qGajQR_D722ktE7GkIz3-IOVF1ewo0c",
  authDomain: "xeno-crm-c2ef7.firebaseapp.com",
  projectId: "xeno-crm-c2ef7",
  storageBucket: "xeno-crm-c2ef7.firebasestorage.app",
  messagingSenderId: "213011307566",
  appId: "1:213011307566:web:5399326277cf9d378fd3bf",
  measurementId: "G-NYRXE5SXVN"
};

const firebaseApp = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account ",
});
export const auth = getAuth();
export const googleProvider = () => signInWithPopup(auth, provider);
export type { User };

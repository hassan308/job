import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Konfigurera auth för email link sign-in
// OBS: Denna konfiguration bör göras på klientsidan, inte i denna fil
// Du kan flytta denna logik till en komponent som initialiseras på klientsidan

// auth.config.update({
//   signInOptions: [
//     {
//       provider: EmailAuthProvider.PROVIDER_ID,
//       signInMethod: EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
//     },
//     GoogleAuthProvider.PROVIDER_ID
//   ],
//   url: 'https://din-app-url.com/finishSignUp',
//   handleCodeInApp: true,
// });

// Istället, exportera providers för användning i komponenter
export const emailProvider = EmailAuthProvider;
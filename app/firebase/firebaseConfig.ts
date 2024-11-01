import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCm6TqrbPjt8KNp_6Qh88NaV18PYak3ALA",
  authDomain: "test-e5a52.firebaseapp.com",
  projectId: "test-e5a52",
  storageBucket: "test-e5a52.appspot.com",
  messagingSenderId: "173759766744",
  appId: "1:173759766744:web:5928ade9b8f6ababb237ad"
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
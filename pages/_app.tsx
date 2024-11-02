import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../app/firebase/firebaseConfig';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Ange din e-postadress för bekräftelse');
      }
      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          window.localStorage.removeItem('emailForSignIn');
          router.push('/'); // Omdirigera till startsidan eller önskad sida efter inloggning
        })
        .catch((error) => {
          console.error('Error signing in with email link', error);
        });
    }
  }, [router]);

  return (
    <>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}

export default MyApp;
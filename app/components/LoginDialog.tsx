import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { auth } from '../firebase/firebaseConfig';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (error) {
      setError('Det gick inte att logga in med Google. Försök igen.');
      console.error('Google login error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-white rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-gray-900">Logga in</DialogTitle>
          <DialogDescription className="text-lg text-gray-600 mt-2">
            Välj inloggningsmetod nedan.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-4">
          <Button 
            onClick={handleGoogleLogin} 
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
          >
            <FcGoogle className="w-6 h-6 mr-3" />
            <span className="text-base">Logga in med Google</span>
          </Button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
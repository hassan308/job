import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { LogIn, LogOut, User as UserIcon, Menu, X } from 'lucide-react'
import { User } from 'firebase/auth';

interface HeaderProps {
  onLoginClick: () => void;
  onLogoClick: () => void;
  onLogout: () => void;
  onProfileClick: () => void;
  user: User | null;
}

export default function Header({ onLoginClick, onLogoClick, onLogout, onProfileClick, user }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-gradient-to-r from-blue-100 to-purple-100 shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 
          className="text-2xl font-bold text-blue-700 cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={onLogoClick}
        >
          JobSearch
        </h1>
        <nav className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-blue-700 font-medium">Hej, {user.displayName?.split(' ')[0]}!</span>
              <Button onClick={onProfileClick} variant="ghost" className="text-blue-600 hover:bg-blue-100 transition-all duration-300 rounded-full">
                <UserIcon className="h-5 w-5 mr-2" />
                Profil
              </Button>
              <Button onClick={onLogout} variant="ghost" className="text-blue-600 hover:bg-blue-100 transition-all duration-300 rounded-full">
                <LogOut className="h-5 w-5 mr-2" />
                Logga ut
              </Button>
            </>
          ) : (
            <Button onClick={onLoginClick} variant="ghost" className="text-blue-600 hover:bg-blue-100 transition-all duration-300 rounded-full">
              <LogIn className="h-5 w-5 mr-2" />
              Logga in
            </Button>
          )}
        </nav>
        <div className="md:hidden flex items-center">
          {user && (
            <span className="text-blue-700 font-medium mr-2">Hej, {user.displayName?.split(' ')[0]}!</span>
          )}
          <Button onClick={toggleMenu} variant="ghost" className="text-blue-600">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-blue-50 py-2">
          {user ? (
            <>
              <Button onClick={onProfileClick} variant="ghost" className="w-full text-blue-600 hover:bg-blue-100 transition-all duration-300">
                <UserIcon className="h-5 w-5 mr-2" />
                Profil
              </Button>
              <Button onClick={onLogout} variant="ghost" className="w-full text-blue-600 hover:bg-blue-100 transition-all duration-300">
                <LogOut className="h-5 w-5 mr-2" />
                Logga ut
              </Button>
            </>
          ) : (
            <Button onClick={onLoginClick} variant="ghost" className="w-full text-blue-600 hover:bg-blue-100 transition-all duration-300">
              <LogIn className="h-5 w-5 mr-2" />
              Logga in
            </Button>
          )}
        </div>
      )}
    </header>
  )
}
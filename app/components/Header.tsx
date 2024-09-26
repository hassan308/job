import { Button } from "@/components/ui/button"
import { LogIn, UserPlus } from 'lucide-react'

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogoClick: () => void;
}

export default function Header({ onLoginClick, onRegisterClick, onLogoClick }: HeaderProps) {
  return (
    <header className="bg-white bg-opacity-90 shadow-sm sticky top-0 z-10 backdrop-filter backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 
          className="text-2xl font-bold text-indigo-700 cursor-pointer"
          onClick={onLogoClick}
        >
          JobSearch
        </h1>
        <nav className="flex items-center space-x-4">
          <Button onClick={onLoginClick} variant="ghost" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 transition-all duration-300">
            <LogIn className="h-4 w-4 mr-2" />
            Logga in
          </Button>
          <Button onClick={onRegisterClick} variant="ghost" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 transition-all duration-300">
            <UserPlus className="h-4 w-4 mr-2" />
            Registrera
          </Button>
        </nav>
      </div>
    </header>
  )
}
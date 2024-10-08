'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import Header from './components/Header'
import SearchForm from './components/SearchForm'
import JobList from './components/JobList'
import CVDialog from './components/CVDialog'
import CoverLetterDialog from './components/CoverLetterDialog'
import LoginDialog from './components/LoginDialog'
import RegisterDialog from './components/RegisterDialog'
import ProfileDialog from './components/ProfileDialog'

interface Job {
  id: string;
  title: string;
  description: string;
  company: {
    name: string;
  };
  workplace: {
    municipality: string | null;
  };
  published_date: string;
  last_application_date: string;
  employment_type: string;
  working_hours_type: string;
  own_car: boolean;
  driving_license_required: boolean;
  experience_required: boolean;
}

export default function JobSearch() {
  const [user, loading, error] = useAuthState(auth);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isCreateCVOpen, setIsCreateCVOpen] = useState(false)
  const [isCreateCoverLetterOpen, setIsCreateCoverLetterOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isInitialView, setIsInitialView] = useState(true)
  const [isLoading, setIsLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSearch = async (searchTerm: string) => {
    console.log("Sökning initierad med:", searchTerm);
    setIsInitialView(false);
    setIsLoading(true);
    setJobs([]);
    setSearchKeyword(searchTerm);

    try {
      const response = await fetch('https://3llgqvm1-5000.euw.devtunnels.ms/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ search_term: searchTerm }),
      });

      if (!response.ok) {
        throw new Error('Något gick fel vid hämtning av jobb');
      }

      const data: Job[] = await response.json();
      console.log("Hämtade jobb:", data); // Ny console.log
      setJobs(data);
    } catch (error) {
      console.error('Ett fel inträffade:', error);
      // Visa ett felmeddelande för användaren
    } finally {
      setIsLoading(false);
    }
  };

  const resetToInitialView = () => {
    setIsInitialView(true)
    setJobs([])
    setSearchKeyword('')
  }

  const handleLogout = () => {
    signOut(auth).catch((error) => {
      console.error('Logout error:', error);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col">
      <Header 
        onLoginClick={() => setIsLoginOpen(true)} 
        onRegisterClick={() => setIsRegisterOpen(true)} 
        onLogoClick={resetToInitialView}
        onLogout={handleLogout}
        onProfileClick={() => setIsProfileOpen(true)}
        user={user}
      />

      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl mx-auto mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 text-center leading-tight">
              Hitta ditt <span className="text-blue-600">drömjobb</span>
            </h1>
            
            <SearchForm onSearch={handleSearch} loading={isLoading} />
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="spinner"></div>
              <span className="ml-2">Laddar, vänligen vänta...</span>
            </div>
          ) : (
            <AnimatePresence>
              {!isInitialView && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.5 }}
                >
                  <JobList 
                    jobs={jobs} 
                    onCreateCV={() => setIsCreateCVOpen(true)} 
                    onCreateCoverLetter={() => setIsCreateCoverLetterOpen(true)} 
                    searchKeyword={searchKeyword}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>

      <CVDialog 
        isOpen={isCreateCVOpen} 
        onClose={() => setIsCreateCVOpen(false)} 
        onSubmit={(cvData: any) => {
          console.log('CV Data:', cvData)
          setIsCreateCVOpen(false)
        }} 
      />

      <CoverLetterDialog 
        isOpen={isCreateCoverLetterOpen} 
        onClose={() => setIsCreateCoverLetterOpen(false)} 
        onSubmit={(coverLetterData: any) => {
          console.log('Cover Letter Data:', coverLetterData)
          setIsCreateCoverLetterOpen(false)
        }} 
      />

      <LoginDialog 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />

      <RegisterDialog 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
      />

      <ProfileDialog 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase/firebaseConfig';
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
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleSearch = async (searchTerm: string) => {
    console.log("Sökning initierad med:", searchTerm);
    setIsInitialView(false);
    setIsLoading(true);
    setJobs([]);
    setSearchKeyword(searchTerm);

    try {
      const response = await fetch('http://localhost:8080/search', {
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
      console.log("API Response från backend:", JSON.stringify(data, null, 2));
      setJobs(data);
    } catch (error) {
      console.error('Ett fel inträffade:', error);
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

  const handleCreateCV = (job: Job) => {
    if (user) {
      setSelectedJob(job);
      setIsCreateCVOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleCreateCoverLetter = (job: Job) => {
    if (user) {
      setSelectedJob(job);
      setIsCreateCoverLetterOpen(true);
    } else {
      setIsLoginOpen(true);
    }
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
                    onCreateCV={handleCreateCV} 
                    onCreateCoverLetter={handleCreateCoverLetter} 
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
        jobDescription={selectedJob?.description || ''}
        jobTitle={selectedJob?.title || ''}
        onLoginRequired={() => setIsLoginOpen(true)}
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
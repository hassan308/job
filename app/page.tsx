// page.tsx

'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import Header from './components/Header';
import JobList from './components/JobList';
import CVDialog from './components/CVDialog';
import CoverLetterDialog from './components/CoverLetterDialog';
import LoginDialog from './components/LoginDialog';
import RegisterDialog from './components/RegisterDialog';
import ProfileDialog from './components/ProfileDialog';
import { Search, FileText, Zap } from 'lucide-react';
import { Job } from './type'; // Uppdaterad import
import { API_ENDPOINTS } from './config/api';

export default function JobSearch() {
  const [user, loading, error] = useAuthState(auth);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isCreateCVOpen, setIsCreateCVOpen] = useState(false);
  const [isCreateCoverLetterOpen, setIsCreateCoverLetterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isInitialView, setIsInitialView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const popularSearches = [
    { title: 'Sjuksköterska', icon: '👨‍⚕️' },
    { title: 'Systemutvecklare', icon: '💻' },
    { title: 'Lärare', icon: '👨‍🏫' },
    { title: 'Data Scientist', icon: '📊' },
    { title: 'Projektledare', icon: '📋' },
    { title: 'Undersköterska', icon: '🏥' }
  ];

  const handleSearch = async (searchTerm: string) => {
    console.log("Sökning initierad med:", searchTerm);
    setIsInitialView(false);
    setIsLoading(true);
    setJobs([]); // Rensa tidigare jobb
    setSearchKeyword(searchTerm); // Uppdatera sökordet

    try {
      const response = await fetch(API_ENDPOINTS.search, {
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
      setJobs(data); // Uppdatera jobben
    } catch (error) {
      console.error('Ett fel inträffade:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetToInitialView = () => {
    setIsInitialView(true);
    setJobs([]);
    setSearchKeyword('');
  };

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      <Header 
        onLoginClick={() => setIsLoginOpen(true)} 
        onLogoClick={resetToInitialView}
        onLogout={handleLogout}
        onProfileClick={() => setIsProfileOpen(true)}
        user={user || null}
      />

      <main className="pt-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          {isInitialView && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center"
            >
              <div className="text-center mb-12 max-w-2xl mx-auto">
                <motion.h1 
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight tracking-tight text-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <motion.span 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text block mb-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                  >
                    Smidigt. Smart. Smidra.
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                  >
                    Skapa CV som öppnar dörrar
                  </motion.span>
                </motion.h1>
                
                <motion.p 
                  className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
                >
                  Hitta de bästa jobben som matchar din profil
                </motion.p>
              </div>

              <motion.div 
                className="w-full max-w-2xl mx-auto mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
              >
                <div className="bg-white/95 rounded-xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-shadow">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const input = (e.currentTarget.elements[0] as HTMLInputElement).value;
                    if (input.trim()) handleSearch(input);
                  }} className="flex flex-col sm:flex-row items-center p-3 gap-3">
                    <div className="flex items-center w-full">
                      <Search className="w-5 h-5 text-gray-400 ml-2" />
                      <input
                        type="text"
                        placeholder="Sök efter roll eller kompetens"
                        className="w-full px-4 py-2 text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-0 text-sm bg-transparent"
                        disabled={isLoading}
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium text-sm whitespace-nowrap hover:opacity-95 transition-all"
                      disabled={isLoading}
                    >
                      Hitta jobb
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                      </svg>
                    </button>
                  </form>

                  <div className="border-t border-gray-100/50 p-4">
                    <div className="text-xs font-medium text-gray-500 mb-3">Populära sökningar</div>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map(search => (
                        <span 
                          key={search.title} 
                          className="bg-blue-50 text-blue-600 px-3.5 py-1.5 rounded-full text-xs cursor-pointer hover:bg-blue-100 transition-colors"
                          onClick={() => handleSearch(search.title)}
                        >
                          {search.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto px-4 sm:px-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <motion.div 
                  className="aspect-square bg-white rounded-2xl border border-gray-200 shadow-[0_4px_20px_-4px_rgba(16,24,40,0.08)] hover:shadow-[0_4px_25px_-5px_rgba(16,24,40,0.1)] transition-all duration-300 hover:-translate-y-1 flex flex-col"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
                >
                  <div className="p-6 sm:p-8 flex flex-col h-full">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                      <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg sm:text-xl mb-3">Personligt brev</h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      Skapa övertygande personliga brev som fångar arbetsgivarens uppmärksamhet direkt.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="aspect-square bg-white rounded-2xl border border-gray-200 shadow-[0_4px_20px_-4px_rgba(16,24,40,0.08)] hover:shadow-[0_4px_25px_-5px_rgba(16,24,40,0.1)] transition-all duration-300 hover:-translate-y-1 flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.6, ease: "easeOut" }}
                >
                  <div className="p-6 sm:p-8 flex flex-col h-full">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                      <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg sm:text-xl mb-3">CV-optimering</h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      Skapa professionella CV:n som får dig att sticka ut från mängden. Optimera ditt CV för varje ansökan.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="aspect-square bg-white rounded-2xl border border-gray-200 shadow-[0_4px_20px_-4px_rgba(16,24,40,0.08)] hover:shadow-[0_4px_25px_-5px_rgba(16,24,40,0.1)] transition-all duration-300 hover:-translate-y-1 flex flex-col"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6, duration: 0.6, ease: "easeOut" }}
                >
                  <div className="p-6 sm:p-8 flex flex-col h-full">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                      <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg sm:text-xl mb-3">Snabb ansökan</h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      Ansök till flera jobb på rekordtid med våra smarta mallar och automatiserade verktyg.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50"
            >
              <div className="relative flex flex-col items-center p-8 rounded-2xl bg-white shadow-2xl">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-r-blue-600 animate-[spin_1.5s_linear_infinite]"></div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 text-lg font-medium text-gray-700"
                >
                  Söker efter jobb...
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                  className="mt-2 text-sm text-gray-500"
                >
                  Detta kan ta några sekunder
                </motion.div>
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {!isInitialView && !isLoading && (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <JobList 
                  jobs={jobs} 
                  onCreateCV={handleCreateCV} 
                  onCreateCoverLetter={handleCreateCoverLetter} 
                />
              </motion.div>
            )}
          </AnimatePresence>
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
      <LoginDialog isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <RegisterDialog isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
      <ProfileDialog isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}

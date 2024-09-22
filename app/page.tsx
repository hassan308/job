'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import SearchForm from './components/SearchForm'
import JobList from './components/JobList'
import CVDialog from './components/CVDialog'
import CoverLetterDialog from './components/CoverLetterDialog'
import LoginDialog from './components/LoginDialog'
import RegisterDialog from './components/RegisterDialog'
import { Job } from './types'

export default function JobSearch() {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [originalJobs, setOriginalJobs] = useState<Job[]>([]);
  const [isCreateCVOpen, setIsCreateCVOpen] = useState(false)
  const [isCreateCoverLetterOpen, setIsCreateCoverLetterOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isInitialView, setIsInitialView] = useState(true)
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearch = async (searchTerm: string) => {
    console.log("Sökning initierad med:", searchTerm);
    setIsInitialView(false);
    setLoading(true);
    setFilteredJobs([]);

    try {
      // Anropa backend för att få filnamnet
      const backendResponse = await fetch('http://127.0.0.1:5000/process_jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ table_name: searchTerm }),
      });

      if (!backendResponse.ok) {
        throw new Error('Failed to fetch from backend');
      }

      const backendData = await backendResponse.json();
      const jsonFilename = backendData.json_filename;
      console.log("jsonFilename:", jsonFilename);

      // Anropa vår lokala API route med filnamnet
      const jobsResponse = await fetch(`/api/jobs?filename=${jsonFilename}`);
      if (!jobsResponse.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const jobs: Job[] = await jobsResponse.json();

      console.log("Hämtade jobb:", jobs);
      setOriginalJobs(jobs);
      setFilteredJobs(jobs);
    } catch (error) {
      console.error('Ett fel inträffade:', error);
      // Visa ett felmeddelande för användaren
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col">
      <Header 
        onLoginClick={() => setIsLoginOpen(true)} 
        onRegisterClick={() => setIsRegisterOpen(true)} 
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
            
            <SearchForm onSearch={handleSearch} loading={loading} />
          </motion.div>

          {loading ? (
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
                    jobs={originalJobs} 
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
    </div>
  )
}

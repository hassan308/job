import { useState, useCallback } from 'react'
import JobCard from './JobCard'
import Pagination from './Pagination'
import FilterMenu from './FilterMenu'
import SalaryDashboard from './SalaryDashboard'
import { Button } from "@/components/ui/button"
import { Filter } from 'lucide-react'
import { Job } from '../types'
import CVDialog from './CVDialog'
import { motion } from 'framer-motion'

interface JobListProps {
  jobs: Job[];
  onCreateCV: (job: Job) => void;
  onCreateCoverLetter: (job: Job) => void;
  searchKeyword: string;
}

interface FilterState {
  employmentTypes: string[];
  municipalities: string[];
  experience_required: string[];
}

export default function JobList({ jobs, onCreateCV, onCreateCoverLetter, searchKeyword }: JobListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isCVDialogOpen, setIsCVDialogOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    employmentTypes: [],
    municipalities: [],
    experience_required: [],
  });

  const jobsPerPage = 10
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)

  const handleFilterChange = useCallback((filters: FilterState) => {
    setActiveFilters(filters);
    const newFilteredJobs = jobs.filter(job => {
      console.log('Job Details:', {
        title: job.title,
        workExperiences: job.workExperiences,
        employment_type: job.employment_type,
        workplace: job.workplace,
      });

      if (filters.employmentTypes.length > 0 && !filters.employmentTypes.includes(job.employmentType)) {
        return false;
      }

      if (filters.municipalities.length > 0 && !filters.municipalities.includes(job.workplace?.municipality)) {
        return false;
      }

      if (filters.experience_required.length > 0) {
        const hasRequiredExperience = job.workExperiences?.some(exp => exp.required === false);
        const jobExperience = hasRequiredExperience ? 'Nej' : 'Ja';
        
        console.log('Job:', job.title);
        console.log('Work Experiences:', job.workExperiences);
        console.log('Has Required Experience:', hasRequiredExperience);
        console.log('Job experience value:', jobExperience);
        console.log('Selected filters:', filters.experience_required);
        
        if (!filters.experience_required.includes(jobExperience)) {
          return false;
        }
      }

      return true;
    });
    setFilteredJobs(newFilteredJobs);
    setCurrentPage(1);
  }, [jobs]);

  const handleCreateCV = (job: Job) => {
    setSelectedJob(job);
    setIsCVDialogOpen(true);
  };

  const handleCreateCoverLetter = () => {
    // Implementera logik för att skapa personligt brev här
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="text-gray-600 text-sm">
          {filteredJobs.length} jobb hittade
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className={`
              relative group px-6 py-2.5 
              ${showFilterMenu 
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-400'
              } 
              rounded-xl shadow-md hover:shadow-lg transition-all duration-300
            `}
          >
            <div className="flex items-center gap-2">
              <Filter className={`w-4 h-4 ${showFilterMenu ? 'text-white' : 'text-blue-600 group-hover:text-blue-700'}`} />
              <span className="font-medium">
                {showFilterMenu ? 'Dölj filter' : 'Filtrera resultat'}
              </span>
            </div>
            {!showFilterMenu && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"
              >
                <span className="text-xs text-white font-medium">
                  {Object.values(activeFilters).flat().filter(Boolean).length}
                </span>
              </motion.div>
            )}
          </Button>
        </motion.div>
      </div>
      {showFilterMenu && (
        <FilterMenu
          jobs={jobs}
          onFilterChange={handleFilterChange}
          onClose={() => setShowFilterMenu(false)}
        />
      )}
      {currentJobs.map((job: Job) => (
        <JobCard 
          key={job.id} 
          job={job} 
          onCreateCV={() => onCreateCV(job)}
          onCreateCoverLetter={handleCreateCoverLetter}
        />
      ))}
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />
      {selectedJob && (
        <CVDialog 
          isOpen={isCVDialogOpen}
          onClose={() => setIsCVDialogOpen(false)}
          jobDescription={selectedJob.description}
          jobTitle={selectedJob.title}
        />
      )}
    </div>
  )
}
import { useState, useCallback } from 'react'
import JobCard from './JobCard'
import Pagination from './Pagination'
import FilterMenu from './FilterMenu'
import SalaryDashboard from './SalaryDashboard'
import { Button } from "@/components/ui/button"
import { Filter } from 'lucide-react'
import { Job } from '../types'
import CVDialog from './CVDialog'

interface JobListProps {
  jobs: Job[];
  onCreateCV: (job: Job) => void;
  onCreateCoverLetter: (job: Job) => void;
  searchKeyword: string;
}

export default function JobList({ jobs, onCreateCV, onCreateCoverLetter, searchKeyword }: JobListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isCVDialogOpen, setIsCVDialogOpen] = useState(false)

  const jobsPerPage = 10
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)

  const handleFilterChange = useCallback((filters: any) => {
    const newFilteredJobs = jobs.filter(job => {
      if (filters.employmentTypes.length > 0 && !filters.employmentTypes.includes(job.employmentType)) {
        return false;
      }
      if (filters.municipalities.length > 0 && !filters.municipalities.includes(job.workplace?.municipality)) {
        return false;
      }
      if (filters.requiresExperience && !job.experience_required) {
        return false;
      }
      if (filters.requiresLicense && !job.driving_license_required) {
        return false;
      }
      if (filters.requiresCar && !job.own_car) {
        return false;
      }
      return true;
    });
    setFilteredJobs(newFilteredJobs);
    setCurrentPage(1);
  }, [jobs])

  const handleCreateCV = (job: Job) => {
    setSelectedJob(job);
    setIsCVDialogOpen(true);
  };

  const handleCreateCoverLetter = () => {
    // Implementera logik för att skapa personligt brev här
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <SalaryDashboard keyword={searchKeyword} />
      <div className="flex justify-end mb-4">
        <Button 
          onClick={() => setShowFilterMenu(!showFilterMenu)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Filter className="mr-2 h-4 w-4" />
          {showFilterMenu ? 'Dölj filter' : 'Visa filter'}
        </Button>
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
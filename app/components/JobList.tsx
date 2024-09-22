import { useState, useCallback } from 'react'
import JobCard from './JobCard'
import Pagination from './Pagination'
import FilterMenu from './FilterMenu'
import SalaryDashboard from './SalaryDashboard'
import { Job } from '../types'
import { Button } from "@/components/ui/button"
import { Filter } from 'lucide-react'

interface JobListProps {
  jobs: Job[];
  onCreateCV: () => void;
  onCreateCoverLetter: () => void;
  searchKeyword: string;
}

export default function JobList({ jobs, onCreateCV, onCreateCoverLetter, searchKeyword }: JobListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [filteredJobs, setFilteredJobs] = useState(jobs)

  const jobsPerPage = 10
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)

  const handleFilterChange = useCallback((filters: any) => {
    const newFilteredJobs = jobs.filter(job => {
      if (filters.employmentTypes.length > 0 && !filters.employmentTypes.includes(job.employment_type)) {
        return false;
      }
      if (filters.municipalities.length > 0 && !filters.municipalities.includes(job.municipality)) {
        return false;
      }
      if (filters.requiresExperience && !job.requires_experience) {
        return false;
      }
      if (filters.requiresLicense && !job.requires_license) {
        return false;
      }
      if (filters.requiresCar && !job.requires_car) {
        return false;
      }
      return true;
    });
    setFilteredJobs(newFilteredJobs);
    setCurrentPage(1);
  }, [jobs]);

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
          onCreateCV={onCreateCV} 
          onCreateCoverLetter={onCreateCoverLetter} 
        />
      ))}
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />
    </div>
  )
}
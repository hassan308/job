// joblist.tsx
import { useState, useCallback, useMemo, useEffect } from 'react';
import JobCard from './JobCard';
import Pagination from './Pagination';
import FilterMenu from './FilterMenu';
import { Button } from "@/components/ui/button";
import { Filter } from 'lucide-react';
import { Job, FilterState } from '../type'; // Uppdaterad import
import CVDialog from './CVDialog';
import { motion } from 'framer-motion';

interface JobListProps {
  jobs: Job[];
  onCreateCV: (job: Job) => void;
  onCreateCoverLetter: (job: Job) => void;
}

export default function JobList({ jobs, onCreateCV, onCreateCoverLetter }: JobListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isCVDialogOpen, setIsCVDialogOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    employmentTypes: [],
    municipalities: [],
    experienceRequired: [],
  });

  const jobsPerPage = 10;

  // Använd useMemo för att beräkna filteredJobs baserat på jobs och activeFilters
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Filtrera efter Anställningstyp
      if (activeFilters.employmentTypes.length > 0 && !activeFilters.employmentTypes.includes(job.employmentType)) {
        return false;
      }

      // Filtrera efter Kommun
      if (activeFilters.municipalities.length > 0 && !activeFilters.municipalities.includes(job.workplace.municipality)) {
        return false;
      }

      // Filtrera efter Erfarenhet
      if (activeFilters.experienceRequired.length > 0) {
        const jobExperience = job.requiresExperience ? 'Ja' : 'Nej';
        if (!activeFilters.experienceRequired.includes(jobExperience)) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, activeFilters]);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = useMemo(() => {
    return filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  }, [filteredJobs, indexOfFirstJob, indexOfLastJob]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handleFilterChange = useCallback((filters: FilterState) => {
    setActiveFilters(filters);
    setCurrentPage(1); // Återställ till första sidan när filter ändras
  }, []);

  const handleCreateCV = (job: Job) => {
    setSelectedJob(job);
    setIsCVDialogOpen(true);
  };

  const handleCreateCoverLetter = (job: Job) => {
    setSelectedJob(job);
    // Implementera logik för att skapa personligt brev här
  };

  const handleLoginRequired = () => {
    setIsCVDialogOpen(false);
    // Här kan du lägga till logik för att visa login dialog
  };

  // Återställ filtreringen när jobs ändras (t.ex. vid ny sökning)
  useEffect(() => {
    setActiveFilters({
      employmentTypes: [],
      municipalities: [],
      experienceRequired: [],
    });
    setCurrentPage(1);
  }, [jobs]);

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
      {currentJobs.length > 0 ? (
        currentJobs.map((job: Job) => (
          <JobCard 
            key={job.id} 
            job={job} 
            onCreateCV={() => onCreateCV(job)}
            onCreateCoverLetter={() => onCreateCoverLetter(job)}
          />
        ))
      ) : (
        <div className="text-center text-gray-500">Inga jobb matchar dina filter.</div>
      )}
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
          onLoginRequired={handleLoginRequired}
        />
      )}
    </div>
  );
}

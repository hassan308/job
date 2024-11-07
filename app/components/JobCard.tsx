// JobCard.tsx
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { Job } from '../type'; // Se till att importera från 'type' istället för 'types'

interface JobCardProps {
  job: Job;
  onCreateCV: (job: Job) => void;
  onCreateCoverLetter: (job: Job) => void;
  searchKeyword?: string;
}

export default function JobCard({ job, onCreateCV, onCreateCoverLetter, searchKeyword }: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            {job.company.logotype ? (
              <img 
                src={job.company.logotype} 
                alt={job.company.name} 
                className="w-12 h-12 object-contain rounded-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏢</span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.company.name}</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-600">
              <span>📍</span> {job.workplace.municipality}
            </p>
            <p className="text-sm text-gray-600">
              <span>💼</span> {job.employmentType}
            </p>
            <p className="text-sm text-gray-600">
              <span>👥</span> {job.positions} tjänst{job.positions !== 1 && 'er'}
            </p>
            <p className="text-sm text-gray-600">
              <span>🎯</span> Erfarenhet: {job.requiresExperience ? 'Krävs' : 'Krävs ej'}
            </p>
            {job.salaryType && (
              <p className="text-sm text-gray-600">
                <span>💰</span> {job.salaryType}
              </p>
            )}
            {job.lastApplicationDate && (
              <p className="text-sm text-gray-600">
                <span>📅</span> Sök senast: {new Date(job.lastApplicationDate).toLocaleDateString('sv-SE')}
              </p>
            )}
          </div>
          
          <div className="prose prose-sm max-w-none text-gray-600 mb-4">
            {isExpanded ? (
              <div dangerouslySetInnerHTML={{ __html: job.description }} />
            ) : (
              <>
                <div dangerouslySetInnerHTML={{ __html: job.description.slice(0, 300) + '...' }} />
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 flex items-center gap-1"
                >
                  Visa mer <ChevronDown className="w-4 h-4" />
                </button>
              </>
            )}
            {isExpanded && (
              <button
                onClick={() => setIsExpanded(false)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 flex items-center gap-1"
              >
                Visa mindre <ChevronUp className="w-4 h-4" />
              </button>
            )}
          </div>

          {job.contacts && job.contacts.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50/50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">📞 Kontaktpersoner</h4>
              {job.contacts.map((contact, index) => (
                <div key={index} className="text-sm text-gray-600">
                  <p>{contact.description}</p>
                  {contact.phoneNumber && <p>☎️ {contact.phoneNumber}</p>}
                  {contact.email && <p>✉️ {contact.email}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          onClick={() => onCreateCV(job)}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm"
        >
          <FileText className="w-4 h-4 mr-2" />
          Skapa CV
        </Button>
        <Button
          onClick={() => onCreateCoverLetter(job)}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm"
        >
          <Send className="w-4 h-4 mr-2" />
          Personligt brev
        </Button>
      </div>
    </div>
  );
}

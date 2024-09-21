import { useState } from 'react'
import { Briefcase, MapPin, Clock, ChevronDown, ChevronUp, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Job } from '../types'

interface JobCardProps {
  job: Job;
  onCreateCV: () => void;
  onCreateCoverLetter: () => void;
}

export default function JobCard({ job, onCreateCV, onCreateCoverLetter }: JobCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white rounded-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{job.title}</CardTitle>
        <CardDescription className="text-base sm:text-lg md:text-xl text-gray-700 mt-2">{job.company_name}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4">
          <span className="flex items-center">
            <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-blue-500" />
            {job.company_name}
          </span>
          <span className="flex items-center">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-green-500" />
            {job.municipality}
          </span>
          <span className="flex items-center">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-purple-500" />
            {job.employment_type}
          </span>
        </div>
        <p className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed">
          {expanded ? job.description : `${job.description.slice(0, 150)}...`}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {job.requires_experience && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">👨‍💼 Erfarenhet krävs</span>}
          {job.requires_license && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">🚗 Körkort krävs</span>}
          {job.requires_car && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">🚙 Bil krävs</span>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4">
          <div>
            <span className="font-semibold">📅 Publicerad:</span> {new Date(job.published_date).toLocaleDateString('sv-SE')}
          </div>
          <div>
            <span className="font-semibold">🏢 Företagstyp:</span> {job.company_type}
          </div>
          <div className="col-span-1 sm:col-span-2">
            <span className="font-semibold">⏰ Sista ansökningsdag:</span> {new Date(job.last_application_date).toLocaleDateString('sv-SE')}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <Button 
            onClick={() => setExpanded(!expanded)} 
            variant="outline" 
            className="text-indigo-600 hover:bg-indigo-50 border-indigo-300 w-full sm:w-auto transition-all duration-300 text-sm sm:text-base rounded-full"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                Visa mindre
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                Läs mer
              </>
            )}
          </Button>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <Button onClick={onCreateCV} className="bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 w-full sm:w-auto transition-all duration-300 shadow-md hover:shadow-lg text-xs sm:text-sm rounded-full px-3 py-1 sm:px-4 sm:py-2">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Skapa CV
            </Button>
            <Button onClick={onCreateCoverLetter} className="bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 w-full sm:w-auto transition-all duration-300 shadow-md hover:shadow-lg text-xs sm:text-sm rounded-full px-3 py-1 sm:px-4 sm:py-2">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Skapa Personligt Brev
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
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

  const formatDescription = (description: string) => {
    // Hantera specialtecken
    const decodedDescription = description.replace(/\\u([a-fA-F0-9]{4})/g, (match, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    );

    // Dela upp texten i stycken
    const paragraphs = decodedDescription.split(/\n+/);

    const allowedTags = ['p', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a'];
    
    const cleanAndFormatElement = (element: Element): string => {
      if (element.nodeType === Node.TEXT_NODE) {
        return element.textContent || '';
      }

      if (element.nodeType === Node.ELEMENT_NODE) {
        const tagName = element.tagName.toLowerCase();
        if (allowedTags.includes(tagName)) {
          const children = Array.from(element.childNodes)
            .map(child => cleanAndFormatElement(child as Element))
            .join('');

          let className = '';
          switch (tagName) {
            case 'h1':
            case 'h2':
            case 'h3':
              className = 'text-xl font-bold text-indigo-700 mt-4 mb-2';
              break;
            case 'h4':
            case 'h5':
            case 'h6':
              className = 'text-lg font-semibold text-indigo-600 mt-3 mb-2';
              break;
            case 'p':
              className = 'mb-3 text-gray-700';
              break;
            case 'ul':
            case 'ol':
              className = 'list-disc list-inside mb-3 text-gray-700';
              break;
            case 'li':
              className = 'mb-1';
              break;
            case 'a':
              className = 'text-blue-600 hover:underline';
              break;
          }

          if (tagName === 'a') {
            const href = (element as HTMLAnchorElement).getAttribute('href');
            const target = (element as HTMLAnchorElement).getAttribute('target');
            const rel = (element as HTMLAnchorElement).getAttribute('rel');
            return `<a href="${href}" target="${target}" rel="${rel}" class="${className}">${children}</a>`;
          }

          return `<${tagName} class="${className}">${children}</${tagName}>`;
        } else {
          return Array.from(element.childNodes)
            .map(child => cleanAndFormatElement(child as Element))
            .join('');
        }
      }

      return '';
    };

    const formattedParagraphs = paragraphs.map(paragraph => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = paragraph;
      return cleanAndFormatElement(tempDiv);
    });

    return (
      <div className="job-description text-sm sm:text-base leading-relaxed space-y-2">
        {formattedParagraphs.map((paragraph, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
        ))}
      </div>
    );
  };

  // Kolla om jobbet kräver erfarenhet baserat på work_experiences
  const hasRequiredExperience = job.work_experiences?.some(exp => exp.required === false);

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white rounded-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{job.title}</CardTitle>
        <CardDescription className="text-base sm:text-lg md:text-xl text-gray-700 mt-2">{job.company.name}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4">
          <span className="flex items-center">
            <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-blue-500" />
            {job.company.name}
          </span>
          <span className="flex items-center">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-green-500" />
            {job.workplace.municipality || 'Ej specificerat'}
          </span>
          <span className="flex items-center">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-purple-500" />
            {job.employment_type}
          </span>
        </div>
        <div className="mb-4 overflow-hidden">
          {expanded ? (
            formatDescription(job.description)
          ) : (
            <div className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {formatDescription(job.description.slice(0, 300))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {!hasRequiredExperience && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              👨‍💼 Erfarenhet krävs
            </span>
          )}
          {job.driving_license_required && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              🚗 Körkort krävs
            </span>
          )}
          {job.own_car && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              🚙 Bil krävs
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4">
          <div>
            <span className="font-semibold">📅 Publicerad:</span> {new Date(job.published_date).toLocaleDateString('sv-SE')}
          </div>
          <div>
            <span className="font-semibold">🏢 Arbetstid:</span> {job.work_time_extent}
          </div>
          <div>
            <span className="font-semibold">💼 Anställningsform:</span> {job.employment_type}
          </div>
          <div>
            <span className="font-semibold">🕒 Varaktighet:</span> {job.duration}
          </div>
          <div>
            <span className="font-semibold">👥 Antal tjänster:</span> {job.positions}
          </div>
          {job.salary_description && (
            <div>
              <span className="font-semibold">💰 Lön:</span> {job.salary_description}
            </div>
          )}
          <div className="col-span-1 sm:col-span-2">
            <span className="font-semibold">⏰ Sista ansökningsdag:</span> {new Date(job.last_application_date).toLocaleDateString('sv-SE')}
          </div>
        </div>
        {job.application && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">📝 Hur du ansöker:</h3>
            {job.application.webAddress && (
              <a href={job.application.webAddress} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                🌐 Ansök online
              </a>
            )}
            {job.application.email && (
              <p>✉️ E-post: {job.application.email}</p>
            )}
            {job.application.reference && (
              <p>🏷️ Referens: {job.application.reference}</p>
            )}
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <Button 
            onClick={() => setExpanded(!expanded)} 
            variant="outline" 
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 w-full sm:w-auto transition-all duration-300 text-sm rounded-full px-4 py-2 shadow-sm hover:shadow"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Visa mindre
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Läs mer
              </>
            )}
          </Button>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <Button 
              onClick={onCreateCV} 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white w-full sm:w-auto transition-all duration-300 shadow-md hover:shadow-lg text-sm rounded-full px-6 py-2 font-medium"
            >
              <FileText className="h-4 w-4 mr-2" />
              Skapa CV
            </Button>
            <Button 
              disabled
              className="bg-gradient-to-r from-blue-200 to-indigo-200 text-blue-700 border-none w-full sm:w-auto transition-all duration-300 cursor-not-allowed text-sm rounded-full px-6 py-2 font-medium flex items-center justify-center shadow-sm opacity-75"
            >
              <FileText className="h-4 w-4 mr-2" />
              Personligt Brev (Kommer snart)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
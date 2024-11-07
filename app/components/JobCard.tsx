// JobCard.tsx
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Send, 
  ChevronDown, 
  ChevronUp,
  Building2,
  MapPin,
  Briefcase,
  Users,
  Target,
  Clock,
  Coins,
  Calendar,
  Timer,
  GraduationCap
} from 'lucide-react';
import { Job } from '../types';
import { FastAverageColor } from 'fast-average-color';
import NextImage from 'next/image';

interface JobCardProps {
  job: Job;
  onCreateCV: (job: Job) => void;
  onCreateCoverLetter: (job: Job) => void;
  searchKeyword?: string;
}

interface CardColors {
  dominant: string;
  dominantLight: string;
}

export default function JobCard({ job, onCreateCV, onCreateCoverLetter, searchKeyword }: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [colors, setColors] = useState<CardColors | null>(null);

  useEffect(() => {
    if (job.logotype) {
      const fac = new FastAverageColor();
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.src = job.logotype;
      
      img.onload = async () => {
        try {
          const color = await fac.getColorAsync(img);
          const dominantColor = color.hex;
          
          setColors({
            dominant: dominantColor,
            dominantLight: `${dominantColor}15`
          });
        } catch (error) {
          console.error('Kunde inte extrahera färger:', error);
          setColors({
            dominant: '#4F46E5',
            dominantLight: '#4F46E515'
          });
        }
      };

      img.onerror = () => {
        console.error('Kunde inte ladda logotypen');
        setColors({
          dominant: '#4F46E5',
          dominantLight: '#4F46E515'
        });
      };

      return () => {
        fac.destroy();
      };
    }
  }, [job.logotype]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Lägg till en funktion för att styla emojis
  const getEmojiStyle = (dominantColor: string) => {
    return {
      background: `linear-gradient(135deg, 
        ${dominantColor}, 
        ${dominantColor}90)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      display: 'inline-block',
      transform: 'scale(1.2)',
      filter: `drop-shadow(0 0 2px ${dominantColor}40)`,
      transition: 'all 0.3s ease'
    };
  };

  return (
    <div className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
      {/* Hörnfärger från logotypen */}
      {colors && (
        <>
          {/* Top gradient covering entire top area */}
          <div 
            className="absolute top-0 left-0 w-full h-72 opacity-90 blur-md"
            style={{
              background: `linear-gradient(to bottom, 
                ${colors.dominant}, 
                ${colors.dominant} 10%,
                ${colors.dominant} 20%,
                ${colors.dominant}90 40%,
                ${colors.dominant}60 60%,
                ${colors.dominant}20 80%,
                transparent 100%)`
            }}
          />
        </>
      )}

      {/* Vit mittsektion */}
      <div className="relative">
        {/* Innehåll med solid bakgrund för skarp text */}
        <div className="relative bg-white/80">
          {/* Header Section */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {job.logotype ? (
                <NextImage 
                  src={job.logotype} 
                  alt={job.company.name} 
                  width={64}
                  height={64}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-xl bg-white p-2"
                />
              ) : (
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                  <span className="text-xl sm:text-2xl">🏢</span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Building2 
                      className="w-4 h-4" 
                      style={colors ? {
                        color: colors.dominant,
                        filter: `drop-shadow(0 0 2px ${colors.dominant}40)`
                      } : {
                        color: '#4F46E5'
                      }}
                    />
                    {job.company.name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin 
                      className="w-4 h-4" 
                      style={colors ? {
                        color: colors.dominant,
                        filter: `drop-shadow(0 0 2px ${colors.dominant}40)`
                      } : {
                        color: '#4F46E5'
                      }}
                    />
                    {job.workplace.municipality}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Innehåll */}
          <div className="p-4 sm:p-6">
            {/* Grid med information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="space-y-4">
                <div className="bg-white shadow-sm border border-gray-100 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1 font-medium">Anställningsform</div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    {job.employmentType}
                  </div>
                </div>

                <div className="bg-white shadow-sm border border-gray-100 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1 font-medium">Antal tjänster</div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Users className="w-4 h-4 text-blue-600" />
                    {job.positions} st
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white shadow-sm border border-gray-100 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1 font-medium">Erfarenhetskrav</div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    {job.requiresExperience ? 'Krävs' : 'Krävs ej'}
                  </div>
                </div>

                {job.duration && (
                  <div className="bg-white shadow-sm border border-gray-100 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1 font-medium">Varaktighet</div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Clock className="w-4 h-4 text-blue-600" />
                      {job.duration}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {job.salaryType && (
                <div className="bg-white shadow-sm border border-gray-100 px-3 py-1.5 rounded-full flex items-center gap-2">
                  <Coins className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">{job.salaryType}</span>
                </div>
              )}
              <div className="bg-white shadow-sm border border-gray-100 px-3 py-1.5 rounded-full flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Publicerad: {formatDate(job.publishedDate)}</span>
              </div>
              {job.lastApplicationDate && (
                <div className="bg-red-50 border border-red-100 px-3 py-1.5 rounded-full flex items-center gap-2">
                  <Timer className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-700">Sök senast: {formatDate(job.lastApplicationDate)}</span>
                </div>
              )}
            </div>

            {/* Beskrivning */}
            <div className="prose prose-sm max-w-none text-gray-600 bg-white shadow-sm border border-gray-100 p-3 sm:p-4 rounded-xl mb-6">
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

            {/* Kontaktpersoner */}
            {job.contacts && job.contacts.length > 0 && (
              <div className="bg-white shadow-sm border border-gray-100 p-3 sm:p-4 rounded-xl mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span 
                    className="w-4 h-4"
                    style={colors ? {
                      color: colors.dominant,
                      filter: `drop-shadow(0 0 2px ${colors.dominant}40)`
                    } : {
                      color: '#4F46E5'
                    }}
                  >
                    📞
                  </span>
                  Kontaktpersoner
                </h4>
                <div className="space-y-3">
                  {job.contacts.map((contact, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium text-gray-900">{contact.description}</p>
                      {contact.phoneNumber && (
                        <p className="text-gray-600 flex items-center gap-2">
                          <span 
                            className="w-4 h-4"
                            style={colors ? {
                              color: colors.dominant,
                              filter: `drop-shadow(0 0 2px ${colors.dominant}40)`
                            } : {
                              color: '#4F46E5'
                            }}
                          >
                            ☎️
                          </span>
                          {contact.phoneNumber}
                        </p>
                      )}
                      {contact.email && (
                        <p className="text-gray-600 flex items-center gap-2">
                          <span 
                            className="w-4 h-4"
                            style={colors ? {
                              color: colors.dominant,
                              filter: `drop-shadow(0 0 2px ${colors.dominant}40)`
                            } : {
                              color: '#4F46E5'
                            }}
                          >
                            ✉️
                          </span>
                          {contact.email}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Knappar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => onCreateCV(job)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-shadow"
              >
                <FileText className="w-4 h-4 mr-2" />
                Skapa CV
              </Button>
              <Button
                onClick={() => onCreateCoverLetter(job)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-shadow"
              >
                <Send className="w-4 h-4 mr-2" />
                Personligt brev
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


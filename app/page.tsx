'use client'

import { useState, useEffect } from 'react'
import { Search, Briefcase, MapPin, Clock, ChevronDown, ChevronUp, FileText, LogIn, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Image from "next/image"

type Job = {
  id: string;
  title: string;
  description: string;
  published_date: string;
  last_application_date: string;
  number_of_positions: number;
  employment_type: string;
  occupation: string;
  company_name: string;
  municipality: string;
  country: string;
  requires_experience: boolean;
  requires_license: boolean;
  requires_car: boolean;
  application_email: string | null;
  application_url: string | null;
  company_type: string;
  processed: boolean;
};

const cvTemplates = [
  { id: 'template1', name: 'Modern', image: '/cv-templates/2.png?height=600&width=200' },
  { id: 'template2', name: 'Klassisk', image: '/cv-templates/1.png?height=600&width=200' },
]

export default function JobSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [expandedJob, setExpandedJob] = useState<string | null>(null)
  const [isCreateCVOpen, setIsCreateCVOpen] = useState(false)
  const [isCreateCoverLetterOpen, setIsCreateCoverLetterOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [cvData, setCVData] = useState({
    experience: '',
    currentJob: '',
    qualities: '',
    template: 'template1',
  })
  const [coverLetterData, setCoverLetterData] = useState({
    introduction: '',
    motivation: '',
    skills: '',
    closing: '',
  })
  const [isInitialView, setIsInitialView] = useState(true)
  const [loading, setLoading] = useState(false); // Laddningsstatus
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 10

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sökning initierad med:", searchTerm);
    setIsInitialView(false);
    setLoading(true);

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
      setFilteredJobs(jobs);
    } catch (error) {
      console.error('Ett fel inträffade:', error);
      // Visa ett felmeddelande för användaren
    } finally {
      setLoading(false);
    }
  };

  const toggleJobExpansion = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId)
  }

  const handleCreateCV = () => {
    setIsCreateCVOpen(true)
  }

  const handleCreateCoverLetter = () => {
    setIsCreateCoverLetterOpen(true)
  }

  const handleCVSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('CV Data:', cvData)
    setIsCreateCVOpen(false)
  }

  const handleCoverLetterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Cover Letter Data:', coverLetterData)
    setIsCreateCoverLetterOpen(false)
  }

  const handleTemplateClick = (templateId: string) => {
    setCVData({...cvData, template: templateId})
  }

  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Komponenten för sidnavigering
  const Pagination = () => (
    <div className="flex justify-center items-center mt-8 space-x-1 sm:space-x-2">
      <Button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        size="sm"
        className="px-2 sm:px-3"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {Array.from({ length: totalPages }, (_, i) => (
        <Button
          key={i + 1}
          onClick={() => paginate(i + 1)}
          variant={currentPage === i + 1 ? "default" : "outline"}
          size="sm"
          className="px-2 sm:px-3"
        >
          {i + 1}
        </Button>
      )).slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 1))}
      <Button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        size="sm"
        className="px-2 sm:px-3"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">JobSearch</h1>
          <div className="flex items-center space-x-4">
            <Button onClick={() => setIsLoginOpen(true)} variant="outline">
              <LogIn className="h-4 w-4 mr-2" />
              Logga in
            </Button>
            <Button onClick={() => setIsRegisterOpen(true)} variant="outline">
              <UserPlus className="h-4 w-4 mr-2" />
              Registrera
            </Button>
          </div>
        </div>
      </header>

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
            
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Sök jobb, företag eller plats"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 sm:py-3 w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm text-base sm:text-lg"
                  />
                </div>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg transition duration-300 ease-in-out text-base sm:text-lg font-semibold shadow-md hover:shadow-lg w-full sm:w-auto">
                  Sök
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Laddningsindikator */}
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
                  className="w-full max-w-4xl mx-auto space-y-8"
                >
                  {currentJobs.map((job: Job) => (
                    <Card key={job.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white rounded-xl">
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
                          {expandedJob === job.id 
                            ? job.description 
                            : `${job.description.slice(0, 100)}...`}
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
                            onClick={() => toggleJobExpansion(job.id)} 
                            variant="outline" 
                            className="text-blue-600 hover:bg-blue-50 border-blue-300 w-full sm:w-auto transition-all duration-300 text-sm sm:text-base"
                          >
                            {expandedJob === job.id ? (
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
                          {expandedJob === job.id && (
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                              <Button onClick={handleCreateCV} className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base">
                                <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                                Skapa CV
                              </Button>
                              <Button onClick={handleCreateCoverLetter} className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base">
                                <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                                Skapa Personligt Brev
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Pagination />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>

      <Dialog open={isCreateCVOpen} onOpenChange={setIsCreateCVOpen}>
        <DialogContent className="sm:max-w-[700px] bg-white rounded-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-gray-900">Skapa ditt CV</DialogTitle>
            <DialogDescription className="text-lg text-gray-600 mt-2">
              Fyll i informationen nedan och välj en mall för ditt CV.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCVSubmit} className="mt-4">
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="experience" className="text-right text-gray-700 font-medium">
                  Erfarenhet
                </Label>
                <Input
                  id="experience"
                  className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  value={cvData.experience}
                  onChange={(e) => setCVData({...cvData, experience: e.target.value})}
                  placeholder="Antal års erfarenhet"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currentJob" className="text-right text-gray-700 font-medium">
                  Nuvarande jobb
                </Label>
                <Input
                  id="currentJob"
                  className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  value={cvData.currentJob}
                  onChange={(e) => setCVData({...cvData, currentJob: e.target.value})}
                  placeholder="Var jobbar du nu?"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="qualities" className="text-right text-gray-700 font-medium">
                  Egenskaper
                </Label>
                <Textarea
                  id="qualities"
                  className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  value={cvData.qualities}
                  onChange={(e) => setCVData({...cvData, qualities: e.target.value})}
                  placeholder="Dina främsta egenskaper"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right text-gray-700 font-medium mt-2">
                  CV Mall
                </Label>
                <div className="col-span-3 grid grid-cols-2 gap-6">
                  {cvTemplates.map((template) => (
                    <div 
                      key={template.id} 
                      className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
                        cvData.template === template.id ? 'ring-4 ring-blue-500 rounded-xl' : ''
                      }`}
                      onClick={() => handleTemplateClick(template.id)}
                    >
                      <Image
                        src={template.image}
                        alt={template.name}
                        width={300}
                        height={400}
                        className="rounded-lg border border-gray-300 hover:shadow-lg transition-shadow duration-300"
                      />
                      <span className="mt-2 text-lg font-medium">{template.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white transition duration-300 ease-in-out px-6 py-3 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg">
                Spara CV
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateCoverLetterOpen} onOpenChange={setIsCreateCoverLetterOpen}>
        <DialogContent className="sm:max-w-[700px] bg-white rounded-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-gray-900">Skapa ditt Personliga Brev</DialogTitle>
            <DialogDescription className="text-lg text-gray-600 mt-2">
              Fyll i informationen nedan för att skapa ditt personliga brev.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCoverLetterSubmit} className="mt-4">
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="introduction" className="text-right text-gray-700 font-medium">
                  Introduktion
                </Label>
                <Textarea
                  id="introduction"
                  className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  value={coverLetterData.introduction}
                  onChange={(e) => setCoverLetterData({...coverLetterData, introduction: e.target.value})}
                  placeholder="Skriv en kort introduktion om dig själv"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="motivation" className="text-right text-gray-700 font-medium">
                  Motivation
                </Label>
                <Textarea
                  id="motivation"
                  className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  value={coverLetterData.motivation}
                  onChange={(e) => setCoverLetterData({...coverLetterData, motivation: e.target.value})}
                  placeholder="Varför är du intresserad av denna position?"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="skills" className="text-right text-gray-700 font-medium">
                  Färdigheter
                </Label>
                <Textarea
                  id="skills"
                  className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  value={coverLetterData.skills}
                  onChange={(e) => setCoverLetterData({...coverLetterData, skills: e.target.value})}
                  placeholder="Beskriv dina relevanta färdigheter och erfarenheter"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="closing" className="text-right text-gray-700 font-medium">
                  Avslutning
                </Label>
                <Textarea
                  id="closing"
                  className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  value={coverLetterData.closing}
                  onChange={(e) => setCoverLetterData({...coverLetterData, closing: e.target.value})}
                  placeholder="Skriv en avslutande mening"
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white transition duration-300 ease-in-out px-6 py-3 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg">
                Spara Personligt Brev
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white rounded-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-gray-900">Logga in</DialogTitle>
            <DialogDescription className="text-lg text-gray-600 mt-2">
              Ange dina inloggningsuppgifter nedan.
            </DialogDescription>
          </DialogHeader>
          <form className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-post</Label>
              <Input id="email" type="email" placeholder="din@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Lösenord</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">Logga in</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white rounded-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-gray-900">Registrera</DialogTitle>
            <DialogDescription className="text-lg text-gray-600 mt-2">
              Skapa ett nytt konto.
            </DialogDescription>
          </DialogHeader>
          <form className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-email">E-post</Label>
              <Input id="register-email" type="email" placeholder="din@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password">Lösenord</Label>
              <Input id="register-password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Bekräfta lösenord</Label>
              <Input id="confirm-password" type="password" required />
            </div>
            <Button type="submit" className="w-full">Registrera</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

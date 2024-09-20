'use client'

import { useState } from 'react'
import { Search, Briefcase, MapPin, Clock, ChevronDown, ChevronUp, FileText, LogIn, UserPlus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Image from "next/image"

const jobs = [
  { 
    id: 1, 
    title: 'Frontend Developer', 
    company: 'Tech Co', 
    location: 'Stockholm', 
    type: 'Heltid',
    description: 'Vi söker en passionerad Frontend Developer med erfarenhet av React och modern webbteknologi. Du kommer att arbeta i ett agilt team för att skapa användarvänliga och innovativa webbapplikationer.'
  },
  { 
    id: 2, 
    title: 'UX Designer', 
    company: 'Design Studio', 
    location: 'Göteborg', 
    type: 'Deltid',
    description: 'Design Studio söker en kreativ UX Designer för att hjälpa till att forma framtidens digitala upplevelser. Du kommer att arbeta nära med kunder och utvecklingsteam för att skapa intuitiva och engagerande användargränssnitt.'
  },
  { 
    id: 3, 
    title: 'Data Analyst', 
    company: 'Data Corp', 
    location: 'Malmö', 
    type: 'Projektanställning',
    description: 'Data Corp letar efter en skicklig Data Analyst för att hjälpa oss utvinna värdefulla insikter från komplexa datamängder. Du kommer att arbeta med avancerade analysverktyg och bidra till datadrivna beslut.'
  },
  { 
    id: 4, 
    title: 'Backend Engineer', 
    company: 'Software Inc', 
    location: 'Uppsala', 
    type: 'Heltid',
    description: 'Software Inc söker en erfaren Backend Engineer för att utveckla och underhålla vår molnbaserade plattform. Du kommer att arbeta med mikroservicearkitektur och vara en nyckelspelare i vårt tekniska team.'
  },
]

const cvTemplates = [
  { id: 'template1', name: 'Modern', image: '/cv-templates/2.png?height=600&width=200' },
  { id: 'template2', name: 'Klassisk', image: '/cv-templates/1.png?height=600&width=200' },
]

export default function JobSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredJobs, setFilteredJobs] = useState(jobs)
  const [expandedJob, setExpandedJob] = useState<number | null>(null)
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsInitialView(false)
    const filtered = jobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredJobs(filtered)
  }

  const toggleJobExpansion = (jobId: number) => {
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
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Sök jobb, företag eller plats"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm text-lg"
                  />
                </div>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition duration-300 ease-in-out text-lg font-semibold shadow-md hover:shadow-lg">
                  Sök
                </Button>
              </div>
            </form>
          </motion.div>

          <AnimatePresence>
            {!isInitialView && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl mx-auto space-y-8"
              >
                {filteredJobs.map(job => (
                  <Card key={job.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white rounded-xl">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                      <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">{job.title}</CardTitle>
                      <CardDescription className="text-lg sm:text-xl text-gray-700 mt-2">{job.company}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-4">
                        <span className="flex items-center">
                          <Briefcase className="h-5 w-5 mr-2 text-blue-500" />
                          {job.company}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-5 w-5 mr-2 text-green-500" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-purple-500" />
                          {job.type}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        {expandedJob === job.id ? job.description : `${job.description.slice(0, 150)}...`}
                      </p>
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <Button 
                          onClick={() => toggleJobExpansion(job.id)} 
                          variant="outline" 
                          className="text-blue-600 hover:bg-blue-50 border-blue-300 w-full sm:w-auto transition-all duration-300"
                        >
                          {expandedJob === job.id ? (
                            <>
                              <ChevronUp className="h-5 w-5 mr-2" />
                              Visa mindre
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-5 w-5 mr-2" />
                              Läs mer
                            </>
                          )}
                        </Button>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button onClick={handleCreateCV} className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto transition-all duration-300 shadow-md hover:shadow-lg">
                            <FileText className="h-5 w-5 mr-2" />
                            Skapa CV
                          </Button>
                          <Button onClick={handleCreateCoverLetter} className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto transition-all duration-300 shadow-md hover:shadow-lg">
                            <FileText className="h-5 w-5 mr-2" />
                            Skapa Personligt Brev
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
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

import { useState, useCallback, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { toast } from 'react-hot-toast'

interface CVDialogProps {
  isOpen: boolean;
  onClose: () => void;
  jobDescription: string;
  jobTitle: string;
}

const cvTemplates = [
  { id: 'template1', name: 'Modern', image: '/cv-templates/2.png' },
  { id: 'template2', name: 'Klassisk', image: '/cv-templates/1.png' },
]

export default function CVDialog({ isOpen, onClose, jobDescription, jobTitle }: CVDialogProps) {
  const [cvData, setCVData] = useState({
    name: "",
    years_of_experience: "",
    traits: "",
    company: "",
    template: 'template1',
    other: "", // Lägg till detta nya fält
  })
  const [isLoading, setIsLoading] = useState(false)
  const [cvUrl, setCvUrl] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    console.log("Försöker generera CV...")
    
    const dataToSend = {
      Jobbtitel: jobTitle,
      description: jobDescription,
      years_of_experience: parseInt(cvData.years_of_experience) || 0,
      traits: cvData.traits,
      company: cvData.company,
      name: cvData.name,
      other: cvData.other // Lägg till detta nya fält
    }

    try {
      console.log("Skickar data:", dataToSend)
      const response = await fetch('https://3llgqvm1-5001.euw.devtunnels.ms/generate_cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.url) {
        setCvUrl(result.url)
      } else if (result.html) {
        const blob = new Blob([result.html], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        setCvUrl(url)
      } else {
        throw new Error('Inget giltigt CV-innehåll returnerades från servern')
      }

      toast.success('CV genererat framgångsrikt!')
    } catch (error) {
      console.error('Fel vid CV-generering:', error)
      toast.error('Något gick fel vid generering av CV. Försök igen.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTemplateClick = useCallback((templateId: string) => {
    setCVData(prev => ({...prev, template: templateId}))
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-2xl p-4 sm:p-6" ref={dialogRef}>
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-3xl font-bold text-indigo-800 mb-2">Skapa ditt CV</DialogTitle>
          <DialogDescription className="text-base sm:text-lg text-indigo-600">
            Fyll i informationen nedan och välj en mall för ditt CV. Jobbeskrivningen och jobbtiteln kommer att användas automatiskt.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-indigo-700 font-semibold">Ditt namn</Label>
              <Input
                id="name"
                value={cvData.name}
                onChange={(e) => setCVData({...cvData, name: e.target.value})}
                className="mt-1 bg-white bg-opacity-70 border-indigo-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Ditt fullständiga namn"
              />
            </div>
            <div>
              <Label htmlFor="years_of_experience" className="text-indigo-700 font-semibold">Års erfarenhet</Label>
              <Input
                id="years_of_experience"
                type="number"
                value={cvData.years_of_experience}
                onChange={(e) => setCVData({...cvData, years_of_experience: e.target.value})}
                className="mt-1 bg-white bg-opacity-70 border-indigo-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Antal års erfarenhet"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="company" className="text-indigo-700 font-semibold">Nuvarande företag</Label>
            <Input
              id="company"
              value={cvData.company}
              onChange={(e) => setCVData({...cvData, company: e.target.value})}
              className="mt-1 bg-white bg-opacity-70 border-indigo-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Företag du jobbar på"
            />
          </div>
          <div>
            <Label htmlFor="traits" className="text-indigo-700 font-semibold">Egenskaper</Label>
            <Textarea
              id="traits"
              value={cvData.traits}
              onChange={(e) => setCVData({...cvData, traits: e.target.value})}
              className="mt-1 bg-white bg-opacity-70 border-indigo-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Dina främsta egenskaper (kommaseparerade)"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="other" className="text-indigo-700 font-semibold">Övrig information</Label>
            <Textarea
              id="other"
              value={cvData.other}
              onChange={(e) => setCVData({...cvData, other: e.target.value})}
              className="mt-1 bg-white bg-opacity-70 border-indigo-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Annan relevant information du vill inkludera"
              rows={3}
            />
          </div>
          <div>
            <Label className="text-indigo-700 font-semibold mb-2 block">CV Mall</Label>
            <div className="grid grid-cols-2 gap-4">
              {cvTemplates.map((template) => (
                <div 
                  key={template.id} 
                  className={`flex flex-col items-center cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    cvData.template === template.id ? 'ring-4 ring-indigo-500 rounded-xl shadow-lg' : 'hover:shadow-md'
                  }`}
                  onClick={() => handleTemplateClick(template.id)}
                >
                  <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg">
                    <Image
                      src={template.image}
                      alt={template.name}
                      layout="fill"
                      objectFit="contain"
                      className="transition-transform duration-300 transform hover:scale-110"
                    />
                  </div>
                  <span className="mt-2 text-sm font-medium text-indigo-700 bg-white bg-opacity-70 px-3 py-1 rounded-full">
                    {template.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row justify-between items-center">
            <Button 
              type="submit" 
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition duration-300 ease-in-out px-6 py-2 text-base font-semibold rounded-full shadow-md hover:shadow-xl transform hover:scale-105 mb-2 sm:mb-0"
              disabled={isLoading}
            >
              {isLoading ? 'Genererar...' : 'Generera CV'}
            </Button>
            {cvUrl && (
              <Button
                type="button"
                onClick={() => window.open(cvUrl, '_blank')}
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white transition duration-300 ease-in-out px-6 py-2 text-base font-semibold rounded-full shadow-md hover:shadow-xl transform hover:scale-105"
              >
                Öppna genererat CV
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
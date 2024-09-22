import { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface CVDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cvData: any) => void;
}

const cvTemplates = [
  { id: 'template1', name: 'Modern', image: '/cv-templates/2.png' },
  { id: 'template2', name: 'Klassisk', image: '/cv-templates/1.png' },
]

export default function CVDialog({ isOpen, onClose, onSubmit }: CVDialogProps) {
  const [cvData, setCVData] = useState({
    experience: '',
    currentJob: '',
    qualities: '',
    template: 'template1',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(cvData)
    onClose()
  }

  const handleTemplateClick = useCallback((templateId: string) => {
    setCVData(prev => ({...prev, template: templateId}))
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-2xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-3xl font-bold text-indigo-800 mb-2">Skapa ditt CV</DialogTitle>
          <DialogDescription className="text-base sm:text-lg text-indigo-600">
            Fyll i informationen nedan och välj en mall för ditt CV.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experience" className="text-indigo-700 font-semibold">Erfarenhet</Label>
              <Input
                id="experience"
                value={cvData.experience}
                onChange={(e) => setCVData({...cvData, experience: e.target.value})}
                className="mt-1 bg-white bg-opacity-70 border-indigo-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Antal års erfarenhet"
              />
            </div>
            <div>
              <Label htmlFor="currentJob" className="text-indigo-700 font-semibold">Nuvarande jobb</Label>
              <Input
                id="currentJob"
                value={cvData.currentJob}
                onChange={(e) => setCVData({...cvData, currentJob: e.target.value})}
                className="mt-1 bg-white bg-opacity-70 border-indigo-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Var jobbar du nu?"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="qualities" className="text-indigo-700 font-semibold">Egenskaper</Label>
            <Textarea
              id="qualities"
              value={cvData.qualities}
              onChange={(e) => setCVData({...cvData, qualities: e.target.value})}
              className="mt-1 bg-white bg-opacity-70 border-indigo-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Dina främsta egenskaper"
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
          <DialogFooter>
            <Button 
              type="submit" 
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition duration-300 ease-in-out px-6 py-2 text-base font-semibold rounded-full shadow-md hover:shadow-xl transform hover:scale-105"
            >
              Spara och Skapa CV
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
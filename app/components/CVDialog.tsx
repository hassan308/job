import { useState } from 'react'
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
  { id: 'template1', name: 'Modern', image: '/cv-templates/2.png?height=600&width=200' },
  { id: 'template2', name: 'Klassisk', image: '/cv-templates/1.png?height=600&width=200' },
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

  const handleTemplateClick = (templateId: string) => {
    setCVData({...cvData, template: templateId})
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-gray-900">Skapa ditt CV</DialogTitle>
          <DialogDescription className="text-lg text-gray-600 mt-2">
            Fyll i informationen nedan och välj en mall för ditt CV.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4">
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
  )
}
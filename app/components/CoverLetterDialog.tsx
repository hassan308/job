import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface CoverLetterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (coverLetterData: any) => void;
}

export default function CoverLetterDialog({ isOpen, onClose, onSubmit }: CoverLetterDialogProps) {
  const [coverLetterData, setCoverLetterData] = useState({
    introduction: '',
    motivation: '',
    skills: '',
    closing: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(coverLetterData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-gray-900">Skapa ditt Personliga Brev</DialogTitle>
          <DialogDescription className="text-lg text-gray-600 mt-2">
            Fyll i informationen nedan för att skapa ditt personliga brev.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4">
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
  )
}
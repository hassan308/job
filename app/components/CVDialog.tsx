import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2, Lock, ExternalLink } from 'lucide-react';
import Image from 'next/image'

interface CVDialogProps {
  isOpen: boolean;
  onClose: () => void;
  jobDescription: string;
  jobTitle: string;
  onLoginRequired: () => void;
}

interface UserData {
  displayName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string;
  experience: string;
  education: string;
  certifications: string;
  lastUpdated: number;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const cvTemplates = [
  { id: 'template1', name: 'Klassisk', image: '/cv-templates/2.png', free: true },
  { id: 'template2', name: 'Modern', image: '/cv-templates/1.png', free: false },
  { id: 'template3', name: 'Kreativ', image: '/cv-templates/3.png', free: false },
  { id: 'template4', name: 'Professionell', image: '/cv-templates/4.png', free: false },
];

export default function CVDialog({ isOpen, onClose, jobDescription, jobTitle, onLoginRequired }: CVDialogProps) {
  const [userData, setUserData] = useState<UserData>({
    displayName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: '',
    experience: '',
    education: '',
    certifications: '',
    lastUpdated: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(cvTemplates[0].id);
  const [generatedCVUrl, setGeneratedCVUrl] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Anta att enheter med bredd 768px eller mindre är mobila
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        onLoginRequired();
        return;
      }

      const cachedData = localStorage.getItem('userData');
      const now = Date.now();

      if (cachedData) {
        const parsedData: UserData = JSON.parse(cachedData);
        if (now - parsedData.lastUpdated < CACHE_DURATION) {
          setUserData(parsedData);
          return;
        }
      }

      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const firebaseData = userDoc.data() as Omit<UserData, 'lastUpdated'>;
        const newUserData = {
          ...firebaseData,
          displayName: auth.currentUser.displayName || '',
          email: auth.currentUser.email || '',
          lastUpdated: now,
        };
        setUserData(newUserData);
        localStorage.setItem('userData', JSON.stringify(newUserData));
      }
    };

    if (isOpen) {
      setGeneratedCVUrl(null);
      fetchUserData();
    }
  }, [isOpen, onLoginRequired, jobTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedTemplateObj = cvTemplates.find(template => template.id === selectedTemplate);
    if (!selectedTemplateObj?.free) {
      alert('Detta är en PRO-mall. Vänligen uppgradera för att använda denna mall.');
      return;
    }
    setIsLoading(true);
    setGeneratedCVUrl(null);

    const cvData = {
      ...userData,
      Jobbtitel: jobTitle,
      jobDescription: jobDescription,
      template: selectedTemplate,
    };
    
    console.log('Data som skickas till backend:', JSON.stringify(cvData, null, 2));
    
    try {
      const response = await fetch('https://smidra.com/generate_cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cvData),
      });

      if (!response.ok) {
        throw new Error('Något gick fel vid skapande av CV');
      }

      const result = await response.json();
      
      if (!isMobile) {
        // För desktop, öppna CV:t i en ny flik
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(result.html);
          newWindow.document.close();
        } else {
          console.error('Kunde inte öppna ny flik. Kontrollera att popup-blockerare är avstängda.');
        }
        onClose();
      } else {
        // För mobil, spara URL:en för senare användning
        setGeneratedCVUrl(URL.createObjectURL(new Blob([result.html], {type: 'text/html'})));
      }

    } catch (error) {
      console.error('Fel vid skapande av CV:', error);
      // Här kan du lägga till felhantering, t.ex. visa ett felmeddelande för användaren
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const openGeneratedCV = () => {
    if (generatedCVUrl) {
      // Öppna bara URL:en i ny flik utan att generera nytt CV
      window.open(generatedCVUrl, '_blank');
    }
  };

  if (!auth.currentUser) {
    return null; // Returnera null om användaren inte är inloggad
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-blue-700">Skapa CV för {jobTitle}</DialogTitle>
          <DialogDescription className="text-lg text-blue-500 mt-2">
            Verifiera din information och välj en mall för ditt CV.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="displayName">Namn</Label>
              <Input id="displayName" name="displayName" value={userData.displayName} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="email">E-post</Label>
              <Input id="email" name="email" value={userData.email} onChange={handleInputChange} readOnly />
            </div>
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" name="phone" value={userData.phone} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="location">Plats</Label>
              <Input id="location" name="location" value={userData.location} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="bio">Sammanfattning</Label>
              <Textarea id="bio" name="bio" value={userData.bio} onChange={handleInputChange} rows={3} />
            </div>
            <div>
              <Label htmlFor="skills">Färdigheter</Label>
              <Textarea id="skills" name="skills" value={userData.skills} onChange={handleInputChange} rows={3} />
            </div>
            <div>
              <Label htmlFor="experience">Arbetslivserfarenhet</Label>
              <Textarea id="experience" name="experience" value={userData.experience} onChange={handleInputChange} rows={4} />
            </div>
            <div>
              <Label htmlFor="education">Utbildning</Label>
              <Textarea id="education" name="education" value={userData.education} onChange={handleInputChange} rows={3} />
            </div>
            <div>
              <Label htmlFor="certifications">Certifieringar</Label>
              <Textarea id="certifications" name="certifications" value={userData.certifications} onChange={handleInputChange} rows={3} />
            </div>
          </div>
          
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Välj CV Mall</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cvTemplates.map((template) => (
                <div 
                  key={template.id}
                  className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    selectedTemplate === template.id ? 'ring-4 ring-blue-500 rounded-lg shadow-lg' : 'hover:shadow-md'
                  } ${!template.free ? 'opacity-50' : ''}`}
                  onClick={() => template.free && setSelectedTemplate(template.id)}
                >
                  <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg">
                    <Image
                      src={template.image}
                      alt={template.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 transform hover:scale-110"
                    />
                    {!template.free && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Lock className="text-white w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-center font-medium text-blue-600">{template.name}</p>
                  {!template.free && (
                    <span className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full">PRO</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {!generatedCVUrl ? (
            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow-md hover:shadow-lg transition duration-300"
              disabled={isLoading}
              onClick={handleSubmit}  // Generera CV endast när "Skapa CV" klickas
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Genererar CV...
                </>
              ) : (
                'Skapa CV'
              )}
            </Button>
          ) : (
            <Button 
              type="button"  // Ändra till type="button" för att förhindra form submission
              onClick={openGeneratedCV}  // Använd openGeneratedCV istället för handleSubmit
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full shadow-md hover:shadow-lg transition duration-300"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Öppna genererat CV
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
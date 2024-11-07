// CVDialog.tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2, Lock, ExternalLink, FileText } from 'lucide-react';
import Image from 'next/image';
import { API_ENDPOINTS } from '../config/api';

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
      jobTitle: jobTitle, // Ändrat från Jobbtitel
      jobDescription: jobDescription,
      template: selectedTemplate,
    };
    
    console.log('Data som skickas till backend:', JSON.stringify(cvData, null, 2));
    
    try {
      const response = await fetch(API_ENDPOINTS.generateCV, {
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
        <DialogHeader className="border-b border-gray-100 pb-6">
          <DialogTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Skapa CV för {jobTitle}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-500 mt-1">
            Verifiera din information och välj en mall för ditt CV.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Personlig information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="displayName" className="text-sm text-gray-600 font-medium">Namn</Label>
                <Input 
                  id="displayName" 
                  name="displayName" 
                  value={userData.displayName} 
                  onChange={handleInputChange}
                  className="mt-1 border border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm text-gray-600 font-medium">E-post</Label>
                <Input 
                  id="email" 
                  name="email" 
                  value={userData.email} 
                  onChange={handleInputChange} 
                  readOnly 
                  className="mt-1 border border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm text-gray-600 font-medium">Telefon</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={userData.phone} 
                  onChange={handleInputChange}
                  className="mt-1 border border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="location" className="text-sm text-gray-600 font-medium">Plats</Label>
                <Input 
                  id="location" 
                  name="location" 
                  value={userData.location} 
                  onChange={handleInputChange}
                  className="mt-1 border border-gray-300"
                />
              </div>
            </div>

            {/* Textfält */}
            <div className="space-y-4 pt-2">
              {[
                { id: 'bio', label: 'Sammanfattning', rows: 3 },
                { id: 'skills', label: 'Färdigheter', rows: 3 },
                { id: 'experience', label: 'Arbetslivserfarenhet', rows: 4 },
                { id: 'education', label: 'Utbildning', rows: 3 },
                { id: 'certifications', label: 'Certifieringar', rows: 3 }
              ].map((field) => (
                <div key={field.id}>
                  <Label htmlFor={field.id} className="text-sm text-gray-600 font-medium">{field.label}</Label>
                  <Textarea 
                    id={field.id} 
                    name={field.id} 
                    value={userData[field.id as keyof typeof userData] as string} 
                    onChange={handleInputChange} 
                    rows={field.rows}
                    className="mt-1 border border-gray-300 w-full"
                  />
                </div>
              ))}
            </div>
          </div>
            
          {/* CV Mallar */}
          <div className="pt-4 border-t border-gray-100">
            <Label className="text-sm text-gray-600 block mb-3">Välj CV Mall</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {cvTemplates.map((template) => (
                <div 
                  key={template.id}
                  className={`relative cursor-pointer rounded-lg overflow-hidden ${
                    selectedTemplate === template.id 
                      ? 'ring-2 ring-blue-500' 
                      : 'hover:ring-2 hover:ring-gray-200'
                  } ${!template.free ? 'opacity-75' : ''}`}
                  onClick={() => template.free && setSelectedTemplate(template.id)}
                >
                  <Image
                    src={template.image}
                    alt={template.name}
                    width={200}
                    height={280}
                    className="w-full h-auto"
                  />
                  {!template.free && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20">
                      <Lock className="text-white w-6 h-6" />
                    </div>
                  )}
                  <p className="text-sm text-gray-700 text-center mt-1">{template.name}</p>
                  {!template.free && (
                    <span className="absolute top-2 right-2 bg-blue-500 text-xs font-medium px-1.5 py-0.5 rounded text-white">
                      PRO
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
            
          {/* Knappar */}
          <div className="pt-4 border-t border-gray-100">
            {!generatedCVUrl ? (
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
                disabled={isLoading}
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
                type="button"
                onClick={openGeneratedCV}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Öppna genererat CV
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

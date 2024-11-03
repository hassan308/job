export interface UserData {
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

export interface Job {
  id: string;
  title: string;
  description: string;
  company: {
    name: string;
  };
  workplace: {
    municipality: string | null;
  };
  published_date: string;
  last_application_date: string;
  employment_type: string;
  workTimeExtent: string;
  duration: string;
  positions: number;
  salaryDescription?: string;
  workExperiences?: {
    required: boolean;
    description: string;
  }[];
  application?: {
    webAddress?: string;
    email?: string;
    reference?: string;
  };
} 
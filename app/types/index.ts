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

export interface WorkExperience {
  required: boolean;
  description: string;
}

export interface JobApplication {
  webAddress?: string;
  email?: string;
  reference?: string;
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
  // API response fields
  employment_type: string;
  published_date: string;
  last_application_date: string;
  
  // Frontend display fields (mapped from API fields)
  employmentType: string;
  publishedDate: string;
  lastApplicationDate: string;
  
  // Additional fields
  workTimeExtent: string;
  duration: string;
  positions: number;
  salaryDescription?: string;
  workExperiences?: WorkExperience[];
  application?: JobApplication;
  driving_license_required?: boolean;
  own_car?: boolean;
} 
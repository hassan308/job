// type.ts
export interface Job {
    id: string;
    title: string;
    description: string;
    company: {
      name: string;
      city?: string;
      email?: string;
      organisationNumber?: string; // Ändrat från organisation_number
      phoneNumber?: string; // Ändrat från phone_number
      webAddress?: string; // Ändrat från web_address
      logotype?: string;
    };
    workplace: {
      city: string;
      country: string;
      municipality: string;
      region: string;
    };
    employmentType: string; // Ändrat från employment_type
    positions: number;
    requiresExperience: boolean; // Ändrat från requires_experience
    salaryType?: string; // Ändrat från salary_type
    salaryDescription?: string; // Ändrat från salary_description
    lastApplicationDate: string; // Ändrat från last_application_date
    publishedDate: string; // Ändrat från published_date
    workTimeExtent?: string; // Ändrat från work_time_extent
    duration?: string;
    drivingLicenseRequired?: boolean; // Ändrat från driving_license_required
    ownCar?: boolean; // Ändrat från own_car
    workExperiences?: Array<{
      required: boolean;
      experience: string;
    }>;
    application: {
      email?: string;
      webAddress?: string; // Ändrat från web_address
      reference?: string;
    };
    contacts?: Array<{
      description: string;
      phoneNumber?: string;
      email?: string;
    }>;
  }
  
  export interface FilterState {
    employmentTypes: string[];
    municipalities: string[];
    experienceRequired: string[];
  }
  
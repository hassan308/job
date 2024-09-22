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
  working_hours_type: string;
  own_car: boolean;
  driving_license_required: boolean;
  experience_required: boolean;
}
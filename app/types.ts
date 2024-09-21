export interface Job {
  id: string;
  title: string;
  company_name: string;
  description: string;
  municipality: string;
  employment_type: string;
  published_date: string;
  last_application_date: string;
  requires_experience: boolean;
  requires_license: boolean;
  requires_car: boolean;
  company_type: string;
}
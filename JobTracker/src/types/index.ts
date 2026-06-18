export type ApplicationStatus = 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

export type JobType = 'Internship' | 'Full-time' | 'Part-time';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Application {
  id: number | string;
  company_name: string;
  job_title: string;
  job_type: JobType;
  status: ApplicationStatus;
  applied_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ApplicationFormData {
  company_name: string;
  job_title: string;
  job_type: JobType;
  status: ApplicationStatus;
  applied_date: string;
  notes?: string;
}

export interface ApplicationFilters {
  status?: ApplicationStatus | '';
  search?: string;
}

export interface FormErrors {
  company_name?: string;
  job_title?: string;
  applied_date?: string;
}

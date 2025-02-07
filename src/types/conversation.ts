
export interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export interface ProfileData {
  [key: string]: string | boolean | Record<string, any> | null;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  blood_type?: string;
  allergies?: string;
  current_medications?: string;
  chronic_conditions?: string;
  primary_physician?: string;
  insurance_provider?: string;
  insurance_number?: string;
  smoker?: boolean;
  profile_photo?: string;
  voice_preferences?: Record<string, any>;
  ai_analyzed_data?: Record<string, any>;
}


import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface AppointmentDetails {
  appointment_type: string;
  appointment_date: string;
  appointment_time: string;
  notification_methods: string[];
  doctor_id?: number;
  status: string;
}

export class AppointmentService {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async bookAppointment(details: AppointmentDetails) {
    const appointmentDate = new Date(details.appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      throw new Error('Appointment date must be today or in the future');
    }

    const { data, error } = await this.supabase
      .from('appointments')
      .insert([details])
      .select()
      .single();

    if (error) {
      console.error('Error booking appointment:', error);
      throw new Error('Failed to book appointment');
    }

    return data;
  }
}


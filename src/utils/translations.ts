export const translations = {
  en: {
    common: {
      welcome: "Welcome to Rural Healthcare Portal",
      selectRole: "Please select your role to continue",
      patientPortal: "Patient Portal",
      providerPortal: "Provider Portal",
      myProfile: "My Profile",
      back: "Back",
      dashboard: "Dashboard",
      appointments: "Appointments",
      medications: "Medications",
      healthRecords: "Health Records",
      settings: "Settings",
      logout: "Logout",
      requestAssistance: "Request Assistance",
      learnMore: "Learn More",
      contactUs: "Contact Us",
    },
    accessibility: {
      fontSize: "Font Size",
      language: "Language",
      requestAssistance: "Request Assistance",
      voiceCommands: "Voice Commands",
    },
    dashboard: {
      quickActions: "Quick Actions",
      appointmentBooking: "Appointment Booking",
      scheduleVisit: "Schedule your next visit with our healthcare providers.",
      messages: "Messages & Notifications",
      viewMessages: "View your messages and important notifications.",
      profile: "My Profile",
      manageProfile: "Manage your personal information and preferences.",
      aiAssistant: "AI Health Assistant",
      aiGuidance: "Get personalized health guidance and support.",
      medicalSuggestions: "Medical Suggestions",
      exerciseTitle: "Exercise Recommendation",
      exerciseDesc: "Consider a 30-minute daily walk to improve cardiovascular health.",
      dietTitle: "Diet Suggestion",
      dietDesc: "Increase your daily water intake to 8 glasses for better hydration.",
      healthAlerts: "Important Health Alerts",
      medicationReminder: "Medication Reminder",
      medicationDesc: "Don't forget to take your evening medication at 8:00 PM",
      labWork: "Upcoming Lab Work",
      labWorkDesc: "Schedule your quarterly blood work before March 30, 2024",
    },
    messages: {
      title: "Messages & Notifications",
      medicationAlerts: "Medication Alerts",
      appointmentAlerts: "Appointment Alerts",
      doctorsMessages: "Doctor's Messages",
      generalNotifications: "General Notifications",
    },
    appointment: {
      title: "Book an Appointment",
      selectType: "Select appointment type",
      selectClinic: "Select Clinic",
      selectDoctor: "Select Doctor",
      selectDate: "Select Date",
      selectTime: "Select Time",
      bookAppointment: "Book Appointment",
      summary: "Appointment Summary",
      type: "Type",
      clinic: "Clinic",
      doctor: "Doctor",
      date: "Date",
      time: "Time",
      notifications: "Notifications",
    },
    profile: {
      title: "Patient Profile",
      personalInfo: "Personal Information",
      contactInfo: "Contact Information",
      medicalHistory: "Medical History",
      currentConditions: "Current Conditions",
      medications: "Medications",
      allergies: "Allergies",
    },
    aboutUs: {
      title: "About Adams Rural Care",
      mission: "Our Mission",
      services: "Our Services",
      team: "Our Team",
      contact: "Contact Us",
    },
  },
  es: {
    common: {
      welcome: "Bienvenido al Portal de Salud Rural",
      selectRole: "Por favor seleccione su rol para continuar",
      patientPortal: "Portal del Paciente",
      providerPortal: "Portal del Proveedor",
      myProfile: "Mi Perfil",
      back: "Volver",
      dashboard: "Tablero",
      appointments: "Citas",
      medications: "Medicamentos",
      healthRecords: "Registros de Salud",
      settings: "Configuración",
      logout: "Cerrar Sesión",
      requestAssistance: "Solicitar Asistencia",
      learnMore: "Más Información",
      contactUs: "Contáctenos",
    },
    accessibility: {
      fontSize: "Tamaño de Fuente",
      language: "Idioma",
      requestAssistance: "Solicitar Asistencia",
      voiceCommands: "Comandos de Voz",
    },
    dashboard: {
      quickActions: "Acciones Rápidas",
      appointmentBooking: "Reserva de Citas",
      scheduleVisit: "Programe su próxima visita con nuestros proveedores de salud.",
      messages: "Mensajes y Notificaciones",
      viewMessages: "Ver sus mensajes y notificaciones importantes.",
      profile: "Mi Perfil",
      manageProfile: "Administre su información personal y preferencias.",
      aiAssistant: "Asistente de Salud IA",
      aiGuidance: "Obtenga orientación y apoyo personalizado para su salud.",
      medicalSuggestions: "Sugerencias Médicas",
      exerciseTitle: "Recomendación de Ejercicio",
      exerciseDesc: "Considere caminar 30 minutos diarios para mejorar la salud cardiovascular.",
      dietTitle: "Sugerencia de Dieta",
      dietDesc: "Aumente su consumo diario de agua a 8 vasos para una mejor hidratación.",
      healthAlerts: "Alertas de Salud Importantes",
      medicationReminder: "Recordatorio de Medicación",
      medicationDesc: "No olvide tomar su medicamento de la noche a las 8:00 PM",
      labWork: "Próximo Análisis de Laboratorio",
      labWorkDesc: "Programe sus análisis de sangre trimestrales antes del 30 de marzo de 2024",
    },
    messages: {
      title: "Mensajes y Notificaciones",
      medicationAlerts: "Alertas de Medicación",
      appointmentAlerts: "Alertas de Citas",
      doctorsMessages: "Mensajes del Doctor",
      generalNotifications: "Notificaciones Generales",
    },
    appointment: {
      title: "Reservar una Cita",
      selectType: "Seleccionar tipo de cita",
      selectClinic: "Seleccionar Clínica",
      selectDoctor: "Seleccionar Doctor",
      selectDate: "Seleccionar Fecha",
      selectTime: "Seleccionar Hora",
      bookAppointment: "Reservar Cita",
      summary: "Resumen de la Cita",
      type: "Tipo",
      clinic: "Clínica",
      doctor: "Doctor",
      date: "Fecha",
      time: "Hora",
      notifications: "Notificaciones",
    },
    profile: {
      title: "Perfil del Paciente",
      personalInfo: "Información Personal",
      contactInfo: "Información de Contacto",
      medicalHistory: "Historia Médica",
      currentConditions: "Condiciones Actuales",
      medications: "Medicamentos",
      allergies: "Alergias",
    },
    aboutUs: {
      title: "Sobre Adams Rural Care",
      mission: "Nuestra Misión",
      services: "Nuestros Servicios",
      team: "Nuestro Equipo",
      contact: "Contáctenos",
    },
  },
};

export type Language = 'en' | 'es';
export type TranslationKey = keyof typeof translations.en;
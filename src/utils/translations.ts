export const translations = {
  en: {
    common: {
      welcome: "Welcome to Rural Healthcare Portal",
      subtitle: "Your virtual health companion—guiding you to the right care, when you need it.",
      getStarted: "Get Started",
      learnMore: "Learn More",
      welcomeDialog: "Welcome to Your Virtual Healthcare Journey",
      dialogDescription: "Here's what you can do with our virtual clinic platform",
      continueToDashboard: "Continue to Dashboard",
      features: {
        appointments: {
          title: "Book Appointments",
          description: "Schedule in-person, online, or home visit appointments with our healthcare providers."
        },
        aiAssistant: {
          title: "AI Health Assistant",
          description: "Get instant health guidance and preliminary assessments through our advanced AI system."
        },
        virtualConsultations: {
          title: "Virtual Consultations",
          description: "Connect with healthcare providers through video calls from the comfort of your home."
        },
        voiceAssistant: {
          title: "Voice Assistant",
          description: "Interact with our platform using voice commands for a hands-free healthcare experience."
        }
      },
      selectRole: "Please select your role to continue",
      patientPortal: "Patient Portal",
      providerPortal: "Provider Portal",
      myProfile: "My Profile",
      back: "Back",
      cancel: "Cancel",
      dashboard: "Dashboard",
      appointments: "Appointments",
      medications: "Medications",
      healthRecords: "Health Records",
      settings: "Settings",
      logout: "Logout",
    },
    appointments: {
      title: "Book Appointments",
      type: {
        label: "Appointment Type",
        select: "Select appointment type",
        online: "Online Consultation",
        inPerson: "In-Person Visit",
        homeVisit: "Home Visit"
      },
      clinic: {
        label: "Select Clinic",
        select: "Choose a clinic"
      },
      date: {
        label: "Select Date"
      },
      time: {
        label: "Select Time",
        select: "Choose a time"
      },
      book: "Book Appointment",
      summary: "Appointment Summary",
      details: {
        type: "Type",
        clinic: "Clinic",
        date: "Date",
        time: "Time"
      },
      missingInfo: "Missing Information",
      missingInfoDesc: "Please fill in all required fields",
      success: "Success",
      successDesc: "Your appointment has been successfully scheduled",
      error: "Error",
      errorDesc: "Failed to book appointment. Please try again."
    },
  },
  es: {
    common: {
      welcome: "Bienvenido al Portal de Salud Rural",
      subtitle: "Su compañero virtual de salud: guiándole hacia la atención adecuada cuando la necesite.",
      getStarted: "Comenzar",
      learnMore: "Más Información",
      welcomeDialog: "Bienvenido a Su Viaje de Salud Virtual",
      dialogDescription: "Esto es lo que puede hacer con nuestra plataforma de clínica virtual",
      continueToDashboard: "Continuar al Panel",
      features: {
        appointments: {
          title: "Programar Citas",
          description: "Programe citas presenciales, en línea o visitas a domicilio con nuestros proveedores de salud."
        },
        aiAssistant: {
          title: "Asistente de Salud IA",
          description: "Obtenga orientación de salud instantánea y evaluaciones preliminares a través de nuestro sistema de IA avanzado."
        },
        virtualConsultations: {
          title: "Consultas Virtuales",
          description: "Conéctese con proveedores de salud a través de videollamadas desde la comodidad de su hogar."
        },
        voiceAssistant: {
          title: "Asistente de Voz",
          description: "Interactúe con nuestra plataforma usando comandos de voz para una experiencia de salud sin manos."
        }
      },
      selectRole: "Por favor seleccione su rol para continuar",
      patientPortal: "Portal del Paciente",
      providerPortal: "Portal del Proveedor",
      myProfile: "Mi Perfil",
      back: "Volver",
      cancel: "Cancelar",
      dashboard: "Tablero",
      appointments: "Citas",
      medications: "Medicamentos",
      healthRecords: "Registros de Salud",
      settings: "Configuración",
      logout: "Cerrar Sesión",
    },
    appointments: {
      title: "Programar Citas",
      type: {
        label: "Tipo de Cita",
        select: "Seleccione el tipo de cita",
        online: "Consulta en Línea",
        inPerson: "Visita Presencial",
        homeVisit: "Visita a Domicilio"
      },
      clinic: {
        label: "Seleccionar Clínica",
        select: "Elija una clínica"
      },
      date: {
        label: "Seleccionar Fecha"
      },
      time: {
        label: "Seleccionar Hora",
        select: "Elija una hora"
      },
      book: "Programar Cita",
      summary: "Resumen de la Cita",
      details: {
        type: "Tipo",
        clinic: "Clínica",
        date: "Fecha",
        time: "Hora"
      },
      missingInfo: "Información Faltante",
      missingInfoDesc: "Por favor complete todos los campos requeridos",
      success: "Éxito",
      successDesc: "Su cita ha sido programada exitosamente",
      error: "Error",
      errorDesc: "Error al programar la cita. Por favor intente nuevamente."
    }
  }
};

export type Language = 'en' | 'es';
export type TranslationKey = keyof typeof translations.en;

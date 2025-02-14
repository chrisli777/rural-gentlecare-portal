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
    dialog: {
      confirmCancelTitle: "Are you sure?",
      confirmCancelDescription: "This action cannot be undone. This will permanently cancel your appointment.",
      keepAppointment: "No, keep appointment",
      confirmCancel: "Yes, cancel appointment"
    },
    dashboard: {
      upcomingAppointments: "Upcoming Appointments",
      recentMedications: "Recent Medications",
      healthMetrics: "Health Metrics",
      notifications: "Notifications",
      noAppointments: "No appointments found",
    },
    messages: {
      title: "Messages & Notifications",
      noMessages: "No messages to display",
      medicationAlerts: "Medication Alerts",
      appointmentAlerts: "Appointment Alerts",
      doctorsMessages: "Doctor's Messages",
      generalNotifications: "General Notifications",
      back: "Back"
    },
    aiAssistant: {
      title: "Healthcare Assistant",
      chat: "Chat",
      analysis: "Analysis",
      reports: "Reports",
      inputPlaceholder: "Type your message...",
      monthlyReport: "Monthly Health Summary",
      recommendations: "Recommendations",
      metrics: {
        bloodPressure: "Blood Pressure",
        bloodSugar: "Blood Sugar",
        weight: "Weight"
      }
    },
    accessibility: {
      voiceAssistant: "Voice Assistant",
      listening: "Listening...",
      notSupported: "Voice recognition not supported",
      commandRecognized: "Command recognized",
      fontSize: "Font Size",
      language: "Language",
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
    dialog: {
      confirmCancelTitle: "¿Está seguro?",
      confirmCancelDescription: "Esta acción no se puede deshacer. Esto cancelará permanentemente su cita.",
      keepAppointment: "No, mantener cita",
      confirmCancel: "Sí, cancelar cita"
    },
    dashboard: {
      upcomingAppointments: "Próximas Citas",
      recentMedications: "Medicamentos Recientes",
      healthMetrics: "Métricas de Salud",
      notifications: "Notificaciones",
      noAppointments: "No se encontraron citas",
    },
    messages: {
      title: "Mensajes y Notificaciones",
      noMessages: "No hay mensajes para mostrar",
      medicationAlerts: "Alertas de Medicamentos",
      appointmentAlerts: "Alertas de Citas",
      doctorsMessages: "Mensajes del Doctor",
      generalNotifications: "Notificaciones Generales",
      back: "Volver"
    },
    aiAssistant: {
      title: "Asistente de Salud",
      chat: "Chat",
      analysis: "Análisis",
      reports: "Informes",
      inputPlaceholder: "Escribe tu mensaje...",
      monthlyReport: "Resumen Mensual de Salud",
      recommendations: "Recomendaciones",
      metrics: {
        bloodPressure: "Presión Arterial",
        bloodSugar: "Azúcar en Sangre",
        weight: "Peso"
      }
    },
    accessibility: {
      voiceAssistant: "Asistente de Voz",
      listening: "Escuchando...",
      notSupported: "Reconocimiento de voz no soportado",
      commandRecognized: "Comando reconocido",
      fontSize: "Tamaño de Fuente",
      language: "Idioma",
    },
  }
};

export type Language = 'en' | 'es';
export type TranslationKey = keyof typeof translations.en;

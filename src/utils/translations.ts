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
    },
    accessibility: {
      voiceAssistant: "Voice Assistant",
      listening: "Listening for commands...",
      notSupported: "Voice recognition not supported",
      commandRecognized: "Command recognized",
      fontSize: "Font Size",
      language: "Language",
    },
    dashboard: {
      upcomingAppointments: "Upcoming Appointments",
      recentMedications: "Recent Medications",
      healthMetrics: "Health Metrics",
      notifications: "Notifications",
    },
    messages: {
      title: "Messages & Notifications",
      noMessages: "No messages to display",
      medicationAlerts: "Medication Alerts",
      appointmentAlerts: "Appointment Alerts",
      doctorsMessages: "Doctor's Messages",
      generalNotifications: "General Notifications"
    }
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
    },
    accessibility: {
      voiceAssistant: "Asistente de Voz",
      listening: "Escuchando comandos...",
      notSupported: "Reconocimiento de voz no soportado",
      commandRecognized: "Comando reconocido",
      fontSize: "Tamaño de Fuente",
      language: "Idioma",
    },
    dashboard: {
      upcomingAppointments: "Próximas Citas",
      recentMedications: "Medicamentos Recientes",
      healthMetrics: "Métricas de Salud",
      notifications: "Notificaciones",
    },
    messages: {
      title: "Mensajes y Notificaciones",
      noMessages: "No hay mensajes para mostrar",
      medicationAlerts: "Alertas de Medicamentos",
      appointmentAlerts: "Alertas de Citas",
      doctorsMessages: "Mensajes del Doctor",
      generalNotifications: "Notificaciones Generales"
    }
  },
};

export type Language = 'en' | 'es';
export type TranslationKey = keyof typeof translations.en;

export const translations = {
  en: {
    common: {
      welcome: "Welcome to Rural Healthcare Portal",
      selectRole: "Please select your role to continue",
      patientPortal: "Patient Portal",
      providerPortal: "Provider Portal",
      emergency: "Emergency Call",
      myProfile: "My Profile",
      back: "Back",
    },
    accessibility: {
      voiceAssistant: "Voice Assistant",
      listening: "Listening for commands...",
      notSupported: "Voice recognition not supported",
      commandRecognized: "Command recognized",
    },
  },
  es: {
    common: {
      welcome: "Bienvenido al Portal de Salud Rural",
      selectRole: "Por favor seleccione su rol para continuar",
      patientPortal: "Portal del Paciente",
      providerPortal: "Portal del Proveedor",
      emergency: "Llamada de Emergencia",
      myProfile: "Mi Perfil",
      back: "Volver",
    },
    accessibility: {
      voiceAssistant: "Asistente de Voz",
      listening: "Escuchando comandos...",
      notSupported: "Reconocimiento de voz no soportado",
      commandRecognized: "Comando reconocido",
    },
  },
};

export type Language = 'en' | 'es';
export type TranslationKey = keyof typeof translations.en;
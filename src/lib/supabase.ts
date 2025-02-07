
import { createClient } from '@supabase/supabase-js'

// Use the latest keys from your Supabase project
const supabaseUrl = 'https://pascdrwwolpnfljfzioj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc2Nkcnd3b2xwbmZsamZ6aW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MDU1NTIsImV4cCI6MjA1NDI4MTU1Mn0.fJXvzGjbbpqUWGREoZPVNSCVlaSU-cnP5iTWZA_oZ7g'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pascdrwwolpnfljfzioj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc2Nkcnd3b2xwbmZsamZ6aW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk3MjkxMzAsImV4cCI6MjAyNTMwNTEzMH0.mHuyJn70uPNPBQ30zZkOPk-2rBsXYOPrZnHofIWh_Qk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

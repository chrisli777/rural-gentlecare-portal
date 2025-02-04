
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pascdrwwolpnfljfzioj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc2NkcndXb2xwbmZsamZ6aW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkzNzgyOTcsImV4cCI6MjAyNDk1NDI5N30.2oMXKJRPkON4kFVEO2A4brgI2VmNs8zF-sVkWPvB7xk'

export const supabase = createClient(supabaseUrl, supabaseKey)

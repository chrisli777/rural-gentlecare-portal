
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pascdrwwolpnfljfzioj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc2Nkcnd3b2xwbmZsamZ6aW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkzOTc2NDAsImV4cCI6MjAyNDk3MzY0MH0.TS3ADoQBXhGTaVw_sxbKt31bFLvddTMrVnYlVLXkOkw'

export const supabase = createClient(supabaseUrl, supabaseKey)

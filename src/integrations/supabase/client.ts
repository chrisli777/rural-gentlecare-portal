// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pascdrwwolpnfljfzioj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc2Nkcnd3b2xwbmZsamZ6aW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MDU1NTIsImV4cCI6MjA1NDI4MTU1Mn0.fJXvzGjbbpqUWGREoZPVNSCVlaSU-cnP5iTWZA_oZ7g";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ptbfodbbwdymkgkuwlah.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0YmZvZGJid2R5bWtna3V3bGFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MDMzNjIsImV4cCI6MjA1OTA3OTM2Mn0.s6-jDKOf86QN5f99gMLV9jNnKxJPcvPqNISmelC7awg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://holgpcdvbyogevoenxix.supabase.co';  // Replace with your Supabase URL
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvbGdwY2R2YnlvZ2V2b2VueGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwMTU0NzQsImV4cCI6MjA0NzU5MTQ3NH0.reGnNMVilPCXASCEAb3k7uuWN1q4EDeQQgJB5pVnu2c';  // Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

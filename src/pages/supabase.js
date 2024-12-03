import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://holgpcdvbyogevoenxix.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvbGdwY2R2YnlvZ2V2b2VueGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwMTU0NzQsImV4cCI6MjA0NzU5MTQ3NH0.reGnNMVilPCXASCEAb3k7uuWN1q4EDeQQgJB5pVnu2c';
export const supabase = createClient(supabaseUrl, supabaseKey);


import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://uxacvctolqjuvqsctkov.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4YWN2Y3RvbHFqdXZxc2N0a292Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NTg1MjgsImV4cCI6MjA3NDAzNDUyOH0.evjII6BVr9FLeNirzp6n92sm_uAi1Y3ee9A6XrQswuA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

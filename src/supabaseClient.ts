import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xiiwrgfayopldcaaxqlk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpaXdyZ2ZheW9wbGRjYWF4cWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDMwMDQsImV4cCI6MjA2Nzk3OTAwNH0.pUC4hO__50nMmyMK_UbHwT_WvqAKau_gkoBH_gIdCXI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 

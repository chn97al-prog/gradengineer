/* ==========================================
   تجهيزات المهندس
   Supabase
========================================== */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://wwibtjohymbwtfhcylxy.supabase.co";

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3aWJ0am9oeW1id3RmaGN5bHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3ODk1ODEsImV4cCI6MjA5OTM2NTU4MX0.ZxohqQqBXo3dYiS9jVLgN5eFyNX6rGv7fJ8kL2mN9oU";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Global variable للاستخدام في الصفحات
window.supabase = supabase;
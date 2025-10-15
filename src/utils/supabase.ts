import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://iboasdvhlttvdyhleroj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlib2FzZHZobHR0dmR5aGxlcm9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5Mzg3ODgsImV4cCI6MjA1MDUxNDc4OH0.srBUiisGvTNytxuGIs8TI3ycgYIxqm_P6ZbEwfVcF-k'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
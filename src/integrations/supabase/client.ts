import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://rlwnxdqhdqmzjcfvrakw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsd254ZHFoZHFtempjZnZyYWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMzE0OTIsImV4cCI6MjA2NzYwNzQ5Mn0.mkS8I4vYSzhPO990Sw_Vi83GBbPUvi74hyBZljQY1Aw'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://robyahlnjexdpufdvizp.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvYnlhaGxuamV4ZHB1ZmR2aXpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTcwMzA5OTMsImV4cCI6MjAxMjYwNjk5M30.fejtSMaF61JVDXm3VsvclSaDSAw__MgxsM-V0fbJD8E"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
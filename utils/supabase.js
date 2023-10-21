import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://lmjbzajrseerdfkkpnls.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtamJ6YWpyc2VlcmRma2twbmxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc5MDM0NDQsImV4cCI6MjAxMzQ3OTQ0NH0.q4roTUfgJPeaujaUH-dRubq_NVX1lT1WF_odLN4ah4Y"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
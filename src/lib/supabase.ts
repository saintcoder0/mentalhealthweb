import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface Habit {
  id: string
  user_id: string
  name: string
  category: string
  completed: boolean
  is_permanent: boolean
  streak: number
  created_at: string
  updated_at: string
}

export interface HabitCompletion {
  id: string
  habit_id: string
  user_id: string
  completed_at: string
  created_at: string
}

export interface StressEntry {
  id: string
  user_id: string
  stress_level: number
  note: string
  created_at: string
}

export interface Todo {
  id: string
  user_id: string
  title: string
  category: string
  completed: boolean
  created_at: string
  updated_at: string
}

export interface SleepEntry {
  id: string
  user_id: string
  sleep_duration: number
  sleep_quality: number
  bed_time: string
  wake_time: string
  notes: string
  created_at: string
}

export interface JournalEntry {
  id: string
  user_id: string
  title: string
  content: string
  mood: string
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  user_id: string
  message: string
  is_user: boolean
  created_at: string
}

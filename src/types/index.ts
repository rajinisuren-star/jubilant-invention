export interface Medication {
  id: string
  name: string
  dosage: string
  times: string[] // "HH:MM" reminder times
  notes: string
  takenLog: Record<string, string[]> // dateISO -> list of times taken that day
}

export interface Appointment {
  id: string
  doctorName: string
  specialty: string
  date: string // ISO date "YYYY-MM-DD"
  time: string // "HH:MM"
  location: string
  notes: string
}

export interface EmergencyContact {
  id: string
  name: string
  relation: string
  phone: string
  isPrimary: boolean
}

export type Mood = 1 | 2 | 3 | 4 | 5

export interface WellnessEntry {
  date: string // ISO date, one entry per day
  mood: Mood
  waterGlasses: number
  sleepHours: number
  activityMinutes: number
  notes: string
}

export interface Habit {
  id: string
  name: string
  notes: string
  completedDates: string[] // ISO dates when this habit was marked done
}

export interface AppSettings {
  fontScale: number // 1 = base, up to 1.6
  highContrast: boolean
}

export type TabKey =
  | 'dashboard'
  | 'medications'
  | 'habits'
  | 'appointments'
  | 'wellness'
  | 'contacts'
  | 'settings'

import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { AppSettings } from '../types'

const DEFAULT_SETTINGS: AppSettings = {
  fontScale: 1.15,
  highContrast: false,
}

interface SettingsContextValue {
  settings: AppSettings
  setFontScale: (scale: number) => void
  toggleHighContrast: () => void
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    'swa_settings',
    DEFAULT_SETTINGS,
  )

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--font-scale',
      String(settings.fontScale),
    )
    document.documentElement.classList.toggle('high-contrast', settings.highContrast)
  }, [settings])

  const setFontScale = (scale: number) => {
    setSettings((prev) => ({ ...prev, fontScale: scale }))
  }

  const toggleHighContrast = () => {
    setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }))
  }

  return (
    <SettingsContext.Provider value={{ settings, setFontScale, toggleHighContrast }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}

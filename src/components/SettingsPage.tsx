import { Minus, Plus, Contrast, Download, Trash2 } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { Button, Card, Field, SectionTitle } from './ui'

const MIN_SCALE = 1
const MAX_SCALE = 1.6
const STEP = 0.1

export function SettingsPage() {
  const { settings, setFontScale, toggleHighContrast } = useSettings()

  const exportData = () => {
    const keys = [
      'swa_medications',
      'swa_habits',
      'swa_appointments',
      'swa_contacts',
      'swa_wellness',
      'swa_settings',
    ]
    const data: Record<string, unknown> = {}
    for (const key of keys) {
      const raw = window.localStorage.getItem(key)
      if (raw) data[key] = JSON.parse(raw)
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `wellness-data-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const resetData = () => {
    const confirmed = window.confirm(
      'This will permanently delete all your medications, habits, appointments, contacts, and wellness history from this device. Continue?',
    )
    if (!confirmed) return
    const keys = [
      'swa_medications',
      'swa_habits',
      'swa_appointments',
      'swa_contacts',
      'swa_wellness',
    ]
    for (const key of keys) window.localStorage.removeItem(key)
    window.location.reload()
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionTitle>Settings</SectionTitle>

      <Card>
        <Field label="Text Size" htmlFor="font-scale">
          <div className="flex items-center gap-4 mt-1">
            <Button
              type="button"
              variant="secondary"
              aria-label="Decrease text size"
              disabled={settings.fontScale <= MIN_SCALE}
              onClick={() => setFontScale(Math.max(MIN_SCALE, +(settings.fontScale - STEP).toFixed(2)))}
            >
              <Minus aria-hidden size={20} />
            </Button>
            <span className="font-bold text-lg w-16 text-center" aria-live="polite">
              {Math.round((settings.fontScale / 1.15) * 100)}%
            </span>
            <Button
              type="button"
              variant="secondary"
              aria-label="Increase text size"
              disabled={settings.fontScale >= MAX_SCALE}
              onClick={() => setFontScale(Math.min(MAX_SCALE, +(settings.fontScale + STEP).toFixed(2)))}
            >
              <Plus aria-hidden size={20} />
            </Button>
          </div>
        </Field>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Contrast aria-hidden size={24} />
            <div>
              <p className="font-bold">High Contrast Mode</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Easier-to-read black background with bright text.
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.highContrast}
            onClick={toggleHighContrast}
            className={`relative w-16 h-9 rounded-full transition-colors ${
              settings.highContrast ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'
            }`}
          >
            <span
              className={`absolute top-1 h-7 w-7 rounded-full bg-white transition-transform ${
                settings.highContrast ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </Card>

      <Card>
        <p className="font-bold mb-3">Your Data</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" onClick={exportData} className="flex items-center gap-2 justify-center">
            <Download aria-hidden size={20} />
            Export My Data
          </Button>
          <Button variant="danger" onClick={resetData} className="flex items-center gap-2 justify-center">
            <Trash2 aria-hidden size={20} />
            Reset All Data
          </Button>
        </div>
        <p className="text-sm text-[var(--color-text-muted)] mt-2">
          All your information is stored only on this device and is never sent anywhere.
        </p>
      </Card>
    </div>
  )
}

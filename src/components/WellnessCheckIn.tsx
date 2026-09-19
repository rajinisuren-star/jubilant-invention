import { useMemo } from 'react'
import { Smile, Frown, Meh, Laugh, Angry, Droplet, Moon, Footprints } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Mood, WellnessEntry } from '../types'
import { formatFriendlyDate, todayISO } from '../utils/date'
import { Button, Card, EmptyState, SectionTitle, TextArea } from './ui'

const MOOD_OPTIONS: { value: Mood; label: string; icon: typeof Smile }[] = [
  { value: 1, label: 'Very Low', icon: Angry },
  { value: 2, label: 'Low', icon: Frown },
  { value: 3, label: 'Okay', icon: Meh },
  { value: 4, label: 'Good', icon: Smile },
  { value: 5, label: 'Great', icon: Laugh },
]

function emptyEntry(date: string): WellnessEntry {
  return { date, mood: 3, waterGlasses: 0, sleepHours: 0, activityMinutes: 0, notes: '' }
}

export function WellnessCheckIn() {
  const [entries, setEntries] = useLocalStorage<WellnessEntry[]>('swa_wellness', [])
  const today = todayISO()

  const todayEntry = useMemo(
    () => entries.find((e) => e.date === today) ?? emptyEntry(today),
    [entries, today],
  )

  const updateToday = (updates: Partial<WellnessEntry>) => {
    setEntries((prev) => {
      const exists = prev.some((e) => e.date === today)
      const merged = { ...todayEntry, ...updates }
      if (exists) {
        return prev.map((e) => (e.date === today ? merged : e))
      }
      return [...prev, merged]
    })
  }

  const history = [...entries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 14)

  return (
    <div className="flex flex-col gap-4">
      <SectionTitle>Daily Wellness Check-In</SectionTitle>

      <Card>
        <h3 className="font-bold text-lg mb-2">{formatFriendlyDate(today)}</h3>

        <div className="mb-4">
          <p className="font-semibold mb-2">How are you feeling today?</p>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map(({ value, label, icon: Icon }) => {
              const selected = todayEntry.mood === value
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => updateToday({ mood: value })}
                  className={`flex flex-col items-center gap-1 min-w-[72px] min-h-[72px] rounded-xl border-2 px-2 py-2 font-medium ${
                    selected
                      ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-on-primary)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-muted)]'
                  }`}
                >
                  <Icon aria-hidden size={26} />
                  <span className="text-xs">{label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <Counter
            icon={<Droplet aria-hidden size={22} />}
            label="Glasses of Water"
            value={todayEntry.waterGlasses}
            onChange={(v) => updateToday({ waterGlasses: v })}
          />
          <Counter
            icon={<Moon aria-hidden size={22} />}
            label="Hours of Sleep"
            value={todayEntry.sleepHours}
            onChange={(v) => updateToday({ sleepHours: v })}
          />
          <Counter
            icon={<Footprints aria-hidden size={22} />}
            label="Activity Minutes"
            value={todayEntry.activityMinutes}
            onChange={(v) => updateToday({ activityMinutes: v })}
            step={5}
          />
        </div>

        <label htmlFor="wellness-notes" className="font-semibold text-sm text-[var(--color-text-muted)]">
          How are you doing? (optional)
        </label>
        <TextArea
          id="wellness-notes"
          rows={2}
          value={todayEntry.notes}
          onChange={(e) => updateToday({ notes: e.target.value })}
          placeholder="Notes about your day..."
          className="w-full mt-1"
        />
      </Card>

      <div>
        <h3 className="text-lg font-bold mb-2">Recent History</h3>
        {history.length === 0 ? (
          <EmptyState message="Your check-in history will appear here." />
        ) : (
          <ul className="flex flex-col gap-2">
            {history.map((entry) => {
              const mood = MOOD_OPTIONS.find((m) => m.value === entry.mood)
              const MoodIcon = mood?.icon ?? Meh
              return (
                <li key={entry.date}>
                  <Card className="flex items-center justify-between gap-3 py-3">
                    <div className="flex items-center gap-3">
                      <MoodIcon aria-hidden size={24} />
                      <span className="font-semibold">{formatFriendlyDate(entry.date)}</span>
                    </div>
                    <div className="flex gap-4 text-sm text-[var(--color-text-muted)]">
                      <span>{entry.waterGlasses} 💧</span>
                      <span>{entry.sleepHours}h sleep</span>
                      <span>{entry.activityMinutes} min active</span>
                    </div>
                  </Card>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

function Counter({
  icon,
  label,
  value,
  onChange,
  step = 1,
}: {
  icon: React.ReactNode
  label: string
  value: number
  onChange: (value: number) => void
  step?: number
}) {
  return (
    <div className="flex flex-col items-center gap-2 border-2 border-[var(--color-border)] rounded-xl p-3">
      <div className="flex items-center gap-2 font-semibold text-sm text-[var(--color-text-muted)]">
        {icon}
        {label}
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          className="!min-h-[44px] !min-w-[44px] !px-0"
          onClick={() => onChange(Math.max(0, value - step))}
          aria-label={`Decrease ${label}`}
        >
          −
        </Button>
        <span className="text-xl font-bold w-10 text-center" aria-live="polite">
          {value}
        </span>
        <Button
          type="button"
          variant="secondary"
          className="!min-h-[44px] !min-w-[44px] !px-0"
          onClick={() => onChange(value + step)}
          aria-label={`Increase ${label}`}
        >
          +
        </Button>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Plus, Trash2, CheckCircle2, Circle, Flame } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Habit } from '../types'
import { computeStreak, generateId, todayISO } from '../utils/date'
import { Button, Card, EmptyState, Field, SectionTitle, TextArea, TextInput, IconButton } from './ui'

const EMPTY_FORM = { name: '', notes: '' }

export function Habits() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('swa_habits', [])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const today = todayISO()

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    const newHabit: Habit = {
      id: generateId(),
      name: form.name.trim(),
      notes: form.notes.trim(),
      completedDates: [],
    }
    setHabits((prev) => [...prev, newHabit])
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const removeHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id))
  }

  const toggleToday = (habitId: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h
        const isDone = h.completedDates.includes(today)
        const completedDates = isDone
          ? h.completedDates.filter((d) => d !== today)
          : [...h.completedDates, today]
        return { ...h, completedDates }
      }),
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SectionTitle>Habits</SectionTitle>
        <Button onClick={() => setShowForm((s) => !s)} aria-expanded={showForm}>
          <span className="flex items-center gap-2">
            <Plus aria-hidden size={20} />
            Add Habit
          </span>
        </Button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={addHabit} className="flex flex-col gap-3">
            <Field label="Habit name" htmlFor="habit-name">
              <TextInput
                id="habit-name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Take a 20-minute walk"
              />
            </Field>
            <Field label="Notes (optional)" htmlFor="habit-notes">
              <TextArea
                id="habit-notes"
                rows={2}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Right after breakfast"
              />
            </Field>
            <div className="flex gap-3">
              <Button type="submit">Save Habit</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {habits.length === 0 && !showForm && (
        <EmptyState message="No habits added yet. Tap 'Add Habit' to start building a routine." />
      )}

      <ul className="flex flex-col gap-3">
        {habits.map((habit) => {
          const isDoneToday = habit.completedDates.includes(today)
          const streak = computeStreak(habit.completedDates)
          return (
            <li key={habit.id}>
              <Card>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold">{habit.name}</h3>
                    {habit.notes && <p className="text-sm mt-1 italic">{habit.notes}</p>}
                    {streak > 0 && (
                      <p className="flex items-center gap-1 text-sm mt-1 text-[var(--color-accent)] font-semibold">
                        <Flame aria-hidden size={16} fill="currentColor" />
                        {streak} day{streak === 1 ? '' : 's'} in a row
                      </p>
                    )}
                  </div>
                  <IconButton
                    aria-label={`Delete ${habit.name}`}
                    onClick={() => removeHabit(habit.id)}
                  >
                    <Trash2 aria-hidden size={22} />
                  </IconButton>
                </div>

                <button
                  type="button"
                  onClick={() => toggleToday(habit.id)}
                  aria-pressed={isDoneToday}
                  className={`mt-3 flex items-center gap-2 min-h-[48px] px-4 rounded-full border-2 font-medium ${
                    isDoneToday
                      ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-on-primary)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-muted)]'
                  }`}
                >
                  {isDoneToday ? (
                    <CheckCircle2 aria-hidden size={22} />
                  ) : (
                    <Circle aria-hidden size={22} />
                  )}
                  {isDoneToday ? 'Done Today' : 'Mark Done Today'}
                </button>
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

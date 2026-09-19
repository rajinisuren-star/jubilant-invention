import { useState } from 'react'
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Medication } from '../types'
import { formatTime12h, generateId, todayISO } from '../utils/date'
import { Button, Card, EmptyState, Field, SectionTitle, TextArea, TextInput, IconButton } from './ui'

const EMPTY_FORM = { name: '', dosage: '', times: '08:00', notes: '' }

export function Medications() {
  const [medications, setMedications] = useLocalStorage<Medication[]>('swa_medications', [])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const today = todayISO()

  const addMedication = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    const times = form.times
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    const newMed: Medication = {
      id: generateId(),
      name: form.name.trim(),
      dosage: form.dosage.trim(),
      times: times.length ? times : ['08:00'],
      notes: form.notes.trim(),
      takenLog: {},
    }
    setMedications((prev) => [...prev, newMed])
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const removeMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id))
  }

  const toggleTaken = (medId: string, time: string) => {
    setMedications((prev) =>
      prev.map((m) => {
        if (m.id !== medId) return m
        const takenToday = m.takenLog[today] ?? []
        const isTaken = takenToday.includes(time)
        const updatedTaken = isTaken
          ? takenToday.filter((t) => t !== time)
          : [...takenToday, time]
        return { ...m, takenLog: { ...m.takenLog, [today]: updatedTaken } }
      }),
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SectionTitle>Medications</SectionTitle>
        <Button onClick={() => setShowForm((s) => !s)} aria-expanded={showForm}>
          <span className="flex items-center gap-2">
            <Plus aria-hidden size={20} />
            Add Medication
          </span>
        </Button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={addMedication} className="flex flex-col gap-3">
            <Field label="Medication name" htmlFor="med-name">
              <TextInput
                id="med-name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Lisinopril"
              />
            </Field>
            <Field label="Dosage" htmlFor="med-dosage">
              <TextInput
                id="med-dosage"
                value={form.dosage}
                onChange={(e) => setForm((f) => ({ ...f, dosage: e.target.value }))}
                placeholder="e.g. 10mg, 1 tablet"
              />
            </Field>
            <Field label="Reminder times (comma separated, e.g. 08:00, 20:00)" htmlFor="med-times">
              <TextInput
                id="med-times"
                type="text"
                value={form.times}
                onChange={(e) => setForm((f) => ({ ...f, times: e.target.value }))}
                placeholder="08:00, 20:00"
              />
            </Field>
            <Field label="Notes (optional)" htmlFor="med-notes">
              <TextArea
                id="med-notes"
                rows={2}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Take with food"
              />
            </Field>
            <div className="flex gap-3">
              <Button type="submit">Save Medication</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {medications.length === 0 && !showForm && (
        <EmptyState message="No medications added yet. Tap 'Add Medication' to get started." />
      )}

      <ul className="flex flex-col gap-3">
        {medications.map((med) => (
          <li key={med.id}>
            <Card>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold">{med.name}</h3>
                  {med.dosage && (
                    <p className="text-[var(--color-text-muted)]">{med.dosage}</p>
                  )}
                  {med.notes && <p className="text-sm mt-1 italic">{med.notes}</p>}
                </div>
                <IconButton
                  aria-label={`Delete ${med.name}`}
                  onClick={() => removeMedication(med.id)}
                >
                  <Trash2 aria-hidden size={22} />
                </IconButton>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {med.times.map((time) => {
                  const takenToday = med.takenLog[today] ?? []
                  const isTaken = takenToday.includes(time)
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => toggleTaken(med.id, time)}
                      aria-pressed={isTaken}
                      className={`flex items-center gap-2 min-h-[44px] px-3 rounded-full border-2 font-medium ${
                        isTaken
                          ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-on-primary)]'
                          : 'border-[var(--color-border)] text-[var(--color-text-muted)]'
                      }`}
                    >
                      {isTaken ? (
                        <CheckCircle2 aria-hidden size={20} />
                      ) : (
                        <Circle aria-hidden size={20} />
                      )}
                      {formatTime12h(time)}
                    </button>
                  )
                })}
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}

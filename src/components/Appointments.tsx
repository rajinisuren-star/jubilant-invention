import { useState } from 'react'
import { Plus, Trash2, MapPin } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Appointment } from '../types'
import { formatFriendlyDate, formatTime12h, generateId, todayISO } from '../utils/date'
import { Button, Card, EmptyState, Field, SectionTitle, TextArea, TextInput, IconButton } from './ui'

const EMPTY_FORM = { doctorName: '', specialty: '', date: '', time: '09:00', location: '', notes: '' }

export function Appointments() {
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>(
    'swa_appointments',
    [],
  )
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const today = todayISO()

  const addAppointment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.doctorName.trim() || !form.date) return
    const newAppt: Appointment = {
      id: generateId(),
      doctorName: form.doctorName.trim(),
      specialty: form.specialty.trim(),
      date: form.date,
      time: form.time,
      location: form.location.trim(),
      notes: form.notes.trim(),
    }
    setAppointments((prev) => [...prev, newAppt])
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const removeAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id))
  }

  const upcoming = [...appointments]
    .filter((a) => a.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const past = [...appointments]
    .filter((a) => a.date < today)
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SectionTitle>Appointments</SectionTitle>
        <Button onClick={() => setShowForm((s) => !s)} aria-expanded={showForm}>
          <span className="flex items-center gap-2">
            <Plus aria-hidden size={20} />
            Add Appointment
          </span>
        </Button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={addAppointment} className="flex flex-col gap-3">
            <Field label="Doctor / Provider name" htmlFor="appt-doctor">
              <TextInput
                id="appt-doctor"
                required
                value={form.doctorName}
                onChange={(e) => setForm((f) => ({ ...f, doctorName: e.target.value }))}
                placeholder="e.g. Dr. Patel"
              />
            </Field>
            <Field label="Specialty (optional)" htmlFor="appt-specialty">
              <TextInput
                id="appt-specialty"
                value={form.specialty}
                onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))}
                placeholder="e.g. Cardiologist"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date" htmlFor="appt-date">
                <TextInput
                  id="appt-date"
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                />
              </Field>
              <Field label="Time" htmlFor="appt-time">
                <TextInput
                  id="appt-time"
                  type="time"
                  required
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                />
              </Field>
            </div>
            <Field label="Location (optional)" htmlFor="appt-location">
              <TextInput
                id="appt-location"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="e.g. City Medical Center, Room 4"
              />
            </Field>
            <Field label="Notes (optional)" htmlFor="appt-notes">
              <TextArea
                id="appt-notes"
                rows={2}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Bring insurance card"
              />
            </Field>
            <div className="flex gap-3">
              <Button type="submit">Save Appointment</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {appointments.length === 0 && !showForm && (
        <EmptyState message="No appointments scheduled. Tap 'Add Appointment' to get started." />
      )}

      {upcoming.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-2">Upcoming</h3>
          <ul className="flex flex-col gap-3">
            {upcoming.map((appt) => (
              <AppointmentCard key={appt.id} appt={appt} onDelete={removeAppointment} />
            ))}
          </ul>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-2 mt-2 text-[var(--color-text-muted)]">Past</h3>
          <ul className="flex flex-col gap-3">
            {past.map((appt) => (
              <AppointmentCard key={appt.id} appt={appt} onDelete={removeAppointment} muted />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function AppointmentCard({
  appt,
  onDelete,
  muted = false,
}: {
  appt: Appointment
  onDelete: (id: string) => void
  muted?: boolean
}) {
  return (
    <li>
      <Card className={muted ? 'opacity-70' : ''}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold">{appt.doctorName}</h3>
            {appt.specialty && (
              <p className="text-[var(--color-text-muted)]">{appt.specialty}</p>
            )}
            <p className="mt-1 font-semibold">
              {formatFriendlyDate(appt.date)} &middot; {formatTime12h(appt.time)}
            </p>
            {appt.location && (
              <p className="flex items-center gap-1 text-sm mt-1 text-[var(--color-text-muted)]">
                <MapPin aria-hidden size={16} /> {appt.location}
              </p>
            )}
            {appt.notes && <p className="text-sm mt-1 italic">{appt.notes}</p>}
          </div>
          <IconButton aria-label={`Delete appointment with ${appt.doctorName}`} onClick={() => onDelete(appt.id)}>
            <Trash2 aria-hidden size={22} />
          </IconButton>
        </div>
      </Card>
    </li>
  )
}

export function nextAppointmentSummary(appointments: Appointment[]): string | null {
  const today = todayISO()
  const upcoming = appointments
    .filter((a) => a.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  if (upcoming.length === 0) return null
  const next = upcoming[0]
  return `${next.doctorName} on ${formatFriendlyDate(next.date)} at ${formatTime12h(next.time)}`
}

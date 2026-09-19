import { CalendarDays, ListChecks, PhoneCall, Pill, Smile } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type {
  Appointment,
  EmergencyContact,
  Habit,
  Medication,
  TabKey,
  WellnessEntry,
} from '../types'
import { formatTime12h, todayISO } from '../utils/date'
import { nextAppointmentSummary } from './Appointments'
import { Button, Card, SectionTitle } from './ui'

export function Dashboard({ onNavigate }: { onNavigate: (tab: TabKey) => void }) {
  const [medications] = useLocalStorage<Medication[]>('swa_medications', [])
  const [appointments] = useLocalStorage<Appointment[]>('swa_appointments', [])
  const [contacts] = useLocalStorage<EmergencyContact[]>('swa_contacts', [])
  const [wellness] = useLocalStorage<WellnessEntry[]>('swa_wellness', [])
  const [habits] = useLocalStorage<Habit[]>('swa_habits', [])

  const today = todayISO()
  const todayWellness = wellness.find((w) => w.date === today)

  const dueMeds = medications.flatMap((med) =>
    med.times
      .filter((time) => !(med.takenLog[today] ?? []).includes(time))
      .map((time) => ({ med, time })),
  )
  dueMeds.sort((a, b) => a.time.localeCompare(b.time))

  const nextAppt = nextAppointmentSummary(appointments)
  const primaryContact = contacts.find((c) => c.isPrimary) ?? contacts[0]
  const habitsRemaining = habits.filter((h) => !h.completedDates.includes(today))

  return (
    <div className="flex flex-col gap-4">
      <SectionTitle>Good day! Here's your overview.</SectionTitle>

      <Card>
        <div className="flex items-center gap-2 mb-2">
          <Pill aria-hidden size={22} />
          <h3 className="font-bold text-lg">Medications Due Today</h3>
        </div>
        {dueMeds.length === 0 ? (
          <p className="text-[var(--color-text-muted)]">
            {medications.length === 0
              ? 'No medications added yet.'
              : "You're all caught up on today's medications."}
          </p>
        ) : (
          <ul className="flex flex-col gap-1 mb-2">
            {dueMeds.slice(0, 4).map(({ med, time }) => (
              <li key={`${med.id}-${time}`} className="flex justify-between">
                <span>{med.name}</span>
                <span className="font-semibold">{formatTime12h(time)}</span>
              </li>
            ))}
          </ul>
        )}
        <Button variant="secondary" onClick={() => onNavigate('medications')} className="mt-2">
          View Medications
        </Button>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-2">
          <ListChecks aria-hidden size={22} />
          <h3 className="font-bold text-lg">Today's Habits</h3>
        </div>
        {habits.length === 0 ? (
          <p className="text-[var(--color-text-muted)] mb-2">No habits added yet.</p>
        ) : habitsRemaining.length === 0 ? (
          <p className="text-[var(--color-text-muted)] mb-2">
            All habits done for today. Nicely done!
          </p>
        ) : (
          <ul className="flex flex-col gap-1 mb-2">
            {habitsRemaining.slice(0, 4).map((habit) => (
              <li key={habit.id}>{habit.name}</li>
            ))}
          </ul>
        )}
        <Button variant="secondary" onClick={() => onNavigate('habits')}>
          View Habits
        </Button>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-2">
          <CalendarDays aria-hidden size={22} />
          <h3 className="font-bold text-lg">Next Appointment</h3>
        </div>
        <p className="text-[var(--color-text-muted)] mb-2">
          {nextAppt ?? 'No upcoming appointments scheduled.'}
        </p>
        <Button variant="secondary" onClick={() => onNavigate('appointments')}>
          View Appointments
        </Button>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-2">
          <Smile aria-hidden size={22} />
          <h3 className="font-bold text-lg">Daily Check-In</h3>
        </div>
        <p className="text-[var(--color-text-muted)] mb-2">
          {todayWellness
            ? "You've checked in today. Great job taking care of yourself!"
            : "You haven't checked in yet today."}
        </p>
        <Button variant="secondary" onClick={() => onNavigate('wellness')}>
          {todayWellness ? 'Update Check-In' : 'Check In Now'}
        </Button>
      </Card>

      <Card className="border-[var(--color-danger)]">
        <div className="flex items-center gap-2 mb-2">
          <PhoneCall aria-hidden size={22} />
          <h3 className="font-bold text-lg">Emergency</h3>
        </div>
        {primaryContact ? (
          <p className="mb-2">
            Primary contact: <span className="font-semibold">{primaryContact.name}</span> (
            {primaryContact.phone})
          </p>
        ) : (
          <p className="text-[var(--color-text-muted)] mb-2">No emergency contact set yet.</p>
        )}
        <Button variant="danger" onClick={() => onNavigate('contacts')}>
          Emergency Contacts
        </Button>
      </Card>
    </div>
  )
}

export function todayISO(): string {
  const now = new Date()
  return toISODate(now)
}

export function toISODate(d: Date): string {
  const year = d.getFullYear()
  const month = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatFriendlyDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime12h(time: string): string {
  const [hStr, mStr] = time.split(':')
  const h = Number(hStr)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${mStr} ${period}`
}

export function daysUntil(iso: string): number {
  const target = new Date(`${iso}T00:00:00`)
  const today = new Date(`${todayISO()}T00:00:00`)
  const diffMs = target.getTime() - today.getTime()
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// Consecutive-day streak ending today (or yesterday, so marking today doesn't
// zero out a streak before the user has had a chance to check in).
export function computeStreak(completedDates: string[]): number {
  const dates = new Set(completedDates)
  const today = new Date(`${todayISO()}T00:00:00`)
  let cursor = new Date(today)
  if (!dates.has(toISODate(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
    if (!dates.has(toISODate(cursor))) return 0
  }
  let streak = 0
  while (dates.has(toISODate(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

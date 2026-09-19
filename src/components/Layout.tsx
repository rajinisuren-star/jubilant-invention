import type { ReactNode } from 'react'
import {
  HeartPulse,
  LayoutDashboard,
  Pill,
  ListChecks,
  CalendarDays,
  Smile,
  PhoneCall,
  Settings as SettingsIcon,
} from 'lucide-react'
import type { TabKey } from '../types'

interface NavItem {
  key: TabKey
  label: string
  icon: ReactNode
}

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Home', icon: <LayoutDashboard aria-hidden size={26} /> },
  { key: 'medications', label: 'Medications', icon: <Pill aria-hidden size={26} /> },
  { key: 'habits', label: 'Habits', icon: <ListChecks aria-hidden size={26} /> },
  { key: 'appointments', label: 'Appointments', icon: <CalendarDays aria-hidden size={26} /> },
  { key: 'wellness', label: 'Wellness', icon: <Smile aria-hidden size={26} /> },
  { key: 'contacts', label: 'Contacts', icon: <PhoneCall aria-hidden size={26} /> },
  { key: 'settings', label: 'Settings', icon: <SettingsIcon aria-hidden size={26} /> },
]

interface LayoutProps {
  active: TabKey
  onChange: (tab: TabKey) => void
  children: ReactNode
}

export function Layout({ active, onChange, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] pb-64 sm:pb-28">
      <header className="bg-[var(--color-primary)] text-[var(--color-on-primary)] px-4 py-5 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <HeartPulse aria-hidden size={32} />
          <h1 className="text-2xl font-bold tracking-tight">Golden Years Wellness</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">{children}</main>

      <nav
        aria-label="Main navigation"
        className="fixed bottom-0 inset-x-0 bg-[var(--color-surface)] border-t-2 border-[var(--color-border)] shadow-[0_-2px_8px_rgba(0,0,0,0.08)]"
      >
        <ul className="max-w-3xl mx-auto grid grid-cols-3 sm:grid-cols-7 gap-1 p-2">
          {NAV_ITEMS.map((item) => {
            const isActive = item.key === active
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => onChange(item.key)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 min-h-[64px] font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]'
                  }`}
                >
                  {item.icon}
                  <span className="text-sm leading-tight">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

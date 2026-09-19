import { useState } from 'react'
import { Plus, Trash2, Phone, Star } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { EmergencyContact } from '../types'
import { generateId } from '../utils/date'
import { Button, Card, EmptyState, Field, SectionTitle, TextInput, IconButton } from './ui'

const EMPTY_FORM = { name: '', relation: '', phone: '' }

export function EmergencyContacts() {
  const [contacts, setContacts] = useLocalStorage<EmergencyContact[]>('swa_contacts', [])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const addContact = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    const newContact: EmergencyContact = {
      id: generateId(),
      name: form.name.trim(),
      relation: form.relation.trim(),
      phone: form.phone.trim(),
      isPrimary: contacts.length === 0,
    }
    setContacts((prev) => [...prev, newContact])
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const removeContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id))
  }

  const setPrimary = (id: string) => {
    setContacts((prev) => prev.map((c) => ({ ...c, isPrimary: c.id === id })))
  }

  const sorted = [...contacts].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SectionTitle>Emergency Contacts</SectionTitle>
        <Button onClick={() => setShowForm((s) => !s)} aria-expanded={showForm}>
          <span className="flex items-center gap-2">
            <Plus aria-hidden size={20} />
            Add Contact
          </span>
        </Button>
      </div>

      <Card
        className="border-[var(--color-danger)]"
        style={{ backgroundColor: 'color-mix(in srgb, var(--color-danger) 12%, var(--color-surface))' }}
      >
        <p className="font-bold text-lg mb-2">Need help right now?</p>
        <a href="tel:911">
          <Button variant="danger" className="w-full text-xl">
            Call 911
          </Button>
        </a>
      </Card>

      {showForm && (
        <Card>
          <form onSubmit={addContact} className="flex flex-col gap-3">
            <Field label="Name" htmlFor="contact-name">
              <TextInput
                id="contact-name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Sarah Johnson"
              />
            </Field>
            <Field label="Relationship" htmlFor="contact-relation">
              <TextInput
                id="contact-relation"
                value={form.relation}
                onChange={(e) => setForm((f) => ({ ...f, relation: e.target.value }))}
                placeholder="e.g. Daughter, Neighbor, Doctor"
              />
            </Field>
            <Field label="Phone number" htmlFor="contact-phone">
              <TextInput
                id="contact-phone"
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="e.g. (555) 123-4567"
              />
            </Field>
            <div className="flex gap-3">
              <Button type="submit">Save Contact</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {contacts.length === 0 && !showForm && (
        <EmptyState message="No emergency contacts saved yet. Add someone you trust." />
      )}

      <ul className="flex flex-col gap-3">
        {sorted.map((contact) => (
          <li key={contact.id}>
            <Card>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">{contact.name}</h3>
                    {contact.isPrimary && (
                      <span className="flex items-center gap-1 text-xs font-bold text-[var(--color-accent)]">
                        <Star aria-hidden size={16} fill="currentColor" /> Primary
                      </span>
                    )}
                  </div>
                  {contact.relation && (
                    <p className="text-[var(--color-text-muted)]">{contact.relation}</p>
                  )}
                </div>
                <IconButton
                  aria-label={`Delete contact ${contact.name}`}
                  onClick={() => removeContact(contact.id)}
                >
                  <Trash2 aria-hidden size={22} />
                </IconButton>
              </div>

              <div className="mt-3 flex flex-wrap gap-3">
                <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}>
                  <Button className="flex items-center gap-2">
                    <Phone aria-hidden size={20} />
                    {contact.phone}
                  </Button>
                </a>
                {!contact.isPrimary && (
                  <Button variant="secondary" onClick={() => setPrimary(contact.id)}>
                    Make Primary
                  </Button>
                )}
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}

import type {
  ButtonHTMLAttributes,
  CSSProperties,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react'

export function Card({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      style={style}
      className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-xl font-bold mb-3">{children}</h2>
}

type ButtonVariant = 'primary' | 'secondary' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-primary-dark)]',
  secondary:
    'bg-transparent text-[var(--color-primary-dark)] border-2 border-[var(--color-primary)] hover:bg-[var(--color-bg)]',
  danger: 'bg-[var(--color-danger)] text-[var(--color-on-danger)] hover:opacity-90',
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`min-h-[48px] px-5 rounded-xl font-semibold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
    />
  )
}

export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="font-semibold text-sm text-[var(--color-text-muted)]">
        {label}
      </label>
      {children}
    </div>
  )
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`min-h-[48px] rounded-lg border-2 border-[var(--color-border)] px-3 bg-[var(--color-surface)] text-[var(--color-text)] focus-visible:border-[var(--color-primary)] ${props.className ?? ''}`}
    />
  )
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`rounded-lg border-2 border-[var(--color-border)] px-3 py-2 bg-[var(--color-surface)] text-[var(--color-text)] focus-visible:border-[var(--color-primary)] ${props.className ?? ''}`}
    />
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <p className="text-center text-[var(--color-text-muted)] py-8 text-lg">{message}</p>
  )
}

export function IconButton({
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] ${className}`}
    />
  )
}

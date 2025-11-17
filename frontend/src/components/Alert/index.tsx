import type { ReactNode, HTMLAttributes } from 'react'

type AlertVariant = 'error' | 'success' | 'warning' | 'info'

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  children: ReactNode
}

const variantStyles: Record<AlertVariant, string> = {
  error: 'bg-red-50 border-red-200 text-red-700',
  success: 'bg-green-50 border-green-200 text-green-700',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  info: 'bg-blue-50 border-blue-200 text-blue-700',
}

function Alert({
  variant = 'error',
  children,
  className = '',
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        border px-4 py-3 rounded text-sm
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export default Alert


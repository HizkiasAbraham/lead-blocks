import type { ReactNode, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  title?: string
  footer?: ReactNode
}

function Card({ children, title, footer, className = '', ...props }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md border border-gray-200
        ${className}
      `}
      {...props}
    >
      {title && (
        <div className="px-1 md:px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="px-0 md:px-6 py-4">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card


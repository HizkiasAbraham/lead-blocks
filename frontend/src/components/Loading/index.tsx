import type { HTMLAttributes } from 'react'

interface LoadingProps extends HTMLAttributes<HTMLDivElement> {}

function Loading({ className = '', ...props }: LoadingProps) {
  return (
    <div
      className={`w-full h-2 bg-gray-200 rounded overflow-hidden relative ${className}`}
      {...props}
      role="progressbar"
      aria-label="Loading"
    >
      <div className="absolute inset-y-0 left-0 bg-primary animate-loading" />
    </div>
  )
}

export default Loading


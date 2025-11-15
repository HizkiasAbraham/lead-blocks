import { forwardRef, useState, useRef, useEffect } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  onChange?: (e: { target: { value: string } }) => void
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', value, onChange, ...props }, _ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedValue, setSelectedValue] = useState(value || '')
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      setSelectedValue(value || '')
    }, [value])

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

    const selectedOption = options.find((opt) => opt.value === selectedValue)
    const displayValue = selectedOption?.label || (selectedValue === '' ? options[0]?.label || '' : '')

    const handleSelect = (optionValue: string) => {
      setSelectedValue(optionValue)
      setIsOpen(false)
      if (onChange) {
        onChange({ target: { value: optionValue } })
      }
    }

    return (
      <div>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`
              w-full px-3 py-2 pr-8 text-left
              border ${error ? 'border-red-300' : 'border-gray-300'} 
              bg-white text-gray-900 rounded-md 
              focus:outline-none focus:ring-primary focus:border-primary
              sm:text-sm
              flex items-center justify-between
              ${className}
            `}
          >
            <span className={selectedValue === '' ? 'text-gray-500' : ''}>
              {displayValue}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform ${
                isOpen ? 'transform rotate-180' : ''
              }`}
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full px-3 py-2 text-left text-sm
                    hover:bg-primary hover:text-white
                    ${selectedValue === option.value ? 'bg-primary text-white' : 'text-gray-900'}
                    transition-colors
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select

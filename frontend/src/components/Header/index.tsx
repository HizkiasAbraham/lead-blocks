import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface HeaderProps {
  className?: string
}

function Header({ className = '' }: HeaderProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Check if path matches
  const isLeadsActive = location.pathname === '/' || location.pathname === '/leads'
  const isCompanyActive = location.pathname === '/company'

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsDropdownOpen(false)
  }

  // Get user initials for avatar
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      // Use first letter of each word in the full name
      return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    // Fallback to email if no name
    if (email) {
      return email
        .split('@')[0]
        .split('.')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return 'U'
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 ${className}`}>
      <div className="flex w-full px-6 py-4 justify-between items-center">
        <Link to="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 w-auto"
          />
        </Link>
        {user && (
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-base font-medium text-primary transition-colors relative"
              >
                Leads
                {isLeadsActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary" />
                )}
              </Link>
              <Link
                to="/company"
                className="text-base font-medium text-primary transition-colors relative"
              >
                Companies
                {isCompanyActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary" />
                )}
              </Link>
            </nav>
            <div className="hidden md:block h-6 w-px bg-gray-300" />
            <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <span className="hidden md:block text-lg text-gray-700 font-medium">
                {user.name || user.email}
              </span>
              <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
                {getInitials(user.name, user.email)}
              </div>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900 truncate" title={user.email}>
                    {user.email}
                  </p>
                </div>
                <Link
                  to="/"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Home
                </Link>
                <Link
                  to="/company"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Companies
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header


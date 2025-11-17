import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Input, Button, Card, Alert } from '../components'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { login } = useAuth()

  // Debug: log error changes
  useEffect(() => {
    if (error) {
      console.log('Error state updated:', error)
    }
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setIsLoggingIn(true)
    try {
      await login(email, password)
      // Clear error on success
      setError('')
    } catch (err) {
      let errorMessage = 'Login failed. Please try again.'
      
      if (err instanceof Error) {
        errorMessage = err.message || errorMessage
      } else if (typeof err === 'string') {
        errorMessage = err
      }
      
      console.error('Login error:', err)
      console.log('Setting error message:', errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      <div className="max-w-md w-full">
        <Card className="py-14">
          <div className="text-center mb-8">
            <img
              src="/logo.png"
              alt="Logo"
              className="mx-auto mb-4 h-16 w-auto"
            />
            <h2 className="text-xl font-bold text-primary">
              Sign in to your account
            </h2>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <Alert variant="error">{error}</Alert>}
            <div className="space-y-4">
              <Input
                id="email"
                name="email"
                type="email"
                label="Email address"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                disabled={isLoggingIn}
              />
              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                disabled={isLoggingIn}
              />
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoggingIn}
                className="w-full"
              >
                Sign in
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default Login


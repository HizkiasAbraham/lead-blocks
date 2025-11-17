import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { Layout, ProtectedRoute } from './components'
import Login from './pages/Login'
import Leads from './pages/leads'
import Companies from './pages/companies'

function App() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-merriweather">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="font-merriweather">
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Leads />} />
          <Route path="company" element={<Companies />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App

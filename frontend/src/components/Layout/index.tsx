import { Outlet } from 'react-router-dom'
import { Header } from '../index'

function Layout() {
  return (
    <div className="min-h-screen bg-primary">
      <Header />
      <main className="pt-20 px-6">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout


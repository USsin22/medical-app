import React from 'react'
import Sidebar from './Sidebar'
import BackButton from './BackButton'
import { useLocation } from 'react-router-dom'

const Layout = ({ children, showBackButton = true, backButtonLabel, backButtonTo }) => {
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard'
  const isLanding = location.pathname === '/'

  // Don't show layout on landing page
  if (isLanding) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          {showBackButton && !isDashboard && (
            <BackButton to={backButtonTo} label={backButtonLabel} />
          )}
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout


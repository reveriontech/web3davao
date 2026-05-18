import { Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from '../context/ThemeContext'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { ScrollToTop } from '../components/layout/ScrollToTop'
import { ProtectedRoute } from '../components/layout/ProtectedRoute'
import { HomePage } from '../pages/HomePage'
import { DashboardPage } from '../pages/DashboardPage'

function AppRoutes() {
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard'

  return (
    <ThemeProvider>
      <ScrollToTop />
      {!isDashboard && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </ThemeProvider>
  )
}

export default AppRoutes

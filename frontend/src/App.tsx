import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './store/AuthContext'
import { SubscriptionProvider } from './store/SubscriptionContext'
import Header from './components/layout/Header'
import HomePage from './components/pages/HomePage'
import LoginPage from './components/pages/LoginPage'
import RegisterPage from './components/pages/RegisterPage'
import BrowsePage from './components/pages/BrowsePage'
import WatchPage from './components/pages/WatchPage'
import PlansPage from './components/pages/PlansPage'
import ProfilePage from './components/pages/ProfilePage'
import AdminDashboard from './components/pages/AdminDashboard'
import AdminContentNew from './components/pages/AdminContentNew'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <div className="min-h-screen bg-netflix-black">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/plans" element={<PlansPage />} />

            {/* Protected routes */}
            <Route
              path="/browse"
              element={
                <ProtectedRoute>
                  <BrowsePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/watch/:id"
              element={
                <ProtectedRoute requireSubscription>
                  <WatchPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/content/new"
              element={
                <ProtectedRoute>
                  <AdminContentNew />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </SubscriptionProvider>
    </AuthProvider>
  )
}

export default App
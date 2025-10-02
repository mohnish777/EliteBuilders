import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import BuilderDashboard from './pages/BuilderDashboard'
import HostDashboard from './pages/HostDashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AuthCallback from './pages/AuthCallback'
import Challenges from './pages/Challenges'
import ChallengeDetail from './pages/ChallengeDetail'
import CreateChallenge from './pages/CreateChallenge'
import EditChallenge from './pages/EditChallenge'
import SubmitChallenge from './pages/SubmitChallenge'
import SubmissionDetail from './pages/SubmissionDetail'
import TestPage from './pages/TestPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Public Challenge Routes */}
          <Route path="/challenges" element={<Challenges />} />

          {/* Protected Challenge Routes - Must come BEFORE :id route */}
          <Route
            path="/challenges/create"
            element={
              <ProtectedRoute>
                <CreateChallenge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges/:id/edit"
            element={
              <ProtectedRoute>
                <EditChallenge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges/:id/submit"
            element={
              <ProtectedRoute>
                <SubmitChallenge />
              </ProtectedRoute>
            }
          />

          {/* Submission Detail Route */}
          <Route path="/submissions/:id" element={<SubmissionDetail />} />

          {/* Dynamic route - Must come AFTER specific routes */}
          <Route path="/challenges/:id" element={<ChallengeDetail />} />
          <Route
            path="/builder/dashboard"
            element={
              <ProtectedRoute>
                <BuilderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/dashboard"
            element={
              <ProtectedRoute>
                <HostDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App


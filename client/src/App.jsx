import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AssignmentPage from './pages/AssignmentPage';
import AssignmentDetailsPage from './pages/AssignmentDetailsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import PracticePage from './pages/PracticePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/assignment" element={<AssignmentPage />} />
        <Route path="/assignment/:id" element={<AssignmentDetailsPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
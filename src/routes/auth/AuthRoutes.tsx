import { Routes, Route } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import OnboardingPage from '@/pages/auth/OnboardingPage';

const AuthRoutes = () => (
  <Routes>
    <Route path="login" element={<LoginPage />} />
    <Route path="signup" element={<SignupPage />} />
    <Route path="onboarding" element={<OnboardingPage />} />
  </Routes>
);

export default AuthRoutes;
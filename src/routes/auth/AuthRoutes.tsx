import { Routes, Route } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import OnboardingPage from '@/pages/auth/OnboardingPage';
import NotFoundPage from '@/pages/common/NotFoundPage';

const AuthRoutes = () => (
  <Routes>
    <Route path="login" element={<LoginPage />} />
    <Route path="signup" element={<SignupPage />} />
    <Route path="onboarding" element={<OnboardingPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AuthRoutes;

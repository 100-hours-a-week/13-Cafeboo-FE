import { Routes, Route } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import OnboardingPage from '@/pages/auth/OnboardingPage';
import NotFoundPage from '@/pages/common/NotFoundPage';
import RequireAuth from '@/utils/RequireAuth';

const AuthRoutes = () => (
  <Routes>
    <Route path="login" element={<LoginPage />} />
    <Route path="signup" element={<SignupPage />} />
    <Route element={<RequireAuth />}>
      <Route path="onboarding" element={<OnboardingPage />} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AuthRoutes;

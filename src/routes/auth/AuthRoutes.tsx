import { Routes, Route } from 'react-router-dom';
import OnboardingPage from '@/pages/auth/OnboardingPage';
import NotFoundPage from '@/pages/common/NotFoundPage';
import RequireAuth from '@/routes/RequireAuth';

const AuthRoutes = () => (
  <Routes>
    <Route element={<RequireAuth />}>
      <Route path="onboarding" element={<OnboardingPage />} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AuthRoutes;

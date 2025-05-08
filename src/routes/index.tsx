import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import ScrollToTop from '@/components/common/ScrolltoTop';
export default function Router() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}

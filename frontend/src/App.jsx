import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes, useLocation } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { loadMe } from './redux/slices/authSlice';
import AdminDashboard from './pages/AdminDashboard';
import AIAssistantPage from './pages/AIAssistantPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ArticlesPage from './pages/ArticlesPage';
import AppointmentBookingPage from './pages/AppointmentBookingPage';
import BooksPage from './pages/BooksPage';
import ChildTrackerPage from './pages/ChildTrackerPage';
import CounsellorDashboard from './pages/CounsellorDashboard';
import CounsellorsPage from './pages/CounsellorsPage';
import ForumPage from './pages/ForumPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ParentDashboard from './pages/ParentDashboard';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import VideosPage from './pages/VideosPage';

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('parentsphere_access_token')) dispatch(loadMe());
  }, [dispatch]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="/counsellors" element={<CounsellorsPage />} />
        <Route path="/counsellors/:id/book" element={<AppointmentBookingPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
        <Route path="/videos" element={<VideosPage />} />

        <Route element={<ProtectedRoute roles={['parent', 'admin']} />}>
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/child-tracker" element={<ChildTrackerPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
        </Route>
        <Route element={<ProtectedRoute roles={['parent', 'admin']} />}>
          <Route element={<DashboardLayout role="parent" />}>
            <Route path="/parent" element={<ParentDashboard />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute roles={['counsellor']} />}>
          <Route element={<DashboardLayout role="counsellor" />}>
            <Route path="/counsellor-dashboard" element={<CounsellorDashboard />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route element={<DashboardLayout role="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;

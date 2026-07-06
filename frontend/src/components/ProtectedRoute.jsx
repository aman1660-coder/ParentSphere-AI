import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ roles = [] }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles.length && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default ProtectedRoute;

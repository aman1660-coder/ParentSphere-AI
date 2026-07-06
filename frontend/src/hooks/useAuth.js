import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, status, error } = useSelector((state) => state.auth);
  return {
    user,
    status,
    error,
    isAuthenticated: Boolean(user),
    role: user?.role
  };
};

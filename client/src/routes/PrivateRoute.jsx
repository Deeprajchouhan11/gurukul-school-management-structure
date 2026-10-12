import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function PrivateRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Not logged in → go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but role not allowed → go to their own dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const dashboard = {
      Admin: '/admin/dashboard',
      Teacher: '/teacher/dashboard',
      Student: '/student/dashboard',
      Parent: '/parent/dashboard',
      Accountant: '/accountant/dashboard',
    }[user.role] || '/login';

    return <Navigate to={dashboard} replace />;
  }

  return children;
}
import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

type Props = {
  children: React.ReactNode;
  roles?: Array<'admin' | 'staff' | 'viewer'>;
};

const ProtectedRoute: React.FC<Props> = ({ children, roles }) => {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (roles && roles.length > 0 && !hasRole(...roles)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

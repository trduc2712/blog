import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

const RoleBasedRoute = ({ allowedRole, redirectPath, children }) => {
  const { user } = useAuthContext();

  if (user) {
    if (user.role != allowedRole) {
      return <Navigate to={redirectPath} replace />;
    }
  } else if (!user) return <Navigate to={redirectPath} replace />;

  return children;
}

export default RoleBasedRoute;
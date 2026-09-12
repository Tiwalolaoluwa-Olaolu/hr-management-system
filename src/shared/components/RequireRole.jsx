import { Navigate } from 'react-router';

const RequireRole = ({ role, allowed, children }) => {
  if (!allowed.includes(role)) {
    return <Navigate to='/dashboard' replace />;
  }

  return children;
};

export default RequireRole;

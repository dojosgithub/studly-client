import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';

const RoleGuard = ({ allowedRoles, children }) => {
  const userRole = useSelector((state) => state.user?.user?.role?.shortName);
  const accessToken = useSelector((state) => state.user.tokens.accessToken);
  const decodedToken = jwtDecode(accessToken);
  const authRole = decodedToken?.role?.shortName;

  if (allowedRoles.includes(userRole)) {
    return children;
  }

  // Redirect to unauthorized page or home page if user doesn't have access
  return <Navigate to="/unauthorized" />;
};

export default RoleGuard;

RoleGuard.propTypes = {
  allowedRoles: PropTypes.array,
  children: PropTypes.node,
};

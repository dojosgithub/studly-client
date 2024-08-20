import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const RoleAccessWrapper = ({ allowedRoles = [], children, isSysAdmin = false }) => {
  const userRole = useSelector((state) => state.user.user.role.shortName);
  const accessToken = useSelector((state) => state.user.tokens.accessToken);
  const decodedToken = jwtDecode(accessToken);
  const authRole = decodedToken.role.shortName;
  console.log('decodedToken', decodedToken);
  console.log('authRole', authRole);
  console.log('userRole', userRole);
  console.log('matched', allowedRoles.includes(authRole));

  return allowedRoles.includes(authRole) ? children : null;
};

export default RoleAccessWrapper;

RoleAccessWrapper.propTypes = {
  children: PropTypes.node,
  isSysAdmin: PropTypes.bool,
  allowedRoles: PropTypes.array,
};

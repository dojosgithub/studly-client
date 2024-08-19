import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const RoleAccessWrapper = ({ children }) => {
  const userRole = useSelector((state) => state.user.user.role);
  const accessToken = useSelector((state) => state.user.tokens.accessToken);
  const decodedToken = jwtDecode(accessToken);
  const authRole = decodedToken.role;
  console.log('decodedToken', decodedToken);
  console.log('authRole', authRole);
  console.log('userRole', userRole);
  console.log('matched', authRole.shortName === userRole.shortName);
  return authRole.shortName === userRole.shortName ? children : null;
};

export default RoleAccessWrapper;

RoleAccessWrapper.propTypes = {
  children: PropTypes.node,
};

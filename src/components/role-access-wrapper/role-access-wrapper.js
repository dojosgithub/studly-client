import jwtDecode from 'jwt-decode';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const RoleAccessWrapper = ({ condition, children }) => {
  const [first, setfirst] = useState('');
  const accessToken = useSelector((state) => state.user.tokens.accessToken);
  const decodedToken = jwtDecode(accessToken);
  console.log('decodedToken', decodedToken);
  return condition ? children : null;
};

export default RoleAccessWrapper;

RoleAccessWrapper.propTypes = {
  condition: PropTypes.bool,
  children: PropTypes.node,
};

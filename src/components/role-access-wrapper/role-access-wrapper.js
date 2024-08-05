import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const RoleAccessWrapper = ({ condition, children }) => {
  const [first, setfirst] = useState('');
  return condition ? children : null;
};

export default RoleAccessWrapper;

RoleAccessWrapper.propTypes = {
  condition: PropTypes.bool,
  children: PropTypes.node,
};

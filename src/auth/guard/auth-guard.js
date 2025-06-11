import PropTypes from 'prop-types';
import { useEffect, useCallback, useState } from 'react';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from '../hooks';

const loginPaths = {
  jwt: paths.auth.jwt.login,
};

export default function AuthGuard({ children }) {
  const router = useRouter();
  const currentprojects = useSelector((state) => state.project?.current);
  const { authenticated, method } = useAuthContext();

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!authenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();

      const loginPath = loginPaths[method];
      const href = `${loginPath}?${searchParams}`;

      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [authenticated, method, router]);

  useEffect(() => {
    check();
  }, [check]);

  
  useEffect(() => {
    if (checked && isEmpty(currentprojects)) {
      router.push('/onboarding');
    }
  }, [checked, currentprojects, router]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}

AuthGuard.propTypes = {
  children: PropTypes.node,
};

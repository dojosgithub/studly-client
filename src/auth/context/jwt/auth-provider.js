import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios, { endpoints } from 'src/utils/axios';
//
import { logoutRedux } from 'src/redux/store';
import { setUserData, setUserTokens, signIn } from 'src/redux/slices/userSlice';
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------
// const USER_ROLE = 'subscriber'
const USER_ROLE = 'admin';
const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      // user: { ...action.payload.user, role: USER_ROLE },
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      // user: { ...action.payload.user, role: USER_ROLE },
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      // user: { ...action.payload.user, role: USER_ROLE },
      user: action.payload.user,
    };
  }
  if (action.type === 'FORGOT_PASSWORD') {
    return {
      ...state,
    };
  }
  if (action.type === 'NEW_PASSWORD') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const dispatchRedux = useDispatch();

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      // TODO: handle token (save session) based on new profile data
      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        const response = await axios.get(endpoints.auth.profile);
        console.log('response', response);
        console.log('accessTokenPrev', accessToken);
        const {
          data: { user, tokens },
        } = response.data;
        // setSession(accessToken);
        console.log('tokens Auth', tokens);
        setSession(tokens?.accessToken);
        dispatchRedux(setUserData(user));
        dispatchRedux(setUserTokens(tokens));

        dispatch({
          type: 'INITIAL',
          payload: {
            user,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
        logoutRedux();
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
      logoutRedux();
    }
  }, [dispatchRedux]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(
    async (email, password) => {
      const data = {
        email,
        password,
      };

      const response = await axios.get(endpoints.auth.login, { params: data });

      const {
        data: { accessToken, user, refreshToken },
      } = response.data;
      setSession(accessToken);
      dispatchRedux(signIn({ accessToken, user, refreshToken }));
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
        },
      });
    },
    [dispatchRedux]
  );

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const data = {
      email,
      password,
      firstName,
      lastName,
    };

    const response = await axios.post(endpoints.auth.register, data);

    const { accessToken, user } = response.data;

    sessionStorage.setItem(STORAGE_KEY, accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  }, []);

  // FORGOT PASSWORD
  const forgotPassword = useCallback(async (email) => {
    const data = {
      email,
    };

    const response = await axios.get(endpoints.auth.forgotPassword, { params: data });
    dispatch({
      type: 'FORGOT_PASSWORD',
    });
  }, []);

  // NEW PASSWORD
  const newPassword = useCallback(
    async (email, password, code) => {
      const data = {
        email,
        password,
        code,
      };

      const response = await axios.post(endpoints.auth.newPassword, data);
      const {
        data: { accessToken, user, refreshToken },
      } = response.data;
      setSession(accessToken);
      dispatchRedux(signIn({ accessToken, user, refreshToken }));
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
        },
      });
    },
    [dispatchRedux]
  );

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    logoutRedux();
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
      forgotPassword,
      newPassword,
    }),
    [login, logout, register, forgotPassword, newPassword, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};

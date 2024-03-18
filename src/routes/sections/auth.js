import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { GuestGuard } from 'src/auth/guard';
// layouts
// import CompactLayout from 'src/layouts/compact';
import AuthClassicLayout from 'src/layouts/auth/classic';
// components
import { SplashScreen } from 'src/components/loading-screen';

// JWT
const JwtLoginPage = lazy(() => import('src/pages/auth/jwt/login'));
const JwtRegisterPage = lazy(() => import('src/pages/auth/jwt/register'));

// AUTH0
const Auth0LoginPage = lazy(() => import('src/pages/auth/auth0/login'));
const Auth0Callback = lazy(() => import('src/pages/auth/auth0/callback'));

const authJwt = {
  path: 'jwt',
  element: (
    <GuestGuard>
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    </GuestGuard>
  ),
  children: [
    {
      path: 'login',
      element: (
        <AuthClassicLayout>
          <JwtLoginPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'register',
      element: (
        <AuthClassicLayout title="Start with Studly Today">
          <JwtRegisterPage />
        </AuthClassicLayout>
      ),
    },
  ],
};

const authAuth0 = {
  path: 'auth0',
  element: (
    <GuestGuard>
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    </GuestGuard>
  ),
  children: [
    {
      path: 'login',
      element: (
        <AuthClassicLayout>
          <Auth0LoginPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'callback',
      element: <Auth0Callback />,
    },
  ],
};

export const authRoutes = [
  {
    path: 'auth',

    children: [authJwt, authAuth0],
  },
];

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import AuthModernLayout from 'src/layouts/auth/modern';
import AuthClassicLayout from 'src/layouts/auth/classic';

// components
import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const authClassic = {
  path: 'classic',
  element: (
    <Suspense fallback={<SplashScreen />}>
      <Outlet />
    </Suspense>
  ),
  children: [
    {
      path: 'login',
      element: <AuthClassicLayout>{/* <LoginClassicPage /> */}</AuthClassicLayout>,
    },
    {
      path: 'register',
      element: (
        <AuthClassicLayout title="Start with Studly">
          {/* <RegisterClassicPage /> */}
        </AuthClassicLayout>
      ),
    },
  ],
};

const authModern = {
  path: 'modern',
  element: (
    <Suspense fallback={<SplashScreen />}>
      <Outlet />
    </Suspense>
  ),
  children: [
    {
      path: 'login',
      element: <AuthModernLayout>{/* <LoginModernPage /> */}</AuthModernLayout>,
    },
    {
      path: 'register',
      element: <AuthModernLayout>{/* <RegisterModernPage /> */}</AuthModernLayout>,
    },
    {},
  ],
};

export const authDemoRoutes = [
  {
    path: 'auth-demo',
    children: [authClassic, authModern],
  },
];

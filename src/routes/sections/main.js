import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// layouts
// components
import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const Page500 = lazy(() => import('src/pages/500'));
const Page403 = lazy(() => import('src/pages/403'));
const Page404 = lazy(() => import('src/pages/404'));
const InvitePage = lazy(() => import('src/pages/invite'));
// const JwtLoginPage = lazy(() => import('src/pages/auth/jwt/login'));
// ----------------------------------------------------------------------a

export const mainRoutes = [
  {
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      { path: 'invite/:inviteId', element: <InvitePage /> },
      // { path: 'auth/jwt/login', element: <JwtLoginPage /> },
      { path: '500', element: <Page500 /> },
      { path: '404', element: <Page404 /> },
      { path: '403', element: <Page403 /> },
    ],
  },
];

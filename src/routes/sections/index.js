import { Navigate, useRoutes } from 'react-router-dom';

// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
import { AuthGuard } from 'src/auth/guard';
//
import MainLayout from 'src/layouts/main/layout';

// import { authDemoRoutes } from './auth-demo';
import { mainRoutes, HomePage } from './main';
import { authRoutes } from './auth';
import { dashboardRoutes } from './dashboard';
import { componentsRoutes } from './components';
import { subscriberRoutes } from './subscriber';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // SET INDEX PAGE WITH SKIP HOME PAGE
    {
      path: '/',
      element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    },

    // -------------------------------------------------------------------

    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout>
            <HomePage />
          </MainLayout>
        </AuthGuard>
      ),
    },

    // Auth routes
    ...authRoutes,
    // ...authDemoRoutes,

    // Dashboard routes
    ...dashboardRoutes,

    // Main routes
    ...mainRoutes,

    // Subscriber routes
    ...subscriberRoutes,

    // Components routes
    ...componentsRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

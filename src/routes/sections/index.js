import { Navigate, useRoutes } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// config
import { PATH_AFTER_LOGIN, PATH_AFTER_LOGIN_SUBSCRIBER } from 'src/config-global';
import { AuthGuard } from 'src/auth/guard';
//
import MainLayout from 'src/layouts/main/layout';

// import { authDemoRoutes } from './auth-demo';
import SimpleLayout from 'src/layouts/simple/simple';
import { LoadingScreen } from 'src/components/loading-screen';
import { mainRoutes, HomePage } from './main';
import { authRoutes } from './auth';
import { dashboardRoutes } from './dashboard';
import { componentsRoutes } from './components';
import { subscriberRoutes } from './subscriber';

//
const OnboardingPage = lazy(() => import('src/pages/onboarding'));


// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // SET INDEX PAGE WITH SKIP HOME PAGE
    {
      path: '/',
      element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    },
    {
      path: '/subscriber',
      element: <Navigate to={PATH_AFTER_LOGIN_SUBSCRIBER} replace />,
    },

    // -------------------------------------------------------------------

    {
      path: '/onboarding',
      element: (
        <AuthGuard>
          <SimpleLayout>
            <Suspense fallback={<LoadingScreen />}>
              <OnboardingPage />
            </Suspense>
          </SimpleLayout>
        </AuthGuard>
      ),
    },

    // // {
    // //   path: '/',
    // //   element: (
    // //     <AuthGuard>
    // //       <MainLayout>
    // //         <HomePage />
    // //       </MainLayout>
    // //     </AuthGuard>
    // //   ),
    // // },


    // Auth routes
    ...authRoutes,
    // ...authDemoRoutes,

    // // Dashboard routes
    // // ...dashboardRoutes,

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

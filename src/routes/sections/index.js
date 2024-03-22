import { Navigate, useRoutes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';

// config
import { PATH_AFTER_LOGIN_ONBOARDING, PATH_AFTER_LOGIN_SYSTEM_ADMIN, PATH_AFTER_LOGIN_SUBSCRIBER, PATH_LOGIN_PAGE, PATH_AFTER_LOGIN_FIRST_SIGNIN } from 'src/config-global';
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
import { adminRoutes } from './admin';

//
const OnboardingPage = lazy(() => import('src/pages/onboarding'));
const UpdatePasswordPage = lazy(() => import('src/pages/update-password'));


// ----------------------------------------------------------------------

export default function Router() {
  const userType = useSelector(state => state.user?.user?.userType);
  const projects = useSelector(state => state.project?.list);
  const isTempPassword = useSelector(state => state.user?.user?.isTempPassword);
  const user = useSelector(state => state.user?.user);
  let destinationPath;

  if (isEmpty(user)) {
    destinationPath = PATH_LOGIN_PAGE;
  } else if (userType === 'System') {
    destinationPath = PATH_AFTER_LOGIN_SYSTEM_ADMIN;
  } else if (userType === 'Subscriber' && isTempPassword) {
    destinationPath = PATH_AFTER_LOGIN_FIRST_SIGNIN;
  }
  else {
    destinationPath = PATH_AFTER_LOGIN_ONBOARDING;
  }

  let routes = [];

  // Define base routes
  routes = [
    ...authRoutes,
    ...mainRoutes,
    ...componentsRoutes,
  ];

  // Add admin routes if userType is 'System'
  if (userType === 'System') {
    routes.push(...adminRoutes);
  }

  // Add onboarding route if userType is 'Subscriber'
  if (userType === 'Subscriber') {
    if (isTempPassword) {
      routes.push({
        path: '/update-password',
        element: (
          <AuthGuard>
            <Suspense fallback={<LoadingScreen />}>
              <UpdatePasswordPage />
            </Suspense>
          </AuthGuard>
        ),
      });
    } else {
      routes.push({
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
      });
      // if user role is Company Admin and there are projects available=> can view submittals screen
      // && (projects && projects?.length > 0)
      if (user?.role?.shortName === 'CAD' && (projects && projects?.length > 0)) {

        routes.push(...subscriberRoutes);
      }

    }
  }
  return useRoutes([
    // SET INDEX PAGE WITH SKIP HOME PAGE
    {
      path: '/',
      element: <Navigate to={destinationPath} replace />,
    },

    {
      path: '/subscriber',
      element: <Navigate to={PATH_AFTER_LOGIN_SUBSCRIBER} replace />,
    },



    // // -------------------------------------------------------------------

    // // {
    // //   path: '/onboarding',
    // //   element: (
    // //     <AuthGuard>
    // //       <SimpleLayout>
    // //         <Suspense fallback={<LoadingScreen />}>
    // //           <OnboardingPage />
    // //         </Suspense>
    // //       </SimpleLayout>
    // //     </AuthGuard>
    // //   ),
    // // },

    // Render dynamic routes
    ...routes,



    // // Auth routes
    // // ...authRoutes,


    // // // Dashboard routes
    // // // ...dashboardRoutes,

    // // Main routes
    // // ...mainRoutes,

    // // Main routes
    // // ...adminRoutes,

    // // Subscriber routes
    // // ...subscriberRoutes,

    // // Components routes
    // // ...componentsRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

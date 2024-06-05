import { lazy, Suspense } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));

// Company
const CompanyListPage = lazy(() => import('src/pages/dashboard/company/list'));
const CompanyCreatePage = lazy(() => import('src/pages/dashboard/company/new'));
const CompanyEditPage = lazy(() => import('src/pages/dashboard/company/edit'));

// TEST RENDER PAGE BY ROLE
const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// BLANK PAGE
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

// ----------------------------------------------------------------------

export const adminRoutes = [
  {
    path: 'admin',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      // { element: <IndexPage />, index: true },

      // company routes
      {
        path: 'company',
        children: [
          // { element: <CompanyListPage />, index: true },
          { path: 'list', element: <CompanyListPage /> },
          { path: ':id/edit', element: <CompanyEditPage /> },
          { path: 'new', element: <CompanyCreatePage /> },
          // { path: '*', element: <Navigate to="/404" replace /> },
        ],
      },


    ],
  },

];

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// COMPANY
const CompanyListPage = lazy(() => import('src/pages/dashboard/company/list'));
const CompanyCreatePage = lazy(() => import('src/pages/dashboard/company/new'));
const CompanyEditPage = lazy(() => import('src/pages/dashboard/company/edit'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
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
      // company routes
      {
        path: 'company',
        children: [
          { element: <CompanyListPage />, index: true },
          { path: 'list', element: <CompanyListPage /> },
          { path: ':id/edit', element: <CompanyEditPage /> },
          { path: 'new', element: <CompanyCreatePage /> },
        ],
      },
    ],
  },
];

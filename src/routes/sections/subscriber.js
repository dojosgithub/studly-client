import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));


// Submittals
const SubmittalsListPage = lazy(() => import('src/pages/subscriber/submittals/list'));
const SubmittalsCreatePage = lazy(() => import('src/pages/subscriber/submittals/new'));
const SubmittalsEditPage = lazy(() => import('src/pages/subscriber/submittals/edit'));
const SubmittalsDetailsPage = lazy(() => import('src/pages/subscriber/submittals/details'));
const SubmittalsRevisionPage = lazy(() => import('src/pages/subscriber/submittals/revision'));
const SubmittalsReviewPage = lazy(() => import('src/pages/subscriber/submittals/review'));
// // USER
// const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
// const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
// const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
// const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
// const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
// const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));


// TEST RENDER PAGE BY ROLE
const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// BLANK PAGE
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

// ----------------------------------------------------------------------

export const subscriberRoutes = [
  {
    path: 'subscriber',
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
    //   { element: <IndexPage />, index: true },
    //   { path: 'submittals', element: <OverviewEcommercePage /> },
    //   { path: 'rfis', element: <OverviewAnalyticsPage /> },
    //   { path: 'meeting-minutes', element: <OverviewBankingPage /> },
    //   { path: 'plan-room', element: <OverviewBookingPage /> },
    //   { path: 'Documents', element: <OverviewBookingPage /> },
    //   { path: 'Subcontractors', element: <OverviewBookingPage /> },

      {
        path: 'submittals',
        children: [
          { element: <SubmittalsListPage />, index: true },
          { path: 'list', element: <SubmittalsListPage /> },
          { path: 'new', element: <SubmittalsCreatePage /> },
          { path: ':id', element: <SubmittalsDetailsPage /> },
          { path: ':id/edit', element: <SubmittalsEditPage /> },
          { path: ':id/review', element: <SubmittalsReviewPage /> },
          { path: ':id/revision', element: <SubmittalsRevisionPage /> },
          // { path: ':id/review/details', element: <SubmittalsReviewDetailsPage /> },
        ],
      },
      
    //   {
    //     path: 'user',
    //     children: [
    //       { element: <UserProfilePage />, index: true },
    //       { path: 'profile', element: <UserProfilePage /> },
    //       { path: 'cards', element: <UserCardsPage /> },
    //       { path: 'list', element: <UserListPage /> },
    //       { path: 'new', element: <UserCreatePage /> },
    //       { path: ':id/edit', element: <UserEditPage /> },
    //       { path: 'account', element: <UserAccountPage /> },
    //     ],
    //   },

    ],
  },
];

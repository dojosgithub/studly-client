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
const SubmittalsResponseDetailsPage = lazy(() =>
  import('src/pages/subscriber/submittals/response-details')
);

// Rfis
const RfiListPage = lazy(() => import('src/pages/subscriber/rfis/list'));
const RfiCreatePage = lazy(() => import('src/pages/subscriber/rfis/new'));
const RfiEditPage = lazy(() => import('src/pages/subscriber/rfis/edit'));
const RfiDetailsPage = lazy(() => import('src/pages/subscriber/rfis/details'));
const RfiResponseDetailsPage = lazy(() => import('src/pages/subscriber/rfis/response-details'));

// PlanRooms
const PlanRoomListPage = lazy(() => import('src/pages/subscriber/plan-room/list'));
const PlanRoomCreatePage = lazy(() => import('src/pages/subscriber/plan-room/new'));
const PlanRoomEditPage = lazy(() => import('src/pages/subscriber/plan-room/edit'));
const PlanRoomDetailsPage = lazy(() => import('src/pages/subscriber/plan-room/details'));
const PlanRoomResponseDetailsPage = lazy(() =>
  import('src/pages/subscriber/plan-room/response-details')
);

// MeetingMinutes
const MeetingMinutesListPage = lazy(() => import('src/pages/subscriber/meeting-minutes/list'));
const MeetingMinutesCreatePage = lazy(() => import('src/pages/subscriber/meeting-minutes/new'));
const MeetingMinutesEditPage = lazy(() => import('src/pages/subscriber/meeting-minutes/edit'));
const MeetingMinutesDetailsPage = lazy(() =>
  import('src/pages/subscriber/meeting-minutes/details')
);

// DailyLogs
const DailyLogsListPage = lazy(() => import('src/pages/subscriber/daily-logs/list'));
const DailyLogsCreatePage = lazy(() => import('src/pages/subscriber/daily-logs/new'));
const DailyLogsEditPage = lazy(() => import('src/pages/subscriber/daily-logs/edit'));
const DailyLogsDetailsPage = lazy(() => import('src/pages/subscriber/daily-logs/details'));

// Project
const ProjectSettingsPage = lazy(() => import('src/pages/subscriber/settings'));

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
      { path: 'settings', element: <ProjectSettingsPage /> },
      {
        path: 'submittals',
        children: [
          { element: <SubmittalsListPage />, index: true },
          { path: 'list', element: <SubmittalsListPage /> },
          { path: 'new', element: <SubmittalsCreatePage /> },
          { path: ':id', element: <SubmittalsDetailsPage /> },
          { path: ':id/edit', element: <SubmittalsEditPage /> },
          // { path: ':id/review', element: <SubmittalsReviewPage /> },
          // ? done in index routes
          { path: ':id/response/details', element: <SubmittalsResponseDetailsPage /> },
          { path: ':id/revision', element: <SubmittalsRevisionPage /> },
        ],
      },
      {
        path: 'rfi',
        children: [
          { element: <RfiListPage />, index: true },
          { path: 'list', element: <RfiListPage /> },
          { path: 'new', element: <RfiCreatePage /> },
          { path: ':id', element: <RfiDetailsPage /> },
          { path: ':id/edit', element: <RfiEditPage /> },
          { path: ':id/response/details', element: <RfiResponseDetailsPage /> },
          // { path: ':id/response/details', element: <RfiResponseDetailsPage /> },
        ],
      },
      {
        path: 'plan-room',
        children: [
          { element: <PlanRoomListPage />, index: true },
          { path: 'list', element: <PlanRoomListPage /> },
          { path: 'new', element: <PlanRoomCreatePage /> },
          { path: ':id', element: <PlanRoomDetailsPage /> },
          { path: ':id/edit', element: <PlanRoomEditPage /> },
          // { path: ':id/details', element: <PlanRoomResponseDetailsPage /> },
          // { path: ':id/response/details', element: <PlanRoomResponseDetailsPage /> },
        ],
      },
      {
        path: 'meeting-minutes',
        children: [
          { element: <MeetingMinutesListPage />, index: true },
          { path: 'list', element: <MeetingMinutesListPage /> },
          { path: 'new', element: <MeetingMinutesCreatePage /> },
          { path: ':id', element: <MeetingMinutesDetailsPage /> },
          { path: ':id/edit', element: <MeetingMinutesEditPage /> },
        ],
      },
      {
        path: 'daily-logs',
        children: [
          { element: <DailyLogsListPage />, index: true },
          { path: 'list', element: <DailyLogsListPage /> },
          { path: 'new', element: <DailyLogsCreatePage /> },
          { path: ':id', element: <DailyLogsDetailsPage /> },
          { path: ':id/edit', element: <DailyLogsEditPage /> },
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

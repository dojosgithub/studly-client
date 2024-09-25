import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';
import RoleGuard from 'src/auth/guard/role-guard';
import { STUDLY_ROLES } from 'src/_mock';

// ----------------------------------------------------------------------

// Submittals
const SubmittalsListPage = lazy(() => import('src/pages/subscriber/submittals/list'));
const SubmittalsCreatePage = lazy(() => import('src/pages/subscriber/submittals/new'));
const SubmittalsEditPage = lazy(() => import('src/pages/subscriber/submittals/edit'));
const SubmittalsDetailsPage = lazy(() => import('src/pages/subscriber/submittals/details'));
const SubmittalsRevisionPage = lazy(() => import('src/pages/subscriber/submittals/revision'));
const SubmittalsResponseDetailsPage = lazy(() =>
  import('src/pages/subscriber/submittals/response-details')
);

// Rfis
const RfiListPage = lazy(() => import('src/pages/subscriber/rfis/list'));
const RfiCreatePage = lazy(() => import('src/pages/subscriber/rfis/new'));
const RfiEditPage = lazy(() => import('src/pages/subscriber/rfis/edit'));
const RfiDetailsPage = lazy(() => import('src/pages/subscriber/rfis/details'));

// PlanRooms
const PlanRoomListPage = lazy(() => import('src/pages/subscriber/plan-room/list'));
const PlanRoomCreatePage = lazy(() => import('src/pages/subscriber/plan-room/new'));

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

// Documents
const DocumentsListPage = lazy(() => import('src/pages/subscriber/documents/list'));

// Project
const ProjectSettingsPage = lazy(() => import('src/pages/subscriber/settings'));

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
      {
        path: 'settings',
        element: (
          <RoleGuard allowedRoles={STUDLY_ROLES.projectSetting}>
            <ProjectSettingsPage />
          </RoleGuard>
        ),
      },
      {
        path: 'submittals',
        element: (
          <RoleGuard allowedRoles={STUDLY_ROLES.submittals}>
            <Outlet />
          </RoleGuard>
        ),
        children: [
          { element: <SubmittalsListPage />, index: true },
          { path: 'list', element: <SubmittalsListPage /> },
          { path: 'new', element: <SubmittalsCreatePage /> },
          { path: ':id', element: <SubmittalsDetailsPage /> },
          { path: ':id/edit', element: <SubmittalsEditPage /> },
          // { path: ':id/review', element: <SubmittalsReviewPage /> },// ? done in index routes
          { path: ':id/response/details', element: <SubmittalsResponseDetailsPage /> },
          { path: ':id/revision', element: <SubmittalsRevisionPage /> },
        ],
      },
      {
        path: 'rfi',
        element: (
          <RoleGuard allowedRoles={STUDLY_ROLES.rfis}>
            <Outlet />
          </RoleGuard>
        ),
        children: [
          { element: <RfiListPage />, index: true },
          { path: 'list', element: <RfiListPage /> },
          { path: 'new', element: <RfiCreatePage /> },
          { path: ':id', element: <RfiDetailsPage /> },
          { path: ':id/edit', element: <RfiEditPage /> },
        ],
      },
      {
        path: 'plan-room',
        element: (
          <RoleGuard allowedRoles={STUDLY_ROLES.planRoom}>
            <Outlet />
          </RoleGuard>
        ),
        children: [
          { element: <PlanRoomListPage />, index: true },
          { path: 'list', element: <PlanRoomListPage /> },
          { path: 'new', element: <PlanRoomCreatePage /> },
        ],
      },
      {
        path: 'meeting-minutes',
        element: (
          <RoleGuard allowedRoles={STUDLY_ROLES.meetingMinutes}>
            <Outlet />
          </RoleGuard>
        ),
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
        element: (
          <RoleGuard allowedRoles={STUDLY_ROLES.logs}>
            <Outlet />
          </RoleGuard>
        ),
        children: [
          { element: <DailyLogsListPage />, index: true },
          { path: 'list', element: <DailyLogsListPage /> },
          { path: 'new', element: <DailyLogsCreatePage /> },
          { path: ':id', element: <DailyLogsDetailsPage /> },
          { path: ':id/edit', element: <DailyLogsEditPage /> },
        ],
      },
      {
        path: 'documents',
        element: (
          <RoleGuard allowedRoles={STUDLY_ROLES.documents}>
            <Outlet />
          </RoleGuard>
        ),
        children: [
          { element: <DocumentsListPage />, index: true },
          { path: 'list', element: <DocumentsListPage /> },
          // { path: 'new', element: <DailyLogsCreatePage /> },
          // { path: ':id', element: <DailyLogsDetailsPage /> },
          // { path: ':id/edit', element: <DailyLogsEditPage /> },
        ],
      },
    ],
  },
];

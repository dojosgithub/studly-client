import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';

import { STUDLY_ROLES } from 'src/_mock';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  settings: icon('ic_settings'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      // COMPANY
      // ----------------------------------------------------------------------
      {
        items: [
          {
            title: 'company',
            path: paths.admin.company.list,
            icon: ICONS.dashboard,
            roles: STUDLY_ROLES.company,
          },
        ],
      },

      // SUBSCRIBER ROUTES

      {
        items: [
          {
            title: 'Submittals',
            path: paths.subscriber.submittals.list,
            icon: ICONS.file,
            roles: STUDLY_ROLES.submittals,
          },
          {
            title: 'RFIs',
            path: paths.subscriber.rfi.list,
            icon: ICONS.analytics,
            roles: STUDLY_ROLES.rfis,
          },
          {
            title: 'Meeting Minutes',
            path: paths.subscriber.meetingMinutes.list,
            icon: ICONS.dashboard,
            roles: STUDLY_ROLES.meetingMinutes,
          },
          {
            title: 'Plan Room',
            path: paths.subscriber.planRoom.list,
            icon: ICONS.booking,
            roles: STUDLY_ROLES.planRoom,
          },
          {
            title: 'Documents',
            path: paths.subscriber.documents.list,
            icon: ICONS.folder,
            roles: STUDLY_ROLES.documents,
          },
          {
            title: 'Daily Logs',
            path: paths.subscriber.logs.list,
            icon: ICONS.file,
            roles: STUDLY_ROLES.documents,
          },

          {
            title: 'Project Settings',
            path: paths.subscriber.settings.root,
            icon: ICONS.settings,
            roles: STUDLY_ROLES.projectSetting,
          },
        ],
      },
    ],
    []
  );

  return data;
}

import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales

// // components
// import Label from 'src/components/label';
// import Iconify from 'src/components/iconify';
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
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      // // OVERVIEW
      // // ----------------------------------------------------------------------
      // // {
      // //   items: [
      // //     {
      // //       title: 'app',
      // //       path: paths.dashboard.root,
      // //       icon: ICONS.dashboard,
      // //       roles: ['admin'],
      // //     },
      // //   ],
      // // },

      // COMPANY
      // ----------------------------------------------------------------------
      {
        // subheader: 'company',
        items: [
          // Company
          {
            title: 'company',
            path: paths.admin.company.list,
            icon: ICONS.dashboard,
            roles: STUDLY_ROLES.company,
            // roles: ['System Admin'],
          },

          
        ],
      },

      // SUBSCRIBER ROUTES

      {
        items: [
          // 
          {
            title: 'Submittals',
            path: paths.subscriber.submittals.list,
            icon: ICONS.file,
            roles: STUDLY_ROLES.submittals,
          },
          {
            title: 'RFIs',
            path: paths.subscriber.rfis.list,
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
            title: 'Project Settings',
            path: paths.subscriber.projectSettings.list,
            icon: ICONS.dashboard,
            roles: STUDLY_ROLES.projectSetting,
          },


        ],
      },
     
    ],
    []
  );

  return data;
}

export function useNavDataSubscriber() {
  const data = useMemo(
    () => [
      // // ----------------------------------------------------------------------
      // {
      //   items: [
      //     {
      //       title: 'Subscriber',
      //       path: paths.subscriber.root,
      //       icon: ICONS.dashboard,
      //     },
      //   ],
      // },

      // Submittals
      // ----------------------------------------------------------------------
      {
        items: [
          // 
          {
            title: 'Submittals',
            path: paths.subscriber.submittals.list,
            icon: ICONS.dashboard,
            roles: ['subscriber'], // hides on admin role
          },


        ],
      },
    ],
    []
  );

  return data;
}
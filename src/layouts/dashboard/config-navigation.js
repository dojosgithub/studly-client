import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales

// // components
// import Label from 'src/components/label';
// import Iconify from 'src/components/iconify';
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
            roles: ['System Admin'], // user.role:"System Admin"
            // // types: ['System'], // userType:"System"

          },

          // // USER
          // // {
          // //   title: 'user',
          // //   path: paths.dashboard.user.root,
          // //   icon: ICONS.user,
          // //   roles: ['System'], // userType:"System"
          // //   children: [
          // //     { title: 'profile', path: paths.dashboard.user.root },
          // //     { title: 'cards', path: paths.dashboard.user.cards },
          // //     { title: 'list', path: paths.dashboard.user.list },
          // //     { title: 'create', path: paths.dashboard.user.new },

          // //     { title: 'account', path: paths.dashboard.user.account },
          // //   ],
          // // },

          // // BLOG
          // // {
          // //   title: 'blog',
          // //   path: paths.dashboard.post.root,
          // //   icon: ICONS.blog,
          // //   roles: ['System'], // userType:"System"
          // //   children: [
          // //     { title: 'list', path: paths.dashboard.post.root },
          // //     { title: 'details', path: paths.dashboard.post.demo.details },
          // //     { title: 'create', path: paths.dashboard.post.new },
          // //     { title: 'edit', path: paths.dashboard.post.demo.edit },
          // //   ],
          // // },
        ],
      },

      // SUBSCRIBER ROUTES

      {
        items: [
          // 
          {
            title: 'Submittals',
            path: paths.subscriber.submittals.list,
            icon: ICONS.dashboard,
            roles: ['Company Admin'], // role.name:"Company Admin"
            // // types: ['Subscriber'], // userType:"Subscriber"
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
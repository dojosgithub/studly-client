// utils
import { paramCase } from 'src/utils/change-case';

// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  SUBSCRIBER: '/subscriber',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',

  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id) => `/product/${id}`,
  },
  post: {
    root: `/post`,
    details: (title) => `/post/${paramCase(title)}`,
  },
  // AUTH
  auth: {
    // amplify: {
    //   login: `${ROOTS.AUTH}/amplify/login`,
    //   verify: `${ROOTS.AUTH}/amplify/verify`,
    //   register: `${ROOTS.AUTH}/amplify/register`,
    //   newPassword: `${ROOTS.AUTH}/amplify/new-password`,
    //   forgotPassword: `${ROOTS.AUTH}/amplify/forgot-password`,
    // },
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
      forgotPassword: `${ROOTS.AUTH}/jwt/forgot-password`,
      newPassword: `${ROOTS.AUTH}/jwt/new-password`,
    },
    // firebase: {
    //   login: `${ROOTS.AUTH}/firebase/login`,
    //   verify: `${ROOTS.AUTH}/firebase/verify`,
    //   register: `${ROOTS.AUTH}/firebase/register`,
    //   forgotPassword: `${ROOTS.AUTH}/firebase/forgot-password`,
    // },
    auth0: {
      login: `${ROOTS.AUTH}/auth0/login`,
    },
  },
  authDemo: {
    classic: {
      login: `${ROOTS.AUTH_DEMO}/classic/login`,
      register: `${ROOTS.AUTH_DEMO}/classic/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/classic/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/classic/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/classic/verify`,
    },
    modern: {
      login: `${ROOTS.AUTH_DEMO}/modern/login`,
      register: `${ROOTS.AUTH_DEMO}/modern/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/modern/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/modern/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/modern/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
    },
    // company routes
    company: {
      // root: `${ROOTS.DASHBOARD}/company`,
      new: `${ROOTS.DASHBOARD}/company/new`,
      list: `${ROOTS.DASHBOARD}/company/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/company/${id}/edit`,
    },

    // previous
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}`,
      edit: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}/edit`,
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id) => `${ROOTS.DASHBOARD}/order/${id}`,
    },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
    },
  },

  // ADMIN
  admin: {
    // root: `${ROOTS.ADMIN}`,
    company: {
      // root: `${ROOTS.DASHBOARD}/company`,
      new: `${ROOTS.ADMIN}/company/new`,
      list: `${ROOTS.ADMIN}/company/list`,
      edit: (id) => `${ROOTS.ADMIN}/company/${id}/edit`,
    },
  },
  // SUBSCRIBER
  subscriber: {
    // root: `${ROOTS.SUBSCRIBER}`,
    onboarding: "/onboarding",
    // invite: (id) => `/invite/${id}`,
    invite: {
      details: (id) => `/invite/${id}`,
      create: (id) => `/invite/${id}/create`,
    },
    submittals: {
      new: `${ROOTS.SUBSCRIBER}/submittals/new`,
      list: `${ROOTS.SUBSCRIBER}/submittals/list`,
      edit: (id) => `${ROOTS.SUBSCRIBER}/submittals/${id}/edit`,
      details: (id) => `${ROOTS.SUBSCRIBER}/submittals/${id}`,
      review: (id) => `${ROOTS.SUBSCRIBER}/submittals/${id}/review`,
    },
    rfis: {
      new: `${ROOTS.SUBSCRIBER}/rfis/new`,
      list: `${ROOTS.SUBSCRIBER}/rfis/list`,
      edit: (id) => `${ROOTS.SUBSCRIBER}/rfis/${id}/edit`,
      details: (id) => `${ROOTS.SUBSCRIBER}/rfis/${id}`,
      review: (id) => `${ROOTS.SUBSCRIBER}/rfis/${id}/review`,
    },
    meetingMinutes: {
      new: `${ROOTS.SUBSCRIBER}/meetingMinutes/new`,
      list: `${ROOTS.SUBSCRIBER}/meetingMinutes/list`,
      edit: (id) => `${ROOTS.SUBSCRIBER}/meetingMinutes/${id}/edit`,
      details: (id) => `${ROOTS.SUBSCRIBER}/meetingMinutes/${id}`,
      review: (id) => `${ROOTS.SUBSCRIBER}/meetingMinutes/${id}/review`,
    },
    planRoom: {
      new: `${ROOTS.SUBSCRIBER}/planRoom/new`,
      list: `${ROOTS.SUBSCRIBER}/planRoom/list`,
      edit: (id) => `${ROOTS.SUBSCRIBER}/planRoom/${id}/edit`,
      details: (id) => `${ROOTS.SUBSCRIBER}/planRoom/${id}`,
      review: (id) => `${ROOTS.SUBSCRIBER}/planRoom/${id}/review`,
    },
    documents: {
      new: `${ROOTS.SUBSCRIBER}/documents/new`,
      list: `${ROOTS.SUBSCRIBER}/documents/list`,
      edit: (id) => `${ROOTS.SUBSCRIBER}/documents/${id}/edit`,
      details: (id) => `${ROOTS.SUBSCRIBER}/documents/${id}`,
      review: (id) => `${ROOTS.SUBSCRIBER}/documents/${id}/review`,
    },
    projectSettings: {
      new: `${ROOTS.SUBSCRIBER}/projectSettings/new`,
      list: `${ROOTS.SUBSCRIBER}/projectSettings/list`,
      edit: (id) => `${ROOTS.SUBSCRIBER}/projectSettings/${id}/edit`,
      details: (id) => `${ROOTS.SUBSCRIBER}/projectSettings/${id}`,
      review: (id) => `${ROOTS.SUBSCRIBER}/projectSettings/${id}/review`,
    },
    updatePassword: `/update-password`
  }
};

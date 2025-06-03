// utils

// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  SUBSCRIBER: '/subscriber',
};

// ----------------------------------------------------------------------

export const paths = {
  page403: '/403',
  page404: '/404',
  page500: '/500',

  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
      forgotPassword: `${ROOTS.AUTH}/jwt/forgot-password`,
      newPassword: `${ROOTS.AUTH}/jwt/new-password`,
    },
  },

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,

    // company routes
    company: {
      // root: `${ROOTS.DASHBOARD}/company`,
      new: `${ROOTS.DASHBOARD}/company/new`,
      list: `${ROOTS.DASHBOARD}/company/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/company/${id}/edit`,
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
    onboarding: '/onboarding',
    invite: {
      details: (id) => `/invite/${id}`,
      create: (id) => `/invite/${id}/create`,
    },
    submittals: {
      new: `${ROOTS.SUBSCRIBER}/submittals/new`,
      revision: (id) => `${ROOTS.SUBSCRIBER}/submittals/${id}/revision`,
      list: `${ROOTS.SUBSCRIBER}/submittals/list`,
      edit: (id) => `${ROOTS.SUBSCRIBER}/submittals/${id}/edit`,
      details: (id) => `${ROOTS.SUBSCRIBER}/submittals/${id}`,
      review: (id) => `${ROOTS.SUBSCRIBER}/submittals/${id}/review`,
      responseDetails: (id) => `${ROOTS.SUBSCRIBER}/submittals/${id}/response/details`,
    },
    rfi: {
      new: `${ROOTS.SUBSCRIBER}/rfi/new`,
      list: `${ROOTS.SUBSCRIBER}/rfi/list`,
      edit: (id) => `${ROOTS.SUBSCRIBER}/rfi/${id}/edit`,
      details: (id) => `${ROOTS.SUBSCRIBER}/rfi/${id}`,
      response: (id) => `${ROOTS.SUBSCRIBER}/rfi/${id}/response`,
    },
    meetingMinutes: {
      new: `${ROOTS.SUBSCRIBER}/meeting-minutes/new`,
      list: `${ROOTS.SUBSCRIBER}/meeting-minutes/list`,
      edit: (id) => `${ROOTS.SUBSCRIBER}/meeting-minutes/${id}/edit`,
      details: (id) => `${ROOTS.SUBSCRIBER}/meeting-minutes/${id}`,
      response: (id) => `${ROOTS.SUBSCRIBER}/meeting-minutes/${id}/response`,
      referedItem :  `${ROOTS.SUBSCRIBER}`,
      
    },
    planRoom: {
      new: `${ROOTS.SUBSCRIBER}/plan-room/new`,
      list: `${ROOTS.SUBSCRIBER}/plan-room/list`,
      edit: (id) => `${ROOTS.SUBSCRIBER}/plan-room/${id}/edit`,
      details: (id) => `${ROOTS.SUBSCRIBER}/plan-room/${id}`,
      response: (id) => `${ROOTS.SUBSCRIBER}/plan-room/${id}/response`,
    },
    documents: {
      new: `${ROOTS.SUBSCRIBER}/documents/new`,
      list: `${ROOTS.SUBSCRIBER}/documents/list`,
      edit: (id) => `${ROOTS.SUBSCRIBER}/documents/${id}/edit`,
      details: (id) => `${ROOTS.SUBSCRIBER}/documents/${id}`,
      response: (id) => `${ROOTS.SUBSCRIBER}/documents/${id}/response`,
    },
    logs: {
      new: `${ROOTS.SUBSCRIBER}/daily-logs/new`,
      list: `${ROOTS.SUBSCRIBER}/daily-logs/list`,
      edit: (id) => `${ROOTS.SUBSCRIBER}/daily-logs/${id}/edit`,
      details: (id) => `${ROOTS.SUBSCRIBER}/daily-logs/${id}`,
      response: (id) => `${ROOTS.SUBSCRIBER}/daily-logs/${id}/response`,
    },
    coi: {
      new: `${ROOTS.SUBSCRIBER}/coi/new`,
      list: `${ROOTS.SUBSCRIBER}/coi/list`,
      edit: (id) => `${ROOTS.SUBSCRIBER}/coi/${id}/edit`,
      details: (id) => `${ROOTS.SUBSCRIBER}/coi/${id}`,
      response: (id) => `${ROOTS.SUBSCRIBER}/coi/${id}/response`,
    },
    settings: {
      root: `${ROOTS.SUBSCRIBER}/settings`,
      new: `${ROOTS.SUBSCRIBER}/settings/new`,
      list: `${ROOTS.SUBSCRIBER}/settings/list`,
      edit: (id) => `${ROOTS.SUBSCRIBER}/settings/${id}/edit`,
      details: (id) => `${ROOTS.SUBSCRIBER}/settings/${id}`,
      response: (id) => `${ROOTS.SUBSCRIBER}/settings/${id}/response`,
    },
    updatePassword: `/update-password`,
  },
};

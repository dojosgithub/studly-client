import axios from 'axios';
// config
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    console.log('error.response', error.response);
    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data &&
      error.response.data.message === 'Forbidden'
    ) {
      sessionStorage.removeItem('accessToken');

      delete axios.defaults.headers.common.Authorization;
      window.location.replace(window.location.origin);
      // logoutRedux();
    }
    return Promise.reject((error.response && error.response.data) || 'Something went wrong');
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  // auth: {
  //   me: '/api/auth/me',
  //   login: '/api/auth/login',
  //   register: '/api/auth/register',
  // },
  auth: {
    register: '/api/auth/register',
    // * In Use
    profile: '/api/user/profile',
    login: '/api/user/login',
    updatePassword: '/api/user/update-password',
    forgotPassword: '/api/user/send-totp',
    newPassword: '/api/user/verify-totp',
  },
  company: {
    list: '/api/company',
    create: '/api/company/admin/register',
    update: (id) => `/api/company/${id}`,
    delete: (id) => `/api/company/${id}`,
    details: (id) => `/api/company/${id}`,
    status: (id, status) => `/api/company/status/${id}/${status}`,
    access: (id) => `/api/company/access/${id}`,
    exitAccess: '/api/company/exit-access',
  },
  user: {
    userList: '/api/user/list',
    subcontractorList: '/api/user/subcontractor/list',
    subcontractorCompanyList: '/api/user/subcontractor/list/company',
  },
  project: {
    list: '/api/project',
    create: '/api/project',
    update: '/api/project',
    switch: '/api/project/change',
    // invite: '/api/project/invite/subcontractor',
    trades: (id) => `/api/project/${id}/trades`,
    projectAllUsersList: (id) => `/api/project/${id}/all`,
    projectSubmittalUsersList: (id) => `/api/project/${id}`,
    projectRfiUsersList: (id) => `/api/project/${id}/rfi`,
    projectAssigneeUsersList: (id) => `/api/project/${id}/assignee`,
  },
  submittal: {
    pdf: (id, exptype) => `/api/submittal/submittal-report/${id}/${exptype}`,
    list: (id) => `/api/submittal/${id}`,
    create: '/api/submittal',
    edit: (id) => `/api/submittal/${id}`,
    delete: (id) => `/api/submittal/${id}`,
    details: (id) => `/api/submittal/${id}/details`,
    submit: (id) => `/api/submittal/${id}/submit`,
    review: (id) => `/api/submittal/${id}/review`,
    responseDetails: (id) => `/api/submittal/${id}/response/details`,
    status: `/api/submittal/status`,
    resendToSubcontractor: (id) => `/api/submittal/resend/${id}`,
    sendToAll: `/api/submittal/sendto`,
  },
  rfi: {
    list: (id) => `/api/rfi/${id}`,
    create: '/api/rfi',
    submit: (id) => `/api/rfi/${id}/submit`,
    edit: (id) => `/api/rfi/${id}`,
    delete: (id) => `/api/rfi/${id}`,
    details: (id) => `/api/rfi/${id}/details`,
    response: (id) => `/api/rfi/${id}/response`,
    pdf: (id, exptype) => `/api/rfi/rfi-report/${id}/${exptype}`,
  },
  planRoom: {
    list: (id) => `/api/plan-room/${id}`,
    sameProjlist: (id) => `/api/plan-room/get-plan-room/${id}`,
    existinglist: (id) => `/api/plan-room/existing-plan-room/${id}`,
    create: '/api/plan-room',
    submit: (id) => `/api/plan-room/${id}/submit`,
    edit: (id) => `/api/plan-room/${id}`,
    delete: (projectId, planRoomId, sheetId) =>
      `/api/plan-room/${projectId}/${planRoomId}/${sheetId}`,
    details: (id) => `/api/plan-room/details/${id}`,
    response: (id) => `/api/plan-room/${id}/response`,
    //
    pdf: (id, exptype) => `/api/plan-room-report/${id}/${exptype}`,
    pdfThumbnails: (id) => `/api/plan-room/split-pdf/${id}`,
    extractSheet: `/api/plan-room/extract-sheet-text`,
  },
  meetingMinutes: {
    // submit: (id) => `/api/meeting-minute/${id}/submit`,
    list: (id) => `/api/meeting-minute/${id}`,
    create: '/api/meeting-minute',
    update: (id) => `/api/meeting-minute/${id}`,
    edit: (id) => `/api/meeting-minute/${id}`,
    delete: (id) => `/api/meeting-minute/${id}`,
    details: (id) => `/api/meeting-minute/${id}/details`,
    pdf: (id) => `/api/meeting-minute/export/${id}`,
    followup: (id) => `/api/meeting-minute/follow-up/${id}`,
    sendToAttendees: (id) => `/api/meeting-minute/send/${id}`,
    toMinutes: (id) => `/api/meeting-minute/to-minute/${id}`,
    submittalAndRfiList: (id) => `/api/meeting-minute/submittalandrfi/${id}`,
    submittalsDetails : '/api/meeting-minute/submittals/details',
    rfisDetails : '/api/meeting-minute/rfi/details',
  },
  dailyLogs: {
    // submit: (id) => `/api/daily-log/${id}/submit`,
    list: (id) => `/api/daily-log/${id}`,
    create: `/api/daily-log`,
    update: (id) => `/api/daily-log/${id}`,
    edit: (id) => `/api/daily-log/${id}`,
    delete: (id) => `/api/daily-log/${id}`,
    details: (id) => `/api/daily-log/${id}/details`,
    pdf: (id) => `/api/daily-log/export/${id}`,
    // followup: (id) => `/api/daily-log/followup/${id}`,
    sendToAttendees: (id) => `/api/daily-log/send/${id}`,
    // NO API
    toMinutes: (id) => `/api/daily-log/to-minute/${id}`,
  },
  documents: {
    list: (id) => `/api/document/${id}`,
    upload: `/api/document`,
    download: (id) => `/api/document/${id}`,
    rename: (id) => `/api/document/${id}`,
    update: (id) => `/api/document/${id}`,
    submit: (id) => `/api/document/${id}/submit`,
    delete: (id) => `/api/document/${id}`,
    move: (id, to) => `/api/document/move/${id}/${to}`,
  },

  template: {
    list: '/api/project/template',
    create: '/api/project/template',
  },
  workflow: {
    list: '/api/project/workflow',
    create: '/api/project/workflow',
  },
  invite: {
    details: (id) => `/api/user/invite/${id}`,
    create: (id) => `/api/user/invite/${id}/create`,
  },
};

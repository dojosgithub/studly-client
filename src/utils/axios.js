import axios from 'axios';
// config
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
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
    profile: '/api/user/profile',
    login: '/api/user/login',
    register: '/api/auth/register',
    updatePassword: '/api/user/update-password',
    forgotPassword: '/api/user/send-totp',
    newPassword: '/api/user/verify-totp',
  },
  company: {
    list: '/api/user/company',
    create: '/api/user/admin/register',
    update: (id) => `/api/user/company/company/${id}`,
    delete: (id) => `/api/user/company/${id}`,
    status: (id, status) => `/api/user/company/status/${id}/${status}`,
    userList: '/api/user/list',
    subcontractorList: '/api/user/subcontractor/list',
    subcontractorCompanyList: '/api/user/subcontractor/list/company',
  },
  project: {
    list: '/api/user/project',
    create: '/api/user/project',
    invite: '/api/user/project/invite/subcontractor',
    trades: (id) => `/api/user/project/${id}/trades`,
    projectAllUsersList: (id) => `/api/user/project/${id}/all`,
    projectUsersList: (id) => `/api/user/project/${id}`,
    projectAssigneeUsersList: (id) => `/api/user/project/${id}/assignee`,
  },
  submittal: {
    pdf: (id, exptype) => `/api/user/submittal-report/${id}/${exptype}`,
    list: (id) => `/api/user/submittal/${id}`,
    create: '/api/user/submittal',
    edit: (id) => `/api/user/submittal/${id}`,
    delete: (id) => `/api/user/submittal/${id}`,
    details: (id) => `/api/user/submittal/${id}/details`,
    submit: (id) => `/api/user/submittal/${id}/submit`,
    review: (id) => `/api/user/submittal/${id}/review`,
    responseDetails: (id) => `/api/user/submittal/${id}/response/details`,
    status: `/api/user/submittal/status`,
    resendToSubcontractor: (id) => `/api/user/submittal/resend/${id}`,
    sendToAll: `/api/user/submittal/sendto`,
  },
  rfi: {
    list: (id) => `/api/user/rfi/${id}`,
    create: '/api/user/rfi',
    submit: (id) => `/api/user/rfi/${id}/submit`,
    edit: (id) => `/api/user/rfi/${id}`,
    delete: (id) => `/api/user/rfi/${id}`,
    details: (id) => `/api/user/rfi/${id}/details`,
    response: (id) => `/api/user/rfi/${id}/response`,
    pdf: (id, exptype) => `/api/user/rfi-report/${id}/${exptype}`,
  },
  planRoom: {
    list: (id) => `/api/user/plan-room/${id}`,
    existinglist: (id) => `/api/user/existing-plan-room/${id}`,
    create: '/api/user/plan-room',
    submit: (id) => `/api/user/plan-room/${id}/submit`,
    edit: (id) => `/api/user/plan-room/${id}`,
    delete: (projectId, planRoomId, sheetId) =>
      `/api/user/plan-room/${projectId}/${planRoomId}/${sheetId}`,
    details: (id) => `/api/user/plan-room/details/${id}`,
    response: (id) => `/api/user/plan-room/${id}/response`,
    pdf: (id, exptype) => `/api/user/plan-room-report/${id}/${exptype}`,
    pdfThumbnails: (id) => `/api/user/split-pdf/${id}`,
  },
  meetingMinutes: {
    list: (id) => `/api/user/meeting-minutes/${id}`,
    create: '/api/user/meeting-minutes',
    update: (id) => `/api/user/meeting-minutes/${id}`,
    submit: (id) => `/api/user/meeting-minutes/${id}/submit`,
    edit: (id) => `/api/user/meeting-minutes/${id}`,
    delete: (id) => `/api/user/meeting-minutes/${id}`,
    details: (id) => `/api/user/meeting-minutes/${id}/details`,
    pdf: (id) => `/api/user/meeting-minutes/export/${id}`,
    followup: (id) => `/api/user/meeting-minutes/followup/${id}`,
    sendToAttendees: (id) => `/api/user/meeting-minutes/send/${id}`,
    toMinutes: (id) => `/api/user/meeting-minutes/to-minutes/${id}`,
  },
  dailyLogs: {
    list: (id) => `/api/user/daily-logs/${id}`,
    create: `/api/user/daily-logs`,
    update: (id) => `/api/user/daily-logs/${id}`,
    submit: (id) => `/api/user/daily-logs/${id}/submit`,
    edit: (id) => `/api/user/daily-logs/${id}`,
    delete: (id) => `/api/user/daily-logs/${id}`,
    details: (id) => `/api/user/daily-logs/${id}/details`,
    pdf: (id) => `/api/user/daily-logs/export/${id}`,
    followup: (id) => `/api/user/daily-logs/followup/${id}`,
    sendToAttendees: (id) => `/api/user/daily-logs/send/${id}`,
    toMinutes: (id) => `/api/user/daily-logs/to-minutes/${id}`,
  },
  documents: {
    list: (id) => `/api/user/documents/${id}`,
    upload: `/api/user/documents`,
    update: (id) => `/api/user/documents/${id}`,
    submit: (id) => `/api/user/documents/${id}/submit`,
    // edit: (id) => `/api/user/daily-logs/${id}`,
    delete: (id) => `/api/user/documents/${id}`,
    // details: (id) => `/api/user/daily-logs/${id}/details`,
    // pdf: (id) => `/api/user/daily-logs/export/${id}`,
    // followup: (id) => `/api/user/daily-logs/followup/${id}`,
    // sendToAttendees: (id) => `/api/user/daily-logs/send/${id}`,
    // toMinutes: (id) => `/api/user/daily-logs/to-minutes/${id}`,
  },

  template: {
    list: '/api/user/template',
    create: '/api/user/template',
  },
  workflow: {
    list: '/api/user/workflow',
    create: '/api/user/workflow',
  },
  invite: {
    details: (id) => `/api/user/invite/${id}`,
    create: (id) => `/api/user/invite/${id}/create`,
  },
};

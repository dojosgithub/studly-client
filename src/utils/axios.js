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
  },
  company: {
    list: '/api/user/company',
    create: '/api/user/admin/register',
    userList: '/api/user/list',

  },
  project: {
    list: '/api/user/project',
    create: '/api/user/project',

  },
  submittal: {
    list: (id) => `/api/user/submittal/${id}`,
    create: '/api/user/submittal',
    edit: (id) => `/api/user/submittal/${id}`,
    details: (id) => `/api/user/submittal/${id}/details`,
    submit: (id) => `/api/user/submittal/${id}/submit`,

  },
  template: {
    list: '/api/user/template',
    create: '/api/user/template',

  },
  workflow: {
    list: '/api/user/workflow',
    create: '/api/user/workflow',

  },
};

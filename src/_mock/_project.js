//
import { addDays } from 'date-fns';
import uuidv4 from 'src/utils/uuidv4';
import { _mock } from './_mock';

// ----------------------------------------------------------------------

// Studly Utils

export const STUDLY_ROLES = {
  company: ['SSA'],
  submittals: ['CAD', 'PWU', 'FIU', 'ARC', 'ENG', 'SCO', 'COM', 'ASC'],
  rfis: ['CAD', 'PWU', 'FIU', 'ARC', 'ENG', 'COM', 'ASC'],
  planRoom: ['CAD', 'PWU', 'FIU'],
  meetingMinutes: ['CAD', 'PWU'],
  logs: ['CAD', 'PWU', 'FIU'],
  documents: ['CAD', 'PWU', 'FIU'], // TODO: add routing
  // coi: ['CAD', 'PWU', 'FIU', 'ARC', 'ENG', 'SCO', 'COM', 'ASC'],
  projectSetting: ['CAD', 'PWU'],
};

export const STUDLY_ACCESS_ROLES = {
  CAD: {
    // Company Admin
    submittals: ['view', 'create', 'edit', 'delete'],
    rfis: ['view', 'create', 'edit', 'delete'],
    planRoom: ['view', 'create', 'edit', 'delete'],
    meetingMinutes: ['view', 'create', 'edit', 'delete'],
    dailyLogs: ['view', 'create', 'edit', 'delete'],
    documents: ['view', 'upload', 'edit', 'delete'],
    projectSettings: ['edit'],
  },
  PWU: {
    // Power User
    submittals: ['view', 'create', 'edit', 'delete'],
    rfis: ['view', 'create', 'edit', 'delete'],
    planRoom: ['view', 'create', 'edit', 'delete'],
    meetingMinutes: ['view', 'create', 'edit', 'delete'],
    dailyLogs: ['view', 'create'],
    documents: ['view', 'upload', 'edit', 'delete'],
    projectSettings: ['edit'],
  },
  FIU: {
    // Field User
    submittals: ['view'],
    rfis: ['view'],
    planRoom: ['view'],
    meetingMinutes: [],
    dailyLogs: ['view', 'create'],
    documents: ['view'],
    projectSettings: [],
  },
  SCO: {
    // Sub Contractor
    submittals: ['view'],
    rfis: [],
    planRoom: [],
    meetingMinutes: [],
    dailyLogs: [],
    documents: [],
    projectSettings: [],
  },
  ARC: {
    // Architect
    submittals: ['view', 'respond'],
    rfis: ['view', 'respond'],
    planRoom: [],
    meetingMinutes: [],
    dailyLogs: [],
    documents: [],
    projectSettings: [],
  },
  ENG: {
    // Engineer
    submittals: ['view', 'respond'],
    rfis: ['view', 'respond'],
    planRoom: [],
    meetingMinutes: [],
    dailyLogs: [],
    documents: [],
    projectSettings: [],
  },
  COM: {
    // Construction Manager
    submittals: ['view'],
    rfis: ['view'],
    planRoom: [],
    meetingMinutes: [],
    dailyLogs: [],
    documents: [],
    projectSettings: [],
  },
  ASC: {
    // Associate
    submittals: ['view'],
    rfis: ['view'],
    planRoom: [],
    meetingMinutes: [],
    dailyLogs: [],
    documents: [],
    projectSettings: [],
  },
};

export const USER_TYPES_STUDLY = {
  SYS: 'System',
  SUB: 'Subscriber',
};

export const SYSTEM_STAFF_ROLE_STUDLY = {
  SSA: 'System Admin',
  SMA: 'Manager',
};

export const SUBSCRIBER_USER_ROLE_STUDLY = {
  CAD: 'Company Admin',
  PWU: 'Power User',
  FIU: 'Field User',
  ARC: 'Architect',
  ENG: 'Engineer',
  SCO: 'Sub Contractor',
  COM: 'Construction Manager',
  ASC: 'Associate',
};

export const STATUS_WORKFLOW_STUDLY = {
  DRF: 'Draft',
  SUB: 'Submitted',
  REV: 'Reviewed',
  RFR: 'Reviewed for record',
  APR: 'Approved (APR)',
  MCN: 'Make Corrections Noted (MCN)',
  MCNR: 'Make Corrections and Resubmit (MCNR)',
  RJT: 'Rejected (RJT)',
  CST: 'Custom',
  SSC: 'Sent to Subcontractor',
};

export const getKeyByValue = (object, value) =>
  Object.keys(object).find((key) => object[key] === value);
export const getValueByKey = (object, key) => object[key];

// get Key by value "Submitted"=>SUB
export const getStatusKeyByValue = (value) => getKeyByValue(STATUS_WORKFLOW_STUDLY, value);
// get Key by value "Sub Contractor"=>SCO
export const getRoleKeyByValue = (value) => getKeyByValue(SUBSCRIBER_USER_ROLE_STUDLY, value);

// get value by Key "SUB"=>"Submitted"
export const getStatusValueByKey = (value) => getValueByKey(STATUS_WORKFLOW_STUDLY, value);
// get value by Key "Sub Contractor"=>"SCO"
export const getRoleValueByKey = (value) => getValueByKey(SUBSCRIBER_USER_ROLE_STUDLY, value);

export const USER_TYPE = ['System', 'Subscriber'];

export const SYSTEM_ROLES = ['System Admin', 'Manager'];
export const SUBSCRIBER_ROLES = [
  'Company Admin',
  'Power User',
  'Field User',
  'Architect',
  'Engineer',
  'Sub Contractor',
  'Construction Manager',
  'Associate',
];

export const STATUS_WORKFLOW = [
  'Draft',
  'Submitted',
  'Reviewed',
  'Reviewed for record',
  'Approved (APR)',
  'Make Corrections Noted (MCN)',
  'Make Corrections and Resubmit (MCNR)',
  'Rejected (RJT)',
  'Custom',
  'Sent to Subcontractor',
];

export const STATUS_RFIS = ['Draft', 'Submitted', 'Reviewed'];
export const FILTER_CATEGORIES_PLANROOM = [
  'Architectural',
  'Mechanical',
  'Electrical',
  'Plumbing',
  'Structural',
];
export const FILTER_CATEGORIES_MEETINGROOM = ['Draft', 'Minutes'];
export const FILTER_CATEGORIES_MEETINGNOTES = ['Active', 'Inactive'];

export const PROJECT_TEMPLATE_OPTIONS = [
  { value: 'default', label: 'Studly Default Template', icon: 'mdi:crown-outline' },
  { value: 'template1', label: 'Template 1' },
  { value: 'template2', label: 'Template 2' },
  { value: 'template3', label: 'Template 3' },
  { value: 'create', label: 'Create New Template', icon: 'material-symbols:add-circle-outline' },
];

export const PROJECT_DEFAULT_TEMPLATE = [
  {
    name: 'Demolition',
    tradeId: uuidv4(),
    _id: uuidv4(),
  },
  {
    name: 'Construction',
    _id: uuidv4(),
    tradeId: uuidv4(),
  },
  {
    name: 'Electrical',
    _id: uuidv4(),
    tradeId: uuidv4(),
  },
  {
    name: 'Framing and Drywall',
    _id: uuidv4(),
    tradeId: uuidv4(),
  },
  {
    name: 'Flooring',
    _id: uuidv4(),
    tradeId: uuidv4(),
  },
];

export const PROJECT_TEMPLATES = [
  { name: 'default', trades: [...PROJECT_DEFAULT_TEMPLATE] },
  {
    name: 'template1',
    trades: [
      {
        name: 'Construction',
        _id: uuidv4(),
        tradeId: uuidv4(),
      },
      {
        name: 'Electrical',
        _id: uuidv4(),
        tradeId: uuidv4(),
      },
    ],
  },
  {
    name: 'template2',
    trades: [
      {
        name: 'Flooring',
        _id: uuidv4(),
        tradeId: uuidv4(),
      },
    ],
  },
  {
    name: 'template3',
    trades: [
      {
        name: 'Electrical',
        _id: uuidv4(),
        tradeId: uuidv4(),
      },
    ],
  },
];

export const PROJECTS = [
  {
    name: 'project1',
    trades: [...PROJECT_DEFAULT_TEMPLATE],
    workflow: {
      name: 'project workflow 1',
      statuses: ['Draft'],
      returnDate: addDays(new Date(), 1),
    },
    // submittals: [],
    _id: uuidv4(),
  },
  {
    name: 'project2',
    trades: [...PROJECT_DEFAULT_TEMPLATE],
    workflow: {
      name: 'project workflow 2',
      statuses: ['Draft', 'Submitted'],
      returnDate: addDays(new Date(), 5),
    },
    // submittals: [],
    _id: uuidv4(),
  },
  {
    name: 'project3',
    trades: [...PROJECT_DEFAULT_TEMPLATE],
    workflow: {
      name: 'project workflow 3',
      statuses: ['Draft', 'Submitted'],
      returnDate: addDays(new Date(), 10),
    },
    // submittals: [],
    _id: uuidv4(),
  },
];
export const PROJECT_WORKFLOWS = [
  {
    name: 'default',
    statuses: ['Draft', 'Submitted', 'reviewed'],
    returnDate: addDays(new Date(), 7),
  },
  {
    name: 'project workflow 1',
    statuses: ['Draft', 'Submitted'],
    returnDate: addDays(new Date(), 1),
  },
  {
    name: 'project workflow 2',
    statuses: ['Draft'],
    returnDate: addDays(new Date(), 5),
  },
  {
    name: 'project workflow 3',
    statuses: ['Submitted'],
    returnDate: addDays(new Date(), 10),
  },
];

export const PROJECT_STATUS_TREE = {
  name: 'Draft',
  children: [
    { name: 'Submitted' },
    {
      name: 'Reviewed',
      children: [
        { name: 'Reviewed for record' },
        { name: 'Approved (APR)' },
        { name: 'Make Corrections Noted (MCN)' },
        { name: 'Make Corrections and Resubmit (MCNR)' },
        { name: 'Rejected (RJT)' },
        { name: 'Custom' },
      ],
    },
    { name: 'Sent to Subcontractor' },
  ],
};

export const PROJECT_WORKFLOW_BOARD_DATA = {
  board: {
    columns: {
      '1-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1': {
        id: '1-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
        name: 'To Do',
        taskIds: [
          '1-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
          '2-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
          '3-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
          '4-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
          '5-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
          '6-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
          '7-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
          '8-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
          '9-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b9',
          '10-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b10',
        ],
      },
      '2-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2': {
        id: '2-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
        name: 'In Progress',
        taskIds: [],
      },
    },
    tasks: {
      '1-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1': {
        id: '1-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
        status: 'To Do',
        priority: 'high',
        name: 'Draft',
      },
      '2-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2': {
        id: '2-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
        status: 'To Do',
        priority: 'high',
        name: 'Submitted',
      },
      '3-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3': {
        id: '3-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
        status: 'To Do',
        priority: 'medium',
        name: 'Reviewed',
      },
      '4-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4': {
        id: '4-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
        status: 'To Do',
        priority: 'low',
        name: 'Reviewed for record',
      },
      '5-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5': {
        id: '5-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
        status: 'To Do',
        priority: 'low',
        name: 'Approved (APR)',
      },
      '6-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6': {
        id: '6-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
        status: 'To Do',
        priority: 'medium',
        name: 'Make Corrections Noted (MCN)',
      },
      '7-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7': {
        id: '7-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
        status: 'To Do',
        priority: 'medium',
        name: 'Make Corrections and Resubmit (MCNR)',
      },
      '8-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8': {
        id: '8-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
        status: 'To Do',
        priority: 'high',
        name: 'Rejected (RJT)',
      },
      '9-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b9': {
        id: '9-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b9',
        status: 'To Do',
        priority: 'low',
        name: 'Custom',
      },
      '10-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b10': {
        id: '10-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b10',
        status: 'To Do',
        priority: 'medium',
        name: 'Sent to Subcontractor',
      },
    },
    ordered: [
      '1-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
      '2-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
    ],
  },
};

export const PROJECT_SUBCONTRACTORS = [
  { _id: uuidv4(), name: 'John' },
  { _id: uuidv4(), name: 'Adam' },
  { _id: uuidv4(), name: 'Joseph' },
];

export const PROJECT_INVITE_USER_ROLES = [
  { value: 'Power User', label: 'Power User', _id: uuidv4() },
  { value: 'Field User', label: 'Field User', _id: uuidv4() },
  { value: 'Architect', label: 'Architect', _id: uuidv4() },
  { value: 'Engineer', label: 'Engineer', _id: uuidv4() },
  { value: 'Sub Contractor', label: 'Sub Contractor', _id: uuidv4() },
  { value: 'Construction Manager', label: 'Construction Manager', _id: uuidv4() },
  { value: 'Associate', label: 'Associate', _id: uuidv4() },
];
export const PROJECT_INVITE_INTERNAL_USER_ROLES = [
  { value: 'Power User', label: 'Power User', _id: uuidv4() },
  { value: 'Field User', label: 'Field User', _id: uuidv4() },
];
export const PROJECT_INVITE_EXTERNAL_USER_ROLES = [
  { value: 'Architect', label: 'Architect', _id: uuidv4() },
  { value: 'Engineer', label: 'Engineer', _id: uuidv4() },
  { value: 'Construction Manager', label: 'Construction Manager', _id: uuidv4() },
  { value: 'Associate', label: 'Associate', _id: uuidv4() },
];

export const USER_LIST_OPTIONS = [
  {
    firstName: 'test',
    lastName: 'user',
    email: 'testuser@mailinator.com',
    id: '65f96494034a59d2de77d7c2',
  },
  {
    firstName: 'test',
    lastName: 'user1',
    email: 'testuser1@mailinator.com',
    id: '65f96493334a59d2def7d7c2',
  },
  {
    firstName: 'test',
    lastName: 'user2',
    email: 'testuser2@mailinator.com',
    id: '65f96494032229d2def7d7c2',
  },
];

export const PROJECT_INVITE_USERS_INTERNAL = [...Array(8)].map((_, index) => {
  const status = ['Joined', 'Invited'][index % 2 === 0 || index % 3 === 1];
  return {
    id: _mock.id(index),
    firstName: _mock.firstName(index),
    lastName: _mock.lastName(index),
    email: _mock.email(index),
    // role: _mock.role(index),
    // status
  };
});

export const PROJECT_INVITE_USERS_EXTERNAL = [...Array(16)].slice(7).map((_, index) => ({
  id: _mock.id(index),
  name: _mock.role(index),
  email: _mock.email(index),
  role: _mock.role(index),
}));

export const PROJECT_SHARED_PERSONS = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  email: _mock.email(index),
  avatarUrl: _mock.image.avatar(index),
  permission: index % 2 ? 'view' : 'edit',
}));

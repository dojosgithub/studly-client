//
import uuidv4 from 'src/utils/uuidv4';
import { _mock } from './_mock';

// ----------------------------------------------------------------------




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
    _id: uuidv4()
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
    trades: [{
      name: 'Construction',
      _id: uuidv4(),
      tradeId: uuidv4(),
    },
    {
      name: 'Electrical',
      _id: uuidv4(),
      tradeId: uuidv4(),
    },]
  },
  {
    name: 'template2',
    trades: [{
      name: 'Flooring',
      _id: uuidv4(),
      tradeId: uuidv4(),
    },]
  },
  {
    name: 'template3',
    trades: [{
      name: 'Electrical',
      _id: uuidv4(),
      tradeId: uuidv4(),
    },]
  },
]


export const PROJECTS = [
  {
    name: 'project1',
    trades: [...PROJECT_DEFAULT_TEMPLATE],
    workflow: {
      name: 'project1 workflow',
      status: ['draft'],
      returnDate: '1-4-2024',
    },
    submittals: [],
    _id: uuidv4()
  },
  {
    name: 'project2',
    trades: [...PROJECT_DEFAULT_TEMPLATE],
    workflow: {
      name: 'project2 workflow',
      status: ['draft', 'submitted'],
      returnDate: '1-4-2024',
    },
    submittals: [],
    _id: uuidv4()
  },
  {
    name: 'project3',
    trades: [...PROJECT_DEFAULT_TEMPLATE],
    workflow: {
      name: 'project3 workflow',
      status: ['draft', 'submitted'],
      returnDate: '1-4-2024',
    },
    submittals: [],
    _id: uuidv4()
  }
];


export const PROJECT_STATUS_TREE = {
  name: 'draft',
  children: [
    { name: 'Submitted' },
    {
      name: 'reviewed',
      children: [
        { name: ' Reviewed for record' },
        { name: 'Approved (APR)' },
        { name: 'Make Corrections Noted (MCN)' },
        { name: 'Make Corrections and Resubmit (MCNR)' },
        { name: 'Rejected (RJT)' },
        { name: 'Custom' },
      ]

    },
    { name: 'Sent to Subcontractor' },
  ]
}


export const PROJECT_WORKFLOW_BOARD_DATA =  {
  "board": {
    "columns": {
      "1-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1": {
        "id": "1-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1",
        "name": "To Do",
        "taskIds": [
          "1-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1",
          "2-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2",
          "3-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3",
          "4-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4",
          "5-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5",
          "6-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6",
          "7-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7",
          "8-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8",
          "9-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b9",
          "10-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b10"
        ]
      },
      "2-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2": {
        "id": "2-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2",
        "name": "In Progress",
        "taskIds": []
      }
    },
    "tasks": {
      "1-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1": {
        "id": "1-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1",
        "status": "To Do",
        "priority": "high",
        "name": "Draft"
      },
      "2-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2": {
        "id": "2-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2",
        "status": "To Do",
        "priority": "high",
        "name": "Submitted"
      },
      "3-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3": {
        "id": "3-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3",
        "status": "To Do",
        "priority": "medium",
        "name": "Reviewed"
      },
      "4-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4": {
        "id": "4-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4",
        "status": "To Do",
        "priority": "low",
        "name": "Reviewed for record"
      },
      "5-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5": {
        "id": "5-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5",
        "status": "To Do",
        "priority": "low",
        "name": "Approved (APR)"
      },
      "6-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6": {
        "id": "6-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6",
        "status": "To Do",
        "priority": "medium",
        "name": "Make Corrections Noted (MCN)"
      },
      "7-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7": {
        "id": "7-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7",
        "status": "To Do",
        "priority": "medium",
        "name": "Make Corrections and Resubmit (MCNR)"
      },
      "8-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8": {
        "id": "8-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8",
        "status": "To Do",
        "priority": "high",
        "name": "Rejected (RJT)"
      },
      "9-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b9": {
        "id": "9-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b9",
        "status": "To Do",
        "priority": "low",
        "name": "Custom"
      },
      "10-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b10": {
        "id": "10-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b10",
        "status": "To Do",
        "priority": "medium",
        "name": "Sent to Subcontractor"
      }
    },
    "ordered": [
      "1-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1",
      "2-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2"
    ]
  }
};

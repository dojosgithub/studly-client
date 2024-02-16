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

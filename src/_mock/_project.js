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
    id: uuidv4()
  },
   {
    name: 'Construction',
    id: uuidv4()
  },
   {
    name: 'Electrical',
    id: uuidv4()
  },
   {
    name: 'Framing and Drywall',
    id: uuidv4()
  },
   {
    name: 'Flooring',
    id: uuidv4()
  },
];

import { add, subDays, format } from 'date-fns';
// assets
import { countries } from 'src/assets/data';
//
import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const SUBMITTALS_STATUS_OPTIONS = [
  { value: 'approved', label: 'Approved(APR)' },
  { value: 'mcnr', label: 'MCNR' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'pending', label: 'Pending' },
  { value: 'banned', label: 'Banned' },
];

export const _submittalsList = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  submittalId: _mock.id(index),
  name: _mock.fullName(index),
  description: 'Rancho Cordova',
  type: 'Shop Drawings',
  submissionDate: format(new Date(), 'dd/MM/yyyy'),
  returnDate: format(new Date(2024, 3, 1), 'dd/MM/yyyy'),
  creator: _mock.companyName(index),
  owner: _mock.fullName(index),
  link: 'www.google.com',
  status:
    (index % 2 && 'pending') || (index % 3 && 'mcnr') || (index % 4 && 'rejected') || 'approved',
}));

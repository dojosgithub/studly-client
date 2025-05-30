/* eslint-disable no-restricted-syntax */

export const getStatusStyle = (status) => {
  switch (status) {
    case 'Draft':
      return { bgcolor: '#919EAB33', color: '#A8A9AD' }; // orange
    case 'Submitted':
      return { bgcolor: '#22C55E29', color: '#118D57' }; // green
    case 'Reviewed for Record':
      return { bgcolor: '#00B8D929', color: '#006C9C' }; // red
    case 'Approved (APR)':
      return { bgcolor: '#00B8D929', color: '#006C9C' }; // red
    case 'Reviewed':
      return { bgcolor: '#00B8D929', color: '#006C9C' }; // red
    case 'Make Corrections Noted (MCN)':
      return { bgcolor: '#FFAB0029', color: '#B76E00' }; // red
    case 'Make Corrections and Resubmit (MCNR)':
      return { bgcolor: '#FFAB0029', color: '#B76E00' }; // red
    case 'Rejected (RJT)':
      return { bgcolor: '#FF563029', color: '#B71D18' }; // red
    default:
      return { bgcolor: '#E0E0E0', color: '#000000' }; // grey
  }
};

/* eslint-disable no-restricted-syntax */

export const getStatusStyle = (status) => {
  switch (status) {
    case 'Draft':
      return {
        bgcolor: '#919EAB33',
        color: '#A8A9AD',
        '&:hover': {
          bgcolor: '#919EAB33',
          color: '#A8A9AD',
        },
      };
    case 'Submitted':
      return {
        bgcolor: '#22C55E29',
        color: '#118D57',
        '&:hover': {
          bgcolor: '#22C55E29',
          color: '#118D57',
        },
      };
    case 'Reviewed for record':
    case 'Approved (APR)':
    case 'Reviewed':
      return {
        bgcolor: '#00B8D929',
        color: '#006C9C',
        '&:hover': {
          bgcolor: '#00B8D929',
          color: '#006C9C',
        },
      };
    case 'Make Corrections Noted (MCN)':
    case 'Make Corrections and Resubmit (MCNR)':
      return {
        bgcolor: '#FFAB0029',
        color: '#B76E00',
        '&:hover': {
          bgcolor: '#FFAB0029',
          color: '#B76E00',
        },
      };
    case 'Rejected (RJT)':
      return {
        bgcolor: '#FF563029',
        color: '#B71D18',
        '&:hover': {
          bgcolor: '#FF563029',
          color: '#B71D18',
        },
      };
    default:
      return {
        bgcolor: '#E0E0E0',
        color: '#000000',
        '&:hover': {
          bgcolor: '#E0E0E0',
          color: '#000000',
        },
      };
  }
};

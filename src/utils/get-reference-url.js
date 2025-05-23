/* eslint-disable no-restricted-syntax */
  
  export function getReferenceUrl(id, data) {
   if (data?.rfi?.some(item => item._id === id)) {
      return `rfi/${id}`;
    }
    if (data?.submittals?.some(item => item._id === id)) {
      return `submittals/${id}`;
    }
    return null; 
  }


  export function sanitizeLink(data) {
  if (data) {
    const parts = data.split('/');
  return parts[parts.length - 1];
  }
    return null; 
  }

/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-syntax */
  
export function getReferenceUrl(id, data) {

  const rfiItem = data?.RFI?.find(item => item._id == id);
  if (rfiItem) {
    return `rfi/${id}`;
  }

  const submittalItem = data?.Submittals?.find(item => item._id == id);
  if (submittalItem) {
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

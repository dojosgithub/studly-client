/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-syntax */
  
export function getReferenceUrl(ids, data) {
  if (!Array.isArray(ids)) return [];

  return ids.map(id => {
    const rfiItem = data?.RFI?.find(item => item._id == id);
    if (rfiItem) {
      return `rfi/${id}`;
    }

    const submittalItem = data?.Submittals?.find(item => item._id == id);
    if (submittalItem) {
      return `submittals/${id}`;
    }

    return null;
  }).filter(Boolean); // remove nulls
}

export function sanitizeLink(data) {
  if (Array.isArray(data)) {
    return data.map((url) => {
      if (typeof url === 'string') {
        const parts = url.split('/');
        return parts[parts.length - 1]; // return the last segment (e.g. the ID)
      }
      return null;
    }).filter(Boolean); // remove any null/undefined
  }

  return [];
}


export function groupReferenceLinks(referedTo = []) {
  const grouped = {
    submittals: [],
    rfi: [],
  };

  referedTo.forEach((item) => {
    if (item.startsWith('submittals/')) {
      grouped.submittals.push(item);
    } else if (item.startsWith('rfi/')) {
      grouped.rfi.push(item);
    }
  });

  return grouped;
}

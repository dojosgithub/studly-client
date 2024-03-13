import { format, getTime, formatDistanceToNow,parseISO } from 'date-fns';

// ----------------------------------------------------------------------

export function fDateISO(date) {
  const dateParsed = parseISO(date);
  const formattedDate = format(dateParsed, 'dd/MM/yyyy');
  return formattedDate 
}

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}

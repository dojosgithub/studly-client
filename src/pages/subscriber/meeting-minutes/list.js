import { Stack } from '@mui/material';
import { Helmet } from 'react-helmet-async';
// sections
import { MeetingMinutesListView } from 'src/sections/subscriber/meeting-minutes/view';

// ----------------------------------------------------------------------

export default function MeetingMinutesListPage() {
  
  return (
    <>
      <Helmet>
        <title> Meeting Minutes List</title>
      </Helmet>
      <Stack sx={{ maxWidth: '100vw' }}>
        <MeetingMinutesListView />
      </Stack>
    </>
  );
}

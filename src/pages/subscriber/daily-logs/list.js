import { Stack } from '@mui/material';
import { Helmet } from 'react-helmet-async';
// sections
import { MeetingMinutesListView } from 'src/sections/subscriber/daily-logs/view';

// ----------------------------------------------------------------------

export default function DailyLogsListPage() {
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

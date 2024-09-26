import { Stack } from '@mui/material';
import { Helmet } from 'react-helmet-async';
// sections
import { DailyLogsListView } from 'src/sections/subscriber/daily-logs/view';

// ----------------------------------------------------------------------

export default function DailyLogsListPage() {
  return (
    <>
      <Helmet>
        <title> Daily Logs List</title>
      </Helmet>
      <Stack sx={{ maxWidth: '100vw' }}>
        <DailyLogsListView />
      </Stack>
    </>
  );
}

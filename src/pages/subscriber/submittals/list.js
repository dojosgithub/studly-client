import { Stack } from '@mui/material';
import { Helmet } from 'react-helmet-async';
// sections
import { SubmittalsListView } from 'src/sections/subscriber/submittals/view';

// ----------------------------------------------------------------------

export default function SubmittalsListPage() {
  return (
    <>
      <Helmet>
        <title> Submittals List</title>
      </Helmet>
      <Stack sx={{ maxWidth: '100vw' }}>
        <SubmittalsListView />
      </Stack>
    </>
  );
}

import { Stack } from '@mui/material';
import { Helmet } from 'react-helmet-async';
// sections
import { RfiListView } from 'src/sections/subscriber/rfis/view';

// ----------------------------------------------------------------------

export default function RfiListPage() {
  
  return (
    <>
      <Helmet>
        <title> RFI List</title>
      </Helmet>
      <Stack sx={{ maxWidth: '100vw' }}>
        <RfiListView />
      </Stack>
    </>
  );
}

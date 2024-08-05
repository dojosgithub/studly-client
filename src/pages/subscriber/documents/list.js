import { Stack } from '@mui/material';
import { Helmet } from 'react-helmet-async';
// sections

import { documentsListView } from 'src/sections/subscriber/documents/view';
// ----------------------------------------------------------------------

export default function documentsListPage() {
  return (
    <>
      <Helmet>
        <title> Documents List</title>
      </Helmet>
      <Stack sx={{ maxWidth: '100vw' }}>
        <documentsListView />
      </Stack>
    </>
  );
}

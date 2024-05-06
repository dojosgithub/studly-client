import { Stack } from '@mui/material';
import { Helmet } from 'react-helmet-async';
// sections
import { CompanyListView } from 'src/sections/company/view';

// ----------------------------------------------------------------------

export default function CompanyListPage() {

  return (
    <>
      <Helmet>
        <title> Company List</title>
      </Helmet>
      <Stack sx={{ maxWidth: '100vw' }}>
        <CompanyListView />
      </Stack>
    </>
  );
}

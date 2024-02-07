import { Stack } from '@mui/material';
import { Helmet } from 'react-helmet-async';
// sections
import { CompanyListView } from 'src/sections/company/view';

// ----------------------------------------------------------------------

export default function UserListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: User List</title>
      </Helmet>
      <Stack sx={{ maxWidth: '100vw' }}>
        <CompanyListView />
      </Stack>
    </>
  );
}

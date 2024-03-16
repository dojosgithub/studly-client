import { Stack } from '@mui/material';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { fetchCompanyList } from 'src/redux/slices/companySlice';
// sections
import { CompanyListView } from 'src/sections/company/view';

// ----------------------------------------------------------------------

export default function CompanyListPage() {
  const dispatch=useDispatch()
  useEffect(() => {
    dispatch(fetchCompanyList())
  
  }, [dispatch])
  return (
    <>
      <Helmet>
        <title> Dashboard: Company List</title>
      </Helmet>
      <Stack sx={{ maxWidth: '100vw' }}>
        <CompanyListView />
      </Stack>
    </>
  );
}

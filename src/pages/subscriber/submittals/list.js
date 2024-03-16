import { Stack } from '@mui/material';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { getSubmittalList } from 'src/redux/slices/submittalSlice';
// sections
import { SubmittalsListView } from 'src/sections/subscriber/submittals/view';

// ----------------------------------------------------------------------

export default function SubmittalsListPage() {
  const dispatch=useDispatch()
  useEffect(() => {
    dispatch(getSubmittalList())
  
  }, [dispatch])
  
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

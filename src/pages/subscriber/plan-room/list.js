import { Stack } from '@mui/material';
import { Helmet } from 'react-helmet-async';
// sections
import { PlanRoomListView } from 'src/sections/subscriber/plan-room/view';

// ----------------------------------------------------------------------

export default function PlanRoomListPage() {
  
  return (
    <>
      <Helmet>
        <title> Plan Room List</title>
      </Helmet>
      <Stack sx={{ maxWidth: '100vw' }}>
        <PlanRoomListView />
      </Stack>
    </>
  );
}

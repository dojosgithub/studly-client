import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { DailyLogsCreateView } from 'src/sections/subscriber/daily-logs/view';
import { getExistingPlanRoomList } from 'src/redux/slices/planRoomSlice';
// sections

// ----------------------------------------------------------------------

export default function DailyLogsCreatePage() {
  const dispatch = useDispatch();

  // getting users list of project
  useEffect(() => {
    dispatch(getExistingPlanRoomList());
  }, [dispatch]);
  return (
    <>
      <Helmet>
        <title> Create new daily log page</title>
      </Helmet>

      <DailyLogsCreateView />
    </>
  );
}

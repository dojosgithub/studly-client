import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { MeetingMinutesCreateView } from 'src/sections/subscriber/daily-logs/view';
import { getExistingPlanRoomList } from 'src/redux/slices/planRoomSlice';
// sections

// ----------------------------------------------------------------------

export default function DailyLogsCreatePage() {
  const dispatch = useDispatch();
  const projectId = useSelector((state) => state?.project?.current?.id);

  // getting users list of project
  useEffect(() => {
    dispatch(getExistingPlanRoomList());
  }, [dispatch]);
  return (
    <>
      <Helmet>
        <title> Create new daily log page</title>
      </Helmet>

      <MeetingMinutesCreateView />
    </>
  );
}

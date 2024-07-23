import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { getExistingPlanRoomList } from 'src/redux/slices/planRoomSlice';
// sections
import { MeetingMinutesCreateView } from 'src/sections/subscriber/meeting-minutes/view';

// ----------------------------------------------------------------------

export default function MeetingMinutesCreatePage() {

  const dispatch = useDispatch();
  const projectId = useSelector(state=>state?.project?.current?.id);

// getting users list of project
  useEffect(() => {
      dispatch(getExistingPlanRoomList())
  }, [dispatch])
  return (
    <>
      <Helmet>
        <title> Create a new Meeting</title>
      </Helmet>

      <MeetingMinutesCreateView />
    </>
  );
}

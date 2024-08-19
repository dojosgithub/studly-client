import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { getRfiDetails } from 'src/redux/slices/rfiSlice';
import { getProjectAssigneeUsers, getProjectUsersList } from 'src/redux/slices/submittalSlice';
// routes
import { useParams } from 'src/routes/hooks';
import MeetingMinutesCreateView from 'src/sections/subscriber/meeting-minutes/meeting-minutes-create-view';
import { MeetingMinutesEditView } from 'src/sections/subscriber/meeting-minutes/view';
// sections
import { PlanRoomEditView } from 'src/sections/subscriber/plan-room/view';

// ----------------------------------------------------------------------

export default function PlanRoomEditPage() {
  const params = useParams();
  const { id } = params;

  const dispatch = useDispatch();
  const projectId = useSelector((state) => state?.project?.current?._id);

  //   console.log('edit', id)
  // getting users list of project
  // useEffect(() => {
  //   dispatch(getProjectUsersList())
  //   dispatch(getProjectAssigneeUsers())
  //   async function getDetails(){

  //     await dispatch(getRfiDetails(id));
  //   }
  //   getDetails()

  // }, [id, dispatch])
  return (
    <>
      <Helmet>
        <title> Meeting Minutes Edit</title>
      </Helmet>

      {/* <PlanRoomEditView id={`${id}`} /> */}
      {/* <MeetingMinutesCreateView /> */}
      <MeetingMinutesEditView />
    </>
  );
}

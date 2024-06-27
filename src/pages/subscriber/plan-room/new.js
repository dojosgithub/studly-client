import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { getExistingPlanRoomList } from 'src/redux/slices/planRoomSlice';
// sections
import { PlanRoomCreateView } from 'src/sections/subscriber/plan-room/view';

// ----------------------------------------------------------------------

export default function PlanRoomCreatePage() {

  const dispatch = useDispatch();
  const projectId = useSelector(state=>state?.project?.current?.id);

  console.log('projectIdPlanRoom', projectId)
// getting users list of project
  useEffect(() => {
      dispatch(getExistingPlanRoomList())
  }, [dispatch])
  return (
    <>
      <Helmet>
        <title> Create a new Plan</title>
      </Helmet>

      <PlanRoomCreateView />
    </>
  );
}

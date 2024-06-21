import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { getRfiDetails } from 'src/redux/slices/rfiSlice';
import { getProjectAssigneeUsers, getProjectUsersList, getSubmittalDetails } from 'src/redux/slices/submittalSlice';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { PlanRoomEditView } from 'src/sections/subscriber/plan-room/view';

// ----------------------------------------------------------------------

export default function PlanRoomEditPage() {
  const params = useParams();
  const { id } = params;

  const dispatch = useDispatch()
  const projectId = useSelector(state => state?.project?.current?.id);
  console.log('projectId Submittal Edit', projectId)

  // getting users list of project
  useEffect(() => {
    console.log('edit', id)
    dispatch(getProjectUsersList())
    dispatch(getProjectAssigneeUsers())
    async function getDetails(){

      await dispatch(getRfiDetails(id));
    }
    getDetails()

  }, [id, dispatch])
  return (
    <>
      <Helmet>
        <title> Plan Room Edit</title>
      </Helmet>

      <PlanRoomEditView id={`${id}`} />
    </>
  );
}

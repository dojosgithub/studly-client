import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectAssigneeUsers, getProjectUsersList } from 'src/redux/slices/submittalSlice';
// sections
import { SubmittalsCreateView } from 'src/sections/subscriber/submittals/view';

// ----------------------------------------------------------------------

export default function SubmittalsCreatePage() {

  const dispatch = useDispatch();
  const projectId = useSelector(state=>state?.project?.current?.id);

  console.log('projectIdSubmittal', projectId)
// getting users list of project
  useEffect(() => {
      dispatch(getProjectUsersList())
      dispatch(getProjectAssigneeUsers())
  }, [dispatch])
  return (
    <>
      <Helmet>
        <title> Create a new Submittal</title>
      </Helmet>

      <SubmittalsCreateView />
    </>
  );
}

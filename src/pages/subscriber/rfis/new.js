import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectAssigneeUsers, getProjectUsersList } from 'src/redux/slices/submittalSlice';
// sections
import { RfiCreateView } from 'src/sections/subscriber/rfis/view';

// ----------------------------------------------------------------------

export default function RfiCreatePage() {

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
        <title> Create a new Rfi</title>
      </Helmet>

      <RfiCreateView />
    </>
  );
}

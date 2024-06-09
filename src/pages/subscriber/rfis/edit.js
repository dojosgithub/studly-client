import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectAssigneeUsers, getProjectUsersList, getSubmittalDetails } from 'src/redux/slices/submittalSlice';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { SubmittalsEditView } from 'src/sections/subscriber/submittals/view';

// ----------------------------------------------------------------------

export default function SubmittalsEditPage() {
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

      await dispatch(getSubmittalDetails(id));
    }
    getDetails()

  }, [id, dispatch])
  return (
    <>
      <Helmet>
        <title> Submittal Edit</title>
      </Helmet>

      <SubmittalsEditView id={`${id}`} />
    </>
  );
}

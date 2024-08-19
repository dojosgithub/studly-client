import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectAssigneeUsers, getProjectUsersList } from 'src/redux/slices/submittalSlice';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { SubmittalsRevisionView } from 'src/sections/subscriber/submittals/view';

// ----------------------------------------------------------------------

export default function SubmittalsRevisionPage() {
  const params = useParams();
  const { id } = params;

  const dispatch = useDispatch();
  const projectId = useSelector((state) => state?.project?.current?._id);

  // getting users list of project
  useEffect(() => {
    dispatch(getProjectUsersList());
    dispatch(getProjectAssigneeUsers());
  }, [id, dispatch]);
  return (
    <>
      <Helmet>
        <title> Submittal Revision</title>
      </Helmet>

      <SubmittalsRevisionView id={`${id}`} />
    </>
  );
}

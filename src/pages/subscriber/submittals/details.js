import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { getAllProjectUsersList, getSubmittalDetails } from 'src/redux/slices/submittalSlice';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { SubmittalsDetailsView } from 'src/sections/subscriber/submittals/view';

// ----------------------------------------------------------------------

export default function SubmittalsDetailsPage() {
  const params = useParams();
  const dispatch = useDispatch();

  const { id } = params;
  useEffect(() => {
    dispatch(getSubmittalDetails(id));
    dispatch(getAllProjectUsersList());
  }, [dispatch, id]);

  return (
    <>
      <Helmet>
        <title> Submittal Details</title>
      </Helmet>

      <SubmittalsDetailsView id={`${id}`} />
    </>
  );
}

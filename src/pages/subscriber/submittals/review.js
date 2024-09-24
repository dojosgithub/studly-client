import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { getSubmittalDetails, getSubmittalResponseDetails } from 'src/redux/slices/submittalSlice';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { SubmittalsReviewRespondView } from 'src/sections/subscriber/submittals/view';

// ----------------------------------------------------------------------

export default function SubmittalsReviewPage() {
  const params = useParams();
  const dispatch = useDispatch();

  const { id } = params;
  useEffect(() => {
    async function fetchDetails() {
      await dispatch(getSubmittalDetails(id));
      await dispatch(getSubmittalResponseDetails(id));
    }
    fetchDetails();
  }, [dispatch, id]);
  return (
    <>
      <Helmet>
        <title> Submittal Review</title>
      </Helmet>

      <SubmittalsReviewRespondView id={`${id}`} />
    </>
  );
}

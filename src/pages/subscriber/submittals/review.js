import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { getSubmittalDetails } from 'src/redux/slices/submittalSlice';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { SubmittalsReviewRespondView } from 'src/sections/subscriber/submittals/view';

// ----------------------------------------------------------------------

export default function SubmittalsDetailsPage() {
    const params = useParams();
    const dispatch = useDispatch();

    const { id } = params;
    console.log('details', id)
    // useEffect(() => {
    //     dispatch(getSubmittalDetails(id))
    // }, [dispatch, id])

    return (
        <>
            <Helmet>
                <title> Submittals Review</title>
            </Helmet>

            <SubmittalsReviewRespondView id={`${id}`} />
        </>
    );
}

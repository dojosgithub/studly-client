import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { getSubmittalDetails, getSubmittalResponseDetails } from 'src/redux/slices/submittalSlice';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { SubmittalsReviewRespondView } from 'src/sections/subscriber/submittals/view';

// ----------------------------------------------------------------------

export default function SubmittalsDetailsPage() {
    const params = useParams();
    const dispatch = useDispatch();

    const { id } = params;
    console.log('reviewDetails', id)
    useEffect(() => {
        async function fetchDetails() {
            await dispatch(getSubmittalResponseDetails(id))
            // const { error, payload } = await dispatch(getSubmittalResponseDetails(id))
            // console.log('error', error)
            // console.log('payload', payload)
        }
        fetchDetails()
        // dispatch(getSubmittalResponseDetails(id))
    }, [dispatch, id])
    return (
        <>
            <Helmet>
                <title> Submittals Review</title>
            </Helmet>

            <SubmittalsReviewRespondView id={`${id}`} />
        </>
    );
}

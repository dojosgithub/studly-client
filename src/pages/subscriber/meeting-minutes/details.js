import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { getMeetingMinutesDetails } from 'src/redux/slices/meetingMinutesSlice';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { MeetingMinutesDetailsView } from 'src/sections/subscriber/meeting-minutes/view';

// ----------------------------------------------------------------------

export default function MeetingMinutesDetailsPage() {
    const params = useParams();
    const dispatch = useDispatch();

    const { id } = params;
    console.log('details', id)
    useEffect(() => {
        dispatch(getMeetingMinutesDetails(id))
    }, [dispatch, id])

    return (
        <>
            <Helmet>
                <title> Meeting Minutes Details</title>
            </Helmet>

            <MeetingMinutesDetailsView id={`${id}`} />
        </>
    );
}

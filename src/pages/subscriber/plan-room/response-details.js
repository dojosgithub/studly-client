import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { getPlanRoomDetails } from 'src/redux/slices/planRoomSlice';
import { getSubmittalDetails, getSubmittalResponseDetails } from 'src/redux/slices/submittalSlice';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { PlanRoomResponseDetailsView } from 'src/sections/subscriber/plan-room/view';

// ----------------------------------------------------------------------

export default function PlanRoomResponseDetailsPage() {
    const params = useParams();
    const dispatch = useDispatch();

    const { id } = params;
    useEffect(() => {
        async function fetchDetails() {
            await dispatch(getPlanRoomDetails(id))
            // await dispatch(getSubmittalResponseDetails(id))
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
                <title> Plan Room Response Details</title>
            </Helmet>

            <PlanRoomResponseDetailsView id={`${id}`} />
        </>
    );
}

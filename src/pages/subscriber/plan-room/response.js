import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { getRfiDetails } from 'src/redux/slices/rfiSlice';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { PlanRoomResponseView } from 'src/sections/subscriber/plan-room/view';

// ----------------------------------------------------------------------

export default function RfiResponsePage() {
    const params = useParams();
    const dispatch = useDispatch();

    const { id } = params;
    useEffect(() => {
        async function fetchDetails() {
            await dispatch(getRfiDetails(id))
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
                <title> Plan Room Response</title>
            </Helmet>

            <PlanRoomResponseView id={`${id}`} />
        </>
    );
}

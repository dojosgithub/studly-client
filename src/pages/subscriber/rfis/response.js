import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { getRfiDetails } from 'src/redux/slices/rfiSlice';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { RfiResponseView } from 'src/sections/subscriber/rfis/view';

// ----------------------------------------------------------------------

export default function RfiResponsePage() {
    const params = useParams();
    const dispatch = useDispatch();

    const { id } = params;
    console.log('responseDetails', id)
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
                <title> RFI Response</title>
            </Helmet>

            <RfiResponseView id={`${id}`} />
        </>
    );
}

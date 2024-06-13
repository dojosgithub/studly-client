import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { getRfiDetails } from 'src/redux/slices/rfiSlice';
import { getSubmittalDetails, getSubmittalResponseDetails } from 'src/redux/slices/submittalSlice';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { RfiResponseDetailsView } from 'src/sections/subscriber/rfis/view';

// ----------------------------------------------------------------------

export default function RfiResponseDetailsPage() {
    const params = useParams();
    const dispatch = useDispatch();

    const { id } = params;
    console.log('rfiResponseDetails', id)
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
                <title> RFI Response Details</title>
            </Helmet>

            <RfiResponseDetailsView id={`${id}`} />
        </>
    );
}

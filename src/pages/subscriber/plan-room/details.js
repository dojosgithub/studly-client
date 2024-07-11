import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { getAllProjectUsersList,  } from 'src/redux/slices/submittalSlice';
import { getRfiDetails  } from 'src/redux/slices/rfiSlice';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { PlanRoomDetailsView } from 'src/sections/subscriber/plan-room/view';
import { getPlanRoomDetails } from 'src/redux/slices/planRoomSlice';

// ----------------------------------------------------------------------

export default function RfiDetailsPage() {
    const params = useParams();
    const dispatch = useDispatch();

    const { id } = params;
    console.log('details', id)
    useEffect(() => {
        dispatch(getPlanRoomDetails(id))
        // getting users list of project
        // dispatch(getAllProjectUsersList())
        // dispatch(getProjectUsersList())
        // dispatch(getProjectAssigneeUsers())
    }, [dispatch, id])

    return (
        <>
            <Helmet>
                <title> Plan Room Details</title>
            </Helmet>

            <PlanRoomDetailsView id={`${id}`} />
        </>
    );
}

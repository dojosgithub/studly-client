import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { getAllProjectUsersList } from 'src/redux/slices/submittalSlice';
import { getRfiDetails } from 'src/redux/slices/rfiSlice';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { RfiDetailsView } from 'src/sections/subscriber/rfis/view';

// ----------------------------------------------------------------------

export default function RfiDetailsPage() {
  const params = useParams();
  const dispatch = useDispatch();

  const { id } = params;
  useEffect(() => {
    dispatch(getRfiDetails(id));
    dispatch(getAllProjectUsersList());
  }, [dispatch, id]);

  return (
    <>
      <Helmet>
        <title> RFI Details</title>
      </Helmet>

      <RfiDetailsView id={`${id}`} />
    </>
  );
}

import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { getRfiDetails } from 'src/redux/slices/rfiSlice';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { RfiResponseDetailsView } from 'src/sections/subscriber/rfis/view';

// ----------------------------------------------------------------------

export default function RfiResponseDetailsPage() {
  const params = useParams();
  const dispatch = useDispatch();

  const { id } = params;
  useEffect(() => {
    async function fetchDetails() {
      await dispatch(getRfiDetails(id));
    }
    fetchDetails();
  }, [dispatch, id]);
  return (
    <>
      <Helmet>
        <title> RFI Response Details</title>
      </Helmet>

      <RfiResponseDetailsView id={`${id}`} />
    </>
  );
}

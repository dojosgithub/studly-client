import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { getProjectRfiUsersList, getRfiDetails } from 'src/redux/slices/rfiSlice';
import { getProjectAssigneeUsers } from 'src/redux/slices/submittalSlice';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { RfiEditView } from 'src/sections/subscriber/rfis/view';

// ----------------------------------------------------------------------

export default function SubmittalsEditPage() {
  const params = useParams();
  const { id } = params;

  const dispatch = useDispatch();

  // getting users list of project
  useEffect(() => {
    dispatch(getProjectRfiUsersList());
    dispatch(getProjectAssigneeUsers());
    async function getDetails() {
      await dispatch(getRfiDetails(id));
    }
    getDetails();
  }, [id, dispatch]);
  return (
    <>
      <Helmet>
        <title> RFI Edit</title>
      </Helmet>

      <RfiEditView id={`${id}`} />
    </>
  );
}

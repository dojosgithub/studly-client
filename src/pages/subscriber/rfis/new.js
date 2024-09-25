import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { getProjectRfiUsersList } from 'src/redux/slices/rfiSlice';
import { getProjectAssigneeUsers } from 'src/redux/slices/submittalSlice';
// sections
import { RfiCreateView } from 'src/sections/subscriber/rfis/view';

// ----------------------------------------------------------------------

export default function RfiCreatePage() {
  const dispatch = useDispatch();

  // getting users list of project
  useEffect(() => {
    dispatch(getProjectRfiUsersList());
    dispatch(getProjectAssigneeUsers());
  }, [dispatch]);
  return (
    <>
      <Helmet>
        <title> Create a new RFI</title>
      </Helmet>

      <RfiCreateView />
    </>
  );
}

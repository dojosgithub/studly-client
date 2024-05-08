import { useEffect } from 'react';
import PropTypes from 'prop-types';
//
import { useDispatch, useSelector } from 'react-redux';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _userList } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { setCurrentSubmittal } from 'src/redux/slices/submittalSlice';
import SubmittalsNewEditForm from '../submittals-new-edit-form';

// ----------------------------------------------------------------------

export default function SubmittalsEditView({ id }) {
  const settings = useSettingsContext();

  const submittalList = useSelector(state => state.submittal?.list?.docs)
  const dispatch = useDispatch()
  const currentSubmittal = submittalList?.find(item => item.id === id)
  console.log("currentSubmittal", currentSubmittal)
  console.log("sumittalId", id)
  useEffect(() => {
    if (id) {
      dispatch(setCurrentSubmittal(currentSubmittal))
    }

  }, [dispatch, id, currentSubmittal])


  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit Submittal"
        links={[
          {
            name: 'Dashboard',
            // href: paths.subscriber.root,
          },
          {
            name: 'Submittals',
            href: paths.subscriber.submittals.list,
          },
          { name: 'Update Submittal' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SubmittalsNewEditForm currentSubmittal={currentSubmittal} id={id} />
    </Container>
  );
}

SubmittalsEditView.propTypes = {
  id: PropTypes.string,
};

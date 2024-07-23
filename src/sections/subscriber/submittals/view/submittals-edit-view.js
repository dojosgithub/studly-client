import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
//
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { isEmpty } from 'lodash';
import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';
import { useSnackbar } from 'notistack';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { SUBSCRIBER_USER_ROLE_STUDLY, _userList } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { getSubmittalDetails, getSubmittalList, setCurrentSubmittal, submitSubmittalToArchitect } from 'src/redux/slices/submittalSlice';
import { useRouter } from 'src/routes/hooks';
import SubmittalsNewEditForm from '../submittals-new-edit-form';

// ----------------------------------------------------------------------

export default function SubmittalsEditView({ id }) {
  const settings = useSettingsContext();
  // const submittalList = useSelector(state => state.submittal?.list?.docs)
  // const currentSubmittal = submittalList?.find(item => item.id === id)
  // const dispatch = useDispatch()
  const currentSubmittal = useSelector((state) => state.submittal.current);

  // useEffect(() => {
  //   // if (id) {
  //   // }
  //   if(!isEmpty(currentSubmittal)){
  //     dispatch(setCurrentSubmittal(currentSubmittal))
  //   }

  // }, [dispatch, id, currentSubmittal])

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
      {/* {currentSubmittal?.status === 'Draft' &&
        (currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.CAD ||
          currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.PWU) && (
          <Box width="100%" display="flex" justifyContent="end">
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting}
              onClick={handleSubmitToArchitect}
            >
              Submit to Review
            </LoadingButton>
          </Box>
        )} */}
      <SubmittalsNewEditForm currentSubmittal={currentSubmittal} id={id} />
    </Container>
  );
}

SubmittalsEditView.propTypes = {
  id: PropTypes.string,
};

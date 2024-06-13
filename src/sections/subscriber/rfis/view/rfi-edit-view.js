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
import RfiNewEditForm from '../rfi-new-edit-form';

// ----------------------------------------------------------------------

export default function RfiEditView({ id }) {
  const settings = useSettingsContext();
  // const rfiList = useSelector(state => state.rfi?.list?.docs)
  // const currentRfi = rfiList?.find(item => item.id === id)
  // const dispatch = useDispatch()
  const currentRfi = useSelector((state) => state.rfi.current);

  console.log("currentRfiEdit", currentRfi)
  console.log("rfiId", id)
  
  // useEffect(() => {
  //   // if (id) {
  //   // }
  //   if(!isEmpty(currentRfi)){
  //     dispatch(setCurrentSubmittal(currentRfi))
  //   }

  // }, [dispatch, id, currentRfi])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit RFI"
        links={[
          {
            name: 'Dashboard',
            // href: paths.subscriber.root,
          },
          {
            name: 'RFIs',
            href: paths.subscriber.rfi.list,
          },
          { name: 'Update RFI' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {/* {currentRfi?.status === 'Draft' &&
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
      <RfiNewEditForm currentRfi={currentRfi} id={id} />
    </Container>
  );
}

RfiEditView.propTypes = {
  id: PropTypes.string,
};

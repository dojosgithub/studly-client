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
import SubmittalsNewEditForm from '../plan-room-new-edit-form';

// ----------------------------------------------------------------------

export default function SubmittalsRevisionView({ id }) {
  const settings = useSettingsContext();
  // const submittalList = useSelector(state => state.submittal?.list?.docs)
  // const dispatch = useDispatch()
  // const currentSubmittal = submittalList?.find(item => item.id === id)
  const currentSubmittal = useSelector((state) => state.submittal.current);
  

  console.log("currentSubmittalReview", currentSubmittal)
  console.log("sumittalId", id)

  // useEffect(() => {
  //   // if (id) {
  //   // }
  //   if (!isEmpty(currentSubmittal)) {
  //     dispatch(setCurrentSubmittal(currentSubmittal))
  //   }

  // }, [dispatch, id, currentSubmittal])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Revision Submittal"
        links={[
          {
            name: 'Dashboard',
            // href: paths.subscriber.root,
          },
          {
            name: 'Submittals',
            href: paths.subscriber.submittals.list,
          },
          { name: 'Revision Submittal' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SubmittalsNewEditForm currentSubmittal={currentSubmittal} id={id} />
    </Container>
  );
}

SubmittalsRevisionView.propTypes = {
  id: PropTypes.string,
};

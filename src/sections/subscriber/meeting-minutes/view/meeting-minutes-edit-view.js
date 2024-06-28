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
import MeetingMinutesNewEditForm from '../meeting-minutes-new-edit-form';

// ----------------------------------------------------------------------

export default function MeetingMinutesEditView({ id }) {
  const settings = useSettingsContext();
  const currentMeetingMinutes = useSelector((state) => state.plan.current);

  console.log("currentMeetingMinutesEdit", currentMeetingMinutes)
  console.log("planId", id)

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit Meeting Minutes"
        links={[
          {
            name: 'Dashboard',
            // href: paths.subscriber.root,
          },
          {
            name: 'Meeting Minutes',
            href: paths.subscriber.meetingMinutes.list,
          },
          { name: 'Update Meeting Minutes' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
    
      <MeetingMinutesNewEditForm currentMeetingMinutes={currentMeetingMinutes} id={id} />
    </Container>
  );
}

MeetingMinutesEditView.propTypes = {
  id: PropTypes.string,
};

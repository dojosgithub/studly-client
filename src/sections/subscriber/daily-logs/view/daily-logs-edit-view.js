import PropTypes from 'prop-types';
//
import { useSelector } from 'react-redux';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
// import MeetingMinutesNewEditForm from '../meeting-minutes-new-edit-form';
// import MeetingMinutesStepperForm from '../meeting-minutes-stepper-form';
// import MeetingMinutesStepperView from './meeting-minutes-stepper-view';

// ----------------------------------------------------------------------

export default function MeetingMinutesEditView({ id }) {
  const settings = useSettingsContext();
  // const currentMeetingMinutes = useSelector((state) => state.plan.current);

  // console.log("currentMeetingMinutesEdit", currentMeetingMinutes)

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit Daily Logs"
        links={[
          {
            name: 'Dashboard',
            // href: paths.subscriber.root,
          },
          {
            name: 'Daily Logs',
            href: paths.subscriber.meetingMinutes.list,
          },
          { name: 'Update Daily Logs' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {/* <MeetingMinutesNewEditForm currentMeetingMinutes={currentMeetingMinutes} id={id} /> */}
      {/* <MeetingMinutesStepperForm /> */}
      {/* <MeetingMinutesStepperView isEdit /> */}
    </Container>
  );
}

MeetingMinutesEditView.propTypes = {
  id: PropTypes.string,
};

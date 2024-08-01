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
import { setCurrentDailyLogs } from 'src/redux/slices/dailyLogsSlice';
import DailyLogsStepperForm from '../daily-logs-stepper-form';
import DailyLogsStepperView from './daily-logs-stepper-view';
//
import DailyLogsNewEditForm from '../daily-logs-new-edit-form';
// import MeetingMinutesStepperForm from '../meeting-minutes-stepper-form';
// import MeetingMinutesStepperView from './meeting-minutes-stepper-view';

// ----------------------------------------------------------------------

export default function DailyLogsEditView({ id }) {
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
            href: paths.subscriber.logs.list,
          },
          { name: 'Update Daily Logs' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {/* 
      <DailyLogsNewEditForm currentMeetingMinutes={setCurrentDailyLogs} id={id} />
      <DailyLogsStepperForm /> */}
      <DailyLogsStepperView isEdit />
    </Container>
  );
}

DailyLogsEditView.propTypes = {
  id: PropTypes.string,
};

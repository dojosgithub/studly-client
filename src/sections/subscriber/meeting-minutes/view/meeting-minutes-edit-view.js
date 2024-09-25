import PropTypes from 'prop-types';
//
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import MeetingMinutesStepperView from './meeting-minutes-stepper-view';

// ----------------------------------------------------------------------

export default function MeetingMinutesEditView({ id }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit Meeting Minutes"
        links={[
          {
            name: 'Dashboard',
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

      <MeetingMinutesStepperView isEdit />
    </Container>
  );
}

MeetingMinutesEditView.propTypes = {
  id: PropTypes.string,
};

// @mui
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';

// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import MeetingMinutesStepperView from './meeting-minutes-stepper-view';

// ----------------------------------------------------------------------

export default function MeetingMinutesCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Meeting"
        links={[
          {
            name: 'Dashboard',
          },
          {
            name: 'Meeting Minutes',
            href: paths.subscriber.meetingMinutes.list,
          },
          { name: 'New' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Divider sx={{ height: '1px', background: 'rgb(145 158 171 / 20%)' }} />

      <MeetingMinutesStepperView />
    </Container>
  );
}

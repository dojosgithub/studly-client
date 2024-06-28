// @mui
import Container from '@mui/material/Container';

// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import MeetingMinutesEditForm from '../meeting-minutes-new-edit-form';

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
            // href: paths.subscriber.root,
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

       <MeetingMinutesEditForm />

    </Container>
  );
}

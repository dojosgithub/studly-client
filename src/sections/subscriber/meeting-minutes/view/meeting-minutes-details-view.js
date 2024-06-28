import PropTypes from 'prop-types';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import MeetingMinutesDetails from '../meeting-minutes-details';

// ----------------------------------------------------------------------

export default function MeetingMinutesDetailsView({ id }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Meeting Minutes Details"
        links={[
          {
            name: 'Meeting Minutes',
            href: paths.subscriber.meetingMinutes.list,
          },
          { name: 'Details' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <MeetingMinutesDetails id={id}/>
    </Container>
  );
}

MeetingMinutesDetailsView.propTypes = {
  id: PropTypes.string,
};

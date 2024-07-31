import PropTypes from 'prop-types';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import DailyLogsDetails from '../daily-logs-details';

// ----------------------------------------------------------------------

export default function DailyLogsDetailsView({ id }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Daily Logs Details"
        links={[
          {
            name: 'Daily Logs',
            href: paths.subscriber.logs.list,
          },
          { name: 'Details' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DailyLogsDetails id={id} />
    </Container>
  );
}

DailyLogsDetailsView.propTypes = {
  id: PropTypes.string,
};

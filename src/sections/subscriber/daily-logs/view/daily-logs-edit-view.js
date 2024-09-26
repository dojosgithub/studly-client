import PropTypes from 'prop-types';
//
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import DailyLogsStepperView from './daily-logs-stepper-view';
//

// ----------------------------------------------------------------------

export default function DailyLogsEditView({ id }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit Daily Logs"
        links={[
          {
            name: 'Dashboard',
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

      <DailyLogsStepperView isEdit />
    </Container>
  );
}

DailyLogsEditView.propTypes = {
  id: PropTypes.string,
};

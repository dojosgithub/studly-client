// @mui
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';

// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import DailyLogsStepperView from './daily-logs-stepper-view';
//

// ----------------------------------------------------------------------

export default function DailyLogsCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a New Daily Log"
        links={[
          {
            name: 'Dashboard',
            href: paths.subscriber.root,
          },
          {
            name: 'Daily Logs',
            href: paths.subscriber.logs.list,
          },
          { name: 'New' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Divider sx={{ height: '1px', background: 'rgb(145 158 171 / 20%)' }} />

      <DailyLogsStepperView />
    </Container>
  );
}

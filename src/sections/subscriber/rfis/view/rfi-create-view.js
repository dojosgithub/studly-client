// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import RfiNewEditForm from '../rfi-new-edit-form';

// ----------------------------------------------------------------------

export default function RfiCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new RFI"
        links={[
          {
            name: 'Dashboard',
            // href: paths.subscriber.root,
          },
          {
            name: 'RFIs',
            href: paths.subscriber.rfi.list,
          },
          { name: 'New RFI' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RfiNewEditForm />
    </Container>
  );
}

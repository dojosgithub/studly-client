// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import CompanyNewEditForm from '../company-new-edit-form';

// ----------------------------------------------------------------------

export default function CompanyCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new company"
        links={[
          {
            name: 'Companies',
            href: paths.admin.company.list,
          },
          { name: 'Create' },
        ]}
        sx={{
          my: { xs: 3 },
        }}
      />

      <CompanyNewEditForm />
    </Container>
  );
}

import PropTypes from 'prop-types';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _userList } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import CompanyNewEditForm from '../company-new-edit-form';

// ----------------------------------------------------------------------

export default function CompanyEditView({ isEdit = false }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Companies',
            href: paths.dashboard.company.list,
          },
          { name: 'Update Company' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CompanyNewEditForm isEdit={isEdit} />
    </Container>
  );
}

CompanyEditView.propTypes = {
  isEdit: PropTypes.bool,
};

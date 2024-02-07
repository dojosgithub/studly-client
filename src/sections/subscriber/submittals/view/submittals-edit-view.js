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
import SubmittalsNewEditForm from '../submittals-new-edit-form';

// ----------------------------------------------------------------------

export default function SubmittalsEditView({ id }) {
  const settings = useSettingsContext();

  const currentUser = _userList.find((user) => user.id === id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit Submittal"
        links={[
          {
            name: 'Dashboard',
            // href: paths.dashboard.root,
          },
          {
            name: 'Submittals',
            href: paths.dashboard.company.list,
          },
          { name: currentUser?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SubmittalsNewEditForm currentUser={currentUser} />
    </Container>
  );
}

SubmittalsEditView.propTypes = {
  id: PropTypes.string,
};

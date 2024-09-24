import PropTypes from 'prop-types';
//
import { useSelector } from 'react-redux';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//

import RfiNewEditForm from '../rfi-new-edit-form';

// ----------------------------------------------------------------------

export default function RfiEditView({ id }) {
  const settings = useSettingsContext();
  const currentRfi = useSelector((state) => state.rfi.current);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit RFI"
        links={[
          {
            name: 'Dashboard',
          },
          {
            name: 'RFIs',
            href: paths.subscriber.rfi.list,
          },
          { name: 'Update RFI' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RfiNewEditForm currentRfi={currentRfi} id={id} />
    </Container>
  );
}

RfiEditView.propTypes = {
  id: PropTypes.string,
};

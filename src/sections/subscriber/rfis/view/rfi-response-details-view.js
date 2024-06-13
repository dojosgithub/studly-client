import PropTypes from 'prop-types';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import RfiResponseDetails from '../rfi-response-details';

// ----------------------------------------------------------------------

export default function RfiResponseDetailsView({ id }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="RFI Response Details"
        links={[
          {
            name: 'RFI',
            href: paths.subscriber.rfi.list,
          },
          {
            name: 'RFI Details',
            href: paths.subscriber.rfi.details(id),
          },
          { name: 'Response Details' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RfiResponseDetails id={id}/>
    </Container>
  );
}

RfiResponseDetailsView.propTypes = {
  id: PropTypes.string,
};

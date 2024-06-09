import PropTypes from 'prop-types';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import RfiDetails from '../rfi-details';

// ----------------------------------------------------------------------

export default function RfiDetailsView({ id }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Submittals Details"
        links={[
          {
            name: 'Submittals',
            href: paths.subscriber.submittals.list,
          },
          { name: 'Details' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RfiDetails id={id}/>
    </Container>
  );
}

RfiDetailsView.propTypes = {
  id: PropTypes.string,
};

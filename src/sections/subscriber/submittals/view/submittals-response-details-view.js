import PropTypes from 'prop-types';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import SubmittalsResponseDetails from '../submittals-response-details';

// ----------------------------------------------------------------------

export default function SubmittalsResponseDetailsView({ id }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Submittals Response Details"
        links={[
          {
            name: 'Submittals',
            href: paths.subscriber.submittals.list,
          },
          {
            name: 'Details',
            href: paths.subscriber.submittals.details(id),
          },
          { name: 'Response' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SubmittalsResponseDetails id={id}/>
    </Container>
  );
}

SubmittalsResponseDetailsView.propTypes = {
  id: PropTypes.string,
};

import PropTypes from 'prop-types';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import PlanRoomResponseDetails from '../plan-room-response-details';

// ----------------------------------------------------------------------

export default function PlanRoomResponseDetailsView({ id }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Plan Room Response Details"
        links={[
          {
            name: 'Plan Room',
            href: paths.subscriber.planRoom.list,
          },
          {
            name: 'Plan Room Details',
            href: paths.subscriber.planRoom.details(id),
          },
          { name: 'Response Details' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PlanRoomResponseDetails id={id}/>
    </Container>
  );
}

PlanRoomResponseDetailsView.propTypes = {
  id: PropTypes.string,
};

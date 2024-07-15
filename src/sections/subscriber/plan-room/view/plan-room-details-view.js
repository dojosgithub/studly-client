import PropTypes from 'prop-types';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import RfiDetails from '../plan-room-details';

// ----------------------------------------------------------------------

export default function PlanRoomDetailsView({ id }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Plan Room Details"
        links={[
          {
            name: 'Plan Room',
            href: paths.subscriber.planRoom.list,
          },
          { name: 'Details' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {/* <RfiDetails id={id}/> */}
      Hello
    </Container>
  );
}

PlanRoomDetailsView.propTypes = {
  id: PropTypes.string,
};

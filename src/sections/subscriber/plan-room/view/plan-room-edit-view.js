import PropTypes from 'prop-types';
//
import { useSelector } from 'react-redux';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//

import PlanRoomNewEditForm from '../plan-room-new-edit-form';

// ----------------------------------------------------------------------

export default function PlanRoomEditView({ id }) {
  const settings = useSettingsContext();

  const currentPlan = useSelector((state) => state.plan.current);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit Plan"
        links={[
          {
            name: 'Dashboard',
            // href: paths.subscriber.root,
          },
          {
            name: 'Plan Room',
            href: paths.subscriber.PlanRoom.list,
          },
          { name: 'Update Plan' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PlanRoomNewEditForm currentPlan={currentPlan} id={id} />
    </Container>
  );
}

PlanRoomEditView.propTypes = {
  id: PropTypes.string,
};

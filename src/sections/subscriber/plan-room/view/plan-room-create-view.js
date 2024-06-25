import { useState } from 'react';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import PlanRoomNewEditForm from '../plan-room-new-edit-form';
import PlanRoomPdfConverter from '../plan-room-pdf-converter';

// ----------------------------------------------------------------------

export default function PlanRoomCreateView() {
  const settings = useSettingsContext();
  
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Plan"
        links={[
          {
            name: 'Dashboard',
            // href: paths.subscriber.root,
          },
          {
            name: 'Plan Room',
            href: paths.subscriber.planRoom.list,
          },
          { name: 'New Plan' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PlanRoomNewEditForm />
      {/* <PlanRoomPdfConverter/> */}
    </Container>
  );
}

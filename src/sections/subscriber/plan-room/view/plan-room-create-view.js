import { useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Box from '@mui/material/Box';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import PlanRoomNewEditForm from '../plan-room-new-edit-form';
import PlanRoomExistingSetForm from '../plan-room-exisiting-set-form';

// ----------------------------------------------------------------------

export default function PlanRoomCreateView() {
  const settings = useSettingsContext();
  const [versionType, setVersionType] = useState('new');

  const handleChange = (event) => {
    setVersionType(event.target.value);
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Plan"
        links={[
          {
            name: 'Dashboard',
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

      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <FormControlLabel
          control={
            <Radio
              color="primary"
              checked={versionType === 'new'}
              onChange={handleChange}
              value="new"
            />
          }
          label="New Version Set"
          sx={{ mb: 1, '& .MuiFormControlLabel-label': { fontSize: '1rem' } }}
        />
        <FormControlLabel
          control={
            <Radio
              color="primary"
              checked={versionType === 'existing'}
              onChange={handleChange}
              value="existing"
            />
          }
          label="Add to Existing Version Set"
          sx={{ mb: 1, '& .MuiFormControlLabel-label': { fontSize: '1rem' } }}
        />
      </Box>

      {versionType === 'new' && <PlanRoomNewEditForm />}
      {versionType === 'existing' && <PlanRoomExistingSetForm />}
    </Container>
  );
}

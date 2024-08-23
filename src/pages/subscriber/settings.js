import { Stack } from '@mui/material';
import { Helmet } from 'react-helmet-async';
// sections
import { ProjectSettingsView } from 'src/sections/project-settings/view';

// ----------------------------------------------------------------------

export default function ProjectSettingsPage() {
  return (
    <>
      <Helmet>
        <title> Project Settings</title>
      </Helmet>
      <Stack sx={{ maxWidth: '100vw' }}>
        <ProjectSettingsView />
      </Stack>
    </>
  );
}

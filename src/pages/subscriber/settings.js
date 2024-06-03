import { Stack } from '@mui/material';
import { Helmet } from 'react-helmet-async';
// sections
import { ProjectView } from 'src/sections/project/view';

// ----------------------------------------------------------------------

export default function ProjectSettingsPage() {
  
  return (
    <>
      <Helmet>
        <title> Project Settings</title>
      </Helmet>
      <Stack sx={{ maxWidth: '100vw' }}>
        <ProjectView />
      </Stack>
    </>
  );
}

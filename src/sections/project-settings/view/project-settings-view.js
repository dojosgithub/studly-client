// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import ProjectSettingsStepperForm from '../project-stepper-form';

// ----------------------------------------------------------------------

export default function ProjectSettingsView() {
  return (
    <Container sx={{ my: 0, flex: 1 }}>
      <Stack spacing={7} direction="row" height="100%">
        <ProjectSettingsStepperForm />
      </Stack>
    </Container>
  );
}

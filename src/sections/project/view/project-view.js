// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import ProjectStepperForm from '../project-stepper-form';

// ----------------------------------------------------------------------

export default function ProjectView() {
  return (
    <Container sx={{ my: 0, flex: 1 }}>
      <Stack spacing={7} sx={{ flexDirection: { xs: 'column', md: 'row' } }} height="100%">
        <ProjectStepperForm />
      </Stack>
    </Container>
  );
}

// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import CustomStepper from './custom-stepper';

// ----------------------------------------------------------------------

export default function StepperView() {
  return (
    <>
      <Container sx={{ my: 10 }}>
        <Stack spacing={3} direction='row'>

          <CustomStepper />
          
        </Stack>
      </Container>
    </>
  );
}

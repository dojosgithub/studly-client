// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { CustomStepper } from 'src/components/custom-stepper';

// ----------------------------------------------------------------------

export default function ProjectView() {
    return (
        <>
            <Container sx={{ my: 0 }}>
                <Stack spacing={7} direction='row' height='inherit'>

                    <CustomStepper />

                </Stack>
            </Container>
        </>
    );
}

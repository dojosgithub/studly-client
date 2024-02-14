// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

// import { CustomStepper } from 'src/components/custom-stepper';
import ProjectStepperForm from '../project-stepper-form';

// ----------------------------------------------------------------------

export default function ProjectView() {
    return (
        <>
            <Container sx={{ my: 0, flex: 1 }}>
                <Stack spacing={7} direction='row' height='100%'>

                    <ProjectStepperForm />

                </Stack>
            </Container>
        </>
    );
}

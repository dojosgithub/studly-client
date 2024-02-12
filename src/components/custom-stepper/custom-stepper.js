import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import { Divider, Stack } from '@mui/material';
//
import ProjectName from 'src/sections/project/project-name';
import ProjectTrade from 'src/sections/project/project-trade';
import ProjectWorkflow from 'src/sections/project/project-workflow';

// ----------------------------------------------------------------------

const steps = [
  {
    label: 'Project Name',
    description: `Name your Project`,
    description2: `Enter and press next`,
  },
  {
    label: 'Trades',
    description: 'Create trades for your project',
  },
  {
    label: 'Workflow',
    description: `Create  your project workflow`,
  },
];

export default function CustomStepper() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleData=(data)=>{
    console.log('data',data)
  }
  

  function getComponent() {
    let component;
    switch (activeStep) {
        case 0:
            component = <ProjectName step={activeStep} getData={handleData}/>;
            break;
        case 1:
            component = <ProjectTrade step={activeStep} getData={handleData}/>;
            break;
        case 2:
            component = <ProjectWorkflow step={activeStep} getData={handleData}/>;
            break;
        default:
            component = <ProjectName step={activeStep} getData={handleData}/>;
    }
    return component;
}


  return (
    <>
      <Stepper activeStep={activeStep} orientation="vertical" >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={<Typography variant="caption">{step.description}<br />{index === 0 && step.description2}</Typography>}
            >
              {step.label}
            </StepLabel>

          </Step>
        ))}
      </Stepper>

      <Divider sx={{ width: '1px', background: "rgb(145 158 171 / 20%)" }} />

      <Stack flex={1}>

        {activeStep === steps.length ? (
          <>
            <Paper
              sx={{
                p: 3,
                my: 3,
                minHeight: 120,
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
              }}
            >
              <Typography sx={{ my: 1 }}>All steps completed - you&apos;re finished</Typography>
            </Paper>

            <Box sx={{ display: 'flex' }}>
              <Box sx={{ flexGrow: 1 }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </>
        ) : (
          <>
            <Paper
              sx={{
                py: 3,
                my: 3,
                minHeight: 120,
                background:'transparent'
                // bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
              }}
            >
              {/* <Typography sx={{ my: 1 }}> Step {activeStep + 1}asdasdasdasd</Typography> */}
              {getComponent()}
            </Paper>
            <Box sx={{ display: 'flex' }}>
              {activeStep !== 0 && <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>}
              <Box sx={{ flexGrow: 1 }} />

              <Button variant="contained" onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </>
        )}
      </Stack>

    </>
  );
}

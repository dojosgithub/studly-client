import { useCallback, useEffect, useMemo, useState } from 'react';
// hook-form
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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

// form
import FormProvider, {
  RHFTextField,
} from 'src/components/hook-form';
import { PROJECT_DEFAULT_TEMPLATE } from 'src/_mock';
import uuidv4 from 'src/utils/uuidv4';
import ProjectTemplateName from './project-template-name-dialog';

// ----------------------------------------------------------------------

const steps = [
  {
    label: 'Project Name',
    description: `Name your Project`,
    description2: `Enter and press next`,
    value: 'name',
  },
  {
    label: 'Trades',
    description: 'Create trades for your project',
    value: 'trades',
  },
  {
    label: 'Workflow',
    description: `Create  your project workflow`,
    value: 'workflow',
  },
];


export default function ProjectStepperForm() {
  const [activeStep, setActiveStep] = useState(0);

  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [isDefaultTemplate, setIsDefaultTemplate] = useState(false)
  const [activeTab, setActiveTab] = useState('')
  
  const [open, setOpen] = useState(false)

  const ProjectSchema = Yup.object().shape({
    name: Yup.string().required('Company Name is required'),
    trades: Yup.array()
      .of(
        Yup.object().shape({
          tradeId: Yup.string().required('Trade ID is required'),
          name: Yup.string().required('Trade Name is required'),
          _id: Yup.string()
        })
      )
      .min(1, 'At least one trade is required'),
    workflow: Yup.string().required('Workflow is required'),


  });

  useEffect(() => {

    console.log("activeTab", activeTab)
  }, [activeTab])



  const defaultValues = useMemo(
    () => ({
      name: '',
      trades: isDefaultTemplate ? PROJECT_DEFAULT_TEMPLATE : [{
        name: '',
        tradeId: '',
        _id: uuidv4(),
      }],
      workflow: ''
    }),
    [isDefaultTemplate]
  );

  const methods = useForm({
    resolver: yupResolver(ProjectSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    trigger
  } = methods;

  const values = watch();
  // console.log('values', values)

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log('data', data);
      // getData(data)
      reset();

      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });


  const handleNext = async () => {
    console.log('step', activeStep)
    const currentStepValue = steps[activeStep].value
    if (activeStep === steps.length - 1) return;
    const isFormValid = await trigger(currentStepValue);
    console.log('formValid', isFormValid)
    console.log('currentStepValue', currentStepValue)
    // isDefaultTemplate should be removed
    if (activeTab === "existing" && isDefaultTemplate && selectedTemplate) {
      setOpen(true)
      return
    }
    if (isFormValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  // const handleNext = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  // };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSelect = (val) => {
    setSelectedTemplate(val)
    setIsDefaultTemplate(val === "default")
    setValue('trades', PROJECT_DEFAULT_TEMPLATE)
    console.log('select', val)
    console.log('-------------')
  }
  const handleTab = (tab) => {
    console.log('tab', tab)
    const newField = {
      name: '',
      tradeId: '',
      _id: uuidv4(),
    }
    const defaultTemplate = isDefaultTemplate ? PROJECT_DEFAULT_TEMPLATE : []
    const trades = tab === "create" ? [newField] : defaultTemplate;
    setValue('trades', trades)
    if (tab === "create" && isDefaultTemplate) {
      setIsDefaultTemplate(false)
      setSelectedTemplate('')
    }
    setActiveTab(tab)
  }


  function getComponent() {
    let component;
    switch (activeStep) {
      case 0:
        component = <ProjectName />;
        break;
      case 1:
        component = <ProjectTrade onSelect={handleSelect} isDefaultTemplate={isDefaultTemplate} onTabChange={handleTab} />;
        break;
      case 2:
        component = <ProjectWorkflow />;
        break;
      default:
        component = <ProjectName />;
    }
    return component;
  }


  return (
    <>
      <Stepper activeStep={activeStep} orientation="vertical" sx={{ maxHeight: '360px', marginTop: "2rem", "&.MuiStepper-root .MuiStepConnector-line": { height: '100%' }, "& .MuiStepLabel-root": { gap: '.75rem' } }}>
        {steps.map((step, index) => (
          <Step key={step.label} >
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
            <FormProvider methods={methods} onSubmit={onSubmit}>
              <Paper
                sx={{
                  py: 3,
                  my: 3,
                  minHeight: 120,
                  background: 'transparent'
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

                {/* <Button variant="contained" onClick={handleNext}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button> */}
                {/* <Button variant="contained" type='submit' onClick={handleNext}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button> */}
                {activeStep === steps.length - 1 ? (
                  <Button type="submit" variant="contained">Submit</Button>
                ) : (
                  <Button onClick={handleNext} variant="contained">Next</Button>
                )}
              </Box>
            </FormProvider>

          </>
        )}
      </Stack>
      {isDefaultTemplate && <ProjectTemplateName title='asvs' open={open} onClose={() => setOpen(false)} getTemplateName={(val) => console.log("templateName", val)} />}

    </>
  );
}

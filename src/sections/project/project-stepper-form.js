import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
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
import { addDays } from 'date-fns';
import { useSnackbar } from 'notistack';
//
import { resetCreateProject, setProjectName, setProjectTrades } from 'src/redux/slices/projectSlice';
import ProjectName from 'src/sections/project/project-name';
import ProjectTrade from 'src/sections/project/project-trade';
import ProjectWorkflow from 'src/sections/project/project-workflow';
// utils
import uuidv4 from 'src/utils/uuidv4';
import { PROJECT_DEFAULT_TEMPLATE, PROJECT_TEMPLATES } from 'src/_mock';
//
import { CustomDrawer } from 'src/components/custom-drawer';
// form
import FormProvider, {
  RHFTextField,
} from 'src/components/hook-form';
import ProjectNewTemplateDrawer from './project-new-template-drawer';
import ProjectTemplateName from './project-template-name-dialog';
import ProjectSubcontractor from './project-subcontractor';
import ProjectInviteUsers from './project-invite-users';


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
  {
    label: 'Assign Subcontractors',
    description: `Assign subcontractors to your project`,
    value: 'subcontractors',
  },
  {
    label: 'Invite Users',
    description: `Invite users to project`,
    value: 'users',
  },
];


export default function ProjectStepperForm() {
  const [activeStep, setActiveStep] = useState(0);

  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [isDefaultTemplate, setIsDefaultTemplate] = useState(false)
  const [activeTab, setActiveTab] = useState('')
  const [skipped, setSkipped] = useState(new Set([0, 1, 2, 3, 4]));

  const [open, setOpen] = useState(false)
  const [openNewTemplateDrawer, setOpenNewTemplateDrawer] = useState(false)
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();


  const isStepOptional = (step) => (step === 3 || step === 4);

  const isStepSkipped = (step) => skipped?.has(step);




  const getTemplateTrades = useCallback(
    (val) => {
      let trades = PROJECT_TEMPLATES.filter(template => template.name === val);
      trades = trades.length > 0 ? trades[0]?.trades : []
      return trades
    },
    []
  );


  const ProjectSchema = Yup.object().shape({
    name: Yup.string().required('Project Name is required'),
    trades: Yup.array()
      .of(
        Yup.object().shape({
          tradeId: Yup.string().required('Trade ID is required'),
          name: Yup.string().required('Trade Name is required'),
          _id: Yup.string(),
          subcontractorId: Yup.string()
        })
      )
      .min(1, 'At least one trade is required'),
    workflow: Yup.object().shape({
      name: Yup.string().required('Workflow Name is required'),
      statuses: Yup.array().min(1, 'At least one status is required'),
      // returnDate: Yup.date().min(addDays(new Date(), 1)), 
      returnDate: Yup.string().required('Date is required'),
    }),
    

  });


  const defaultValues = useMemo(
    () => ({
      name: '',
      trades: selectedTemplate ? getTemplateTrades(selectedTemplate) : [{
        name: '',
        tradeId: '',
        _id: uuidv4(),
      }],
      workflow: {
        name: '',
        statuses: [],
        returnDate: null
      }
    }),
    [selectedTemplate, getTemplateTrades]
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
    getValues,
    handleSubmit,
    formState: { isSubmitting, isValid },
    trigger
  } = methods;

  const formValues = getValues();


  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar('Update success!');

      console.log('data Final', data);
      reset();
      setActiveStep(0)
      dispatch(resetCreateProject())
    } catch (error) {
      console.error(error);
    }
  });


  const getFormValidation = async () => {
    const currentStepValue = steps[activeStep].value
    const isFormValid = await trigger(currentStepValue);
    return { isFormValid, currentStepValue }
  }

  const handleNext = async () => {
    if (activeStep === steps.length - 1) return;

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    const { isFormValid, currentStepValue } = await getFormValidation();

    // ?  setting name to redux
    if ((currentStepValue === 'name') && isFormValid) {
      console.log('formValues.name', formValues?.name);
      dispatch(setProjectName(formValues.name))
    }
    // ?  setting trades to redux
    if ((currentStepValue === 'trades') && isFormValid) {
      dispatch(setProjectTrades(formValues.trades))
    }

    // TODO:  isDefaultTemplate should be removed
    if (activeTab === "existing" && isFormValid && !!selectedTemplate && !open) {
      setOpen(true)
      return
    }
    if (isFormValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    // TODO: Step2: values should be there when go back
    if (activeStep === 1) {
      setIsDefaultTemplate(false);
      setSelectedTemplate('');
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    console.log('skipped', skipped)
    setSkipped((prevSkipped) => {
      console.log('prevSkipped', prevSkipped)
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };


  const handleReset = () => {
    setActiveStep(0);
    setIsDefaultTemplate(false);
    setSelectedTemplate('');
  };

  const handleSelect = (val) => {
    if (val === "create") {
      setOpenNewTemplateDrawer(true)

      // return
    }

    setSelectedTemplate(val)
    setIsDefaultTemplate(val === "default")

    const filteredTrades = getTemplateTrades(val)
    // TODO: multiple templates
    setValue('trades', filteredTrades)
  }
  const handleTab = (tab) => {
    const newField = {
      name: '',
      tradeId: '',
      _id: uuidv4(),
    }
    const defaultTemplate = selectedTemplate ? getTemplateTrades(selectedTemplate) : []
    const trades = tab === "create" ? [newField] : defaultTemplate;
    setValue('trades', trades)
    if (tab === "create" && !!selectedTemplate) {
      setIsDefaultTemplate(false)
      setSelectedTemplate('')
    }
    setActiveTab(tab)
  }

  const handleTemplateName = (val) => {
    // setValue("templateName", val)
    handleNext()
    setOpen(false)
  }


  function getComponent() {
    let component;
    switch (activeStep) {
      case 0:
        component = <ProjectName />;
        break;
      case 1:
        component = <ProjectTrade selectedTemplate={selectedTemplate} onSelect={handleSelect} isDefaultTemplate={isDefaultTemplate} onTabChange={handleTab} />;
        break;
      case 2:
        component = <ProjectWorkflow />;
        break;
      case 3:
        component = <ProjectSubcontractor />;
        break;
      case 4:
        component = <ProjectInviteUsers />;
        break;
      default:
        component = <ProjectName />;
    }
    return component;
  }


  return (
    <>
      <Stepper activeStep={activeStep} orientation="vertical" sx={{ maxHeight: '360px', marginTop: "2rem", "&.MuiStepper-root .MuiStepConnector-line": { height: '100%' }, "& .MuiStepLabel-root": { gap: '.75rem' } }}>
        {steps.map((step, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = <Typography variant="caption">Optional</Typography>;
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={step.label} {...stepProps}>
              <StepLabel
                {...labelProps}
                optional={<Typography variant="caption">{step.description}<br />{index === 0 && step.description2}</Typography>}
              >
                {step.label}
              </StepLabel>

            </Step>)
        })}
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
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Paper
              sx={{
                py: 3,
                my: 3,
                minHeight: 120,
                background: 'transparent'
                // // bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
              }}
            >
              {getComponent()}
            </Paper>
            <Box sx={{ display: 'flex' }}>
              {activeStep !== 0 && <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>}
              <Box sx={{ flexGrow: 1 }} />

              {isStepOptional(activeStep) && (
                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                  Skip
                </Button>
              )}
              {activeStep === steps.length - 1 ? (
                <Button type="submit" variant="contained">Finish</Button>
              ) : (
                <Button onClick={handleNext} variant="contained">Next</Button>
              )}
            </Box>
          </FormProvider>
        )}
      </Stack>
      {!!selectedTemplate && <ProjectTemplateName title='asvs' open={open} onClose={() => setOpen(false)} getTemplateName={handleTemplateName} trades={formValues?.trades} />}
      <CustomDrawer open={openNewTemplateDrawer} onClose={() => {
        setOpenNewTemplateDrawer(false);
        handleSelect('')
      }} Component={ProjectNewTemplateDrawer} type='template' />
    </>
  );
}

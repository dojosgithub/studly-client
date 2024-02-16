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
  const [openNewTemplateDrawer, setOpenNewTemplateDrawer] = useState(false)

  // const getTemplateTrades=()=>{
  //   let trades=PROJECT_TEMPLATES.filter(template=>template.name === selectedTemplate);
  //   trades= trades.length>0?trades[0]?.trades:[]
  //   return trades
  // }
  const getTemplateTrades = useCallback(
    (val) => {
      let trades = PROJECT_TEMPLATES.filter(template => template.name === val);
      trades = trades.length > 0 ? trades[0]?.trades : []
      return trades
    },
    []
  );


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

    console.log("activeStep", activeStep)
  }, [activeStep])



  const defaultValues = useMemo(
    () => ({
      name: '',
      trades: selectedTemplate ? getTemplateTrades(selectedTemplate) : [{
        name: '',
        tradeId: '',
        _id: uuidv4(),
      }],
      workflow: '',
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
    formState: { isSubmitting },
    trigger
  } = methods;

  const formValues = getValues();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log('data', data);
      reset();

    } catch (error) {
      console.error(error);
    }
  });


  const getFormValidation = async () => {
    const currentStepValue = steps[activeStep].value
    const isFormValid = await trigger(currentStepValue);
    return isFormValid
  }

  const handleNext = async () => {
    if (activeStep === steps.length - 1) return;
    const isFormValid = await getFormValidation();
    // // console.log('currentStepValue', currentStepValue)

    // TODO:  isDefaultTemplate should be removed
    if (activeTab === "existing" && isFormValid && !!selectedTemplate && !open) {
      console.log('open', open)
      setOpen(true)
      return
    }
    if (isFormValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };



  const handleBack = () => {
    // TODO: Step2: values should be there when go back
    if (activeStep === 1) {
      setIsDefaultTemplate(false);
      setSelectedTemplate('');
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setIsDefaultTemplate(false);
    setSelectedTemplate('');
  };

  const handleSelect = (val) => {
    if (val === "create") {
      setOpenNewTemplateDrawer(true)
    }
    console.log('select',val)
    setSelectedTemplate(val)
    setIsDefaultTemplate(val === "default")
    console.log('formValues',formValues)
    console.log('selectedTemplate',selectedTemplate)
    const filteredTrades=getTemplateTrades(val)
    console.log('filteredTrades',filteredTrades)
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


                {activeStep === steps.length - 1 ? (
                  <Button type="submit" variant="contained">Finish</Button>
                ) : (
                  <Button onClick={handleNext} variant="contained">Next</Button>
                )}
              </Box>
            </FormProvider>

          </>
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

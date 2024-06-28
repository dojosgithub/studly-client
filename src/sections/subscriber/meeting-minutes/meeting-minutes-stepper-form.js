import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { isEmpty } from 'lodash';
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
import { LoadingButton } from '@mui/lab';
//
import { addDays } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useRouter } from 'src/routes/hooks';
//
import { createNewProject, getAllSubcontractorList, getCompanySubcontractorList, getProjectList, resetCreateProject, resetMembers, setCreateTemplate, setDefaultTemplateModified, setProjectDrawerState, setProjectName, setProjectTrades, setProjectWorkflow } from 'src/redux/slices/projectSlice';
// utils
import uuidv4 from 'src/utils/uuidv4';
import { PROJECT_DEFAULT_TEMPLATE, PROJECT_TEMPLATES } from 'src/_mock';
//
import { CustomDrawer } from 'src/components/custom-drawer';
// form
import FormProvider, {
  RHFTextField,
} from 'src/components/hook-form';
import { paths } from 'src/routes/paths';
import { getTemplateList, resetTemplate, setIsDefaultTemplate, setIsNewTemplate, setIsTemplateNameAdded } from 'src/redux/slices/templateSlice';
import { getWorkflowList, resetWorkflow, setIsNewWorkflow } from 'src/redux/slices/workflowSlice';
import { getSubmittalList } from 'src/redux/slices/submittalSlice';
//
import MeetingMinutesDescription from './meeting-minutes-description';
import MeetingMinutesPermitFields from './meeting-minutes-permit-fields';
import MeetingMinutesInviteAttendee from './meeting-minutes-invite-attendee';
import ProjectFinal from './project-final';
import MeetingMinutesPlanTrackingFields from './meeting-minutes-plan-tracking-fields';



// ----------------------------------------------------------------------

const steps = [
  {
    // label: 'Project Name',
    label: 'Project Info',
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
    value: 'invite-users',
  },
];


export default function MeetingMinutesStepperForm() {
  const [activeStep, setActiveStep] = useState(3);

  const [skipped, setSkipped] = useState(new Set([0, 1, 2, 3]));


  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const members = useSelector(state => state.project.members);
  const companies = useSelector(state => state.user.user.companies);

  const selectedTradeTemplate = useSelector(state => state.project.create.selectedTradeTemplate);

  const isStepOptional = (step) => (step === 2 || step === 3);

  const isStepSkipped = (step) => skipped?.has(step);


  const ProjectSchema = Yup.object().shape({
    name: Yup.string().required('Project Name is required'),
    address: Yup.string().required('Address is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    zipCode: Yup.string().required('Zip code is required'),
    trades: Yup.array()
      .of(
        Yup.object().shape({
          // tradeId: Yup.string().required('Trade ID is required'),
          tradeId: Yup.string()
            .matches(/^[0-9.-]+$/, 'Trade id must contain only numeric characters, dots, and hyphens')
            .required('Trade id is required'),
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

  const defaultValues = useMemo(() => {
    const isNewEntry = activeStep === 2 || activeStep === 3;
    // TODO: currentSelectedTemplate from redux 
    return {
      name: '',
      address: '',
      state: '',
      city: '',
      zipCode: '',
      trades: [{
        name: '',
        tradeId: '',
        _id: uuidv4(),
      }],
      workflow: {
        name: 'default',
        statuses: ['Draft', 'Submitted'],
        returnDate: new Date()
      },

    };
  }, [activeStep]);

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
  const { name, address, state, city, zipCode } = formValues;
  console.log('formValues', formValues)


  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('data->', data);


      // const { error, payload } = await dispatch(createNewProject(finalData))
      // console.log('e-p', { error, payload });
      // if (!isEmpty(error)) {
      //   enqueueSnackbar(error.message, { variant: "error" });
      //   return
      // }
      // handleReset()
      // enqueueSnackbar('Project created successfully!', { variant: 'success' });
      // await dispatch(getProjectList())
      // dispatch(getSubmittalList({ search: '', page: 1, status: [] }))
      // dispatch(resetTemplate())
      // dispatch(resetWorkflow())
      // dispatch(resetCreateProject())
      // dispatch(setProjectDrawerState(false))
      // // if(isEmpty(projectList)){
      // //   router.push(paths.subscriber.onboarding);
      // //   return
      // // }
      // // router.push(paths.subscriber.submittals.list);
      // navigate(paths.subscriber.submittals.list)


    } catch (error) {
      // console.error(error);
      console.log('error-->', error);
      enqueueSnackbar(`Error Updating Password`, { variant: "error" });
    }
  });


  const getFormValidation = async () => {
    const currentStepValue = steps[activeStep].value
    let isFormValid;
    // refers to project stepper form value 'name'
    if (currentStepValue === "name") {
      const isNameValid = await trigger('name');
      const isAddressValid = await trigger('address');
      const isStateValid = await trigger('state');
      const isCityValid = await trigger('city');
      const isZipCodeValid = await trigger('zipCode');
      isFormValid = isNameValid && isAddressValid && isStateValid && isCityValid && isZipCodeValid


    } else {
      isFormValid = await trigger(currentStepValue);

    }
    console.log('isformvalid', isFormValid)
    return { isFormValid, currentStepValue }
  }

  const handleNext = async () => {
    if (activeStep === steps.length) return; // Prevent submission if already on last step

    let newSkipped = skipped;

    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    const { isFormValid, currentStepValue } = await getFormValidation();

    if (!isFormValid && currentStepValue === "trades") {
      enqueueSnackbar('Please add a trade', { variant: "warning" });
      return
    }
    // Dispatch form data or perform other actions based on current step value
    if (isFormValid) {
      switch (currentStepValue) {
        case 'name':
          dispatch(setProjectName({ name, address, state, city, zipCode }));
          dispatch(setProjectWorkflow(formValues?.workflow));
          console.log('formValuesNAME', formValues);
          break;
        case 'trades':
          dispatch(setProjectTrades(formValues?.trades));
          break;
        case 'workflow':
          dispatch(setProjectWorkflow(formValues?.workflow));
          break;
        default:
          break;
      }
    }

    setSkipped(newSkipped);
    if (isFormValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      console.log('prevSkipped', prevSkipped)
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      console.log('newSkipped', newSkipped)
      return newSkipped;
    });
  };


  const handleReset = () => {
    setActiveStep(0);
    reset();
    dispatch(resetCreateProject())
  };

  const handleFinish = () => {
    methods.handleSubmit(onSubmit)();
  };



  function getComponent() {
    let component;
    switch (activeStep) {
      case 0:
        component = <MeetingMinutesDescription />;
        break;
      case 1:
        component = <MeetingMinutesInviteAttendee />;
        break;

      case 2:
        component = <Box>Step 3</Box>;
        break;
      case 3:
        component = <MeetingMinutesPermitFields />;
        break;
      case 4:
        component = <MeetingMinutesPlanTrackingFields />;
        break;
      default:
        component = <Box>Step 3</Box>;
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
                // onClick={() => handleBack(index)}
                {...labelProps}
                optional={<Typography variant="caption">{step.description}<br />{index === 0 && step.description2}</Typography>}
              >
                {step.label}
              </StepLabel>

            </Step>)
        })}
      </Stepper>

      <Divider sx={{ width: '1px', background: "rgb(145 158 171 / 20%)" }} />

      <Stack flex={1} position='relative'>
        <FormProvider methods={methods} onSubmit={onSubmit}>

          {activeStep === steps.length ? (
            <>
              <ProjectFinal />

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button color="inherit" variant='outlined' disabled={isSubmitting} onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button onClick={handleReset} disabled={isSubmitting}>Reset</Button>
                <LoadingButton type="button" variant="contained" disabled={isSubmitting} loading={isSubmitting} onClick={handleFinish}>
                  Finish
                </LoadingButton>
              </Box>
            </>
          ) : (
            <>
              <Paper
                sx={{
                  // py: 3,
                  my: 3,
                  minHeight: 120,
                  background: 'transparent'
                  // // bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                }}
              >
                {getComponent()}
              </Paper>
              <Box sx={{ display: 'flex', position: 'sticky', bottom: 0, p: "1rem 0", width: '100%', bgcolor: '#fff' }}>
                {activeStep !== 0 && <Button variant='outlined' color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>}
                <Box sx={{ flexGrow: 1 }} />

                {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )}
                {/* steps.length - 1 new change */}

                {activeStep !== steps.length && (
                  <Button onClick={handleNext} variant="contained">Next</Button>
                )}
              </Box>
            </>
          )}
        </FormProvider>
      </Stack>



    </>
  );
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { cloneDeep, isEmpty } from 'lodash';
// hook-form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import StepLabel from '@mui/material/StepLabel';
import { Divider, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
//
import { useSnackbar } from 'notistack';
import { useRouter } from 'src/routes/hooks';
//
import {
  createNewProject,
  getCompanySubcontractorList,
  getProjectList,
  resetCreateProject,
  setProjectDrawerState,
  setProjectName,
  setProjectTrades,
  setProjectWorkflow,
  setTemplateCreationType,
} from 'src/redux/slices/projectSlice';
import ProjectName from 'src/sections/project/project-name';
import ProjectTrade from 'src/sections/project/project-trade';
// utils
import uuidv4 from 'src/utils/uuidv4';
//
import { CustomDrawer } from 'src/components/custom-drawer';
// form
import FormProvider from 'src/components/hook-form';
import { paths } from 'src/routes/paths';
import { getTemplateList, resetTemplate, setIsNewTemplate } from 'src/redux/slices/templateSlice';
import { getWorkflowList, resetWorkflow } from 'src/redux/slices/workflowSlice';
import { getSubmittalList } from 'src/redux/slices/submittalSlice';

import { useResponsive } from 'src/hooks/use-responsive';
import ProjectNewTemplateDrawer from './project-new-template-drawer';
import ProjectSubcontractor from './project-subcontractor';
import ProjectInviteUsers from './project-invite-users';
import ProjectFinal from './project-final';

// ----------------------------------------------------------------------

const steps = [
  {
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

export default function ProjectStepperForm() {
  const [activeStep, setActiveStep] = useState(0);

  const [skipped, setSkipped] = useState(new Set([0, 1, 2, 3]));

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const smDown = useResponsive('down', 'sm');

  const dispatch = useDispatch();
  const members = useSelector((state) => state.project.members);
  const companies = useSelector((state) => state.user.user.companies);

  const selectedTradeTemplate = useSelector((state) => state.project.create.selectedTradeTemplate);

  const activeTab = useSelector((state) => state.project.create.activeTab);

  // creating new trade template
  const isNewTemplate = useSelector((state) => state.template.isNewTemplate);

  const isStepOptional = (step) => step === 2 || step === 3;

  const isStepSkipped = (step) => skipped?.has(step);

  useEffect(() => {
    dispatch(getTemplateList());
    dispatch(getWorkflowList());
    dispatch(getCompanySubcontractorList());
  }, [dispatch]);

  const ProjectSchema = Yup.object().shape({
    name: Yup.string().required('Project Name is required'),
    address: Yup.string().required('Address is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    zipCode: Yup.string().required('Zip code is required'),
    trades: Yup.array()
      .of(
        Yup.object().shape({
          tradeId: Yup.string().required('Trade id is required'),
          name: Yup.string().required('Trade Name is required'),
          _id: Yup.string(),
          subcontractorId: Yup.string(),
        })
      )
      .min(1, 'At least one trade is required'),
    workflow: Yup.object().shape({
      name: Yup.string().required('Workflow Name is required'),
      statuses: Yup.array().min(1, 'At least one status is required'),
      returnDate: Yup.string().required('Date is required'),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      address: '',
      state: '',
      city: '',
      zipCode: '',
      trades:
        activeTab === 'create'
          ? [
              {
                name: '',
                tradeId: '',
                _id: uuidv4(),
              },
            ]
          : [],
      workflow: {
        name: 'default',
        statuses: ['Draft', 'Submitted'],
        returnDate: new Date(),
      },
    }),
    [activeTab]
  );

  const methods = useForm({
    resolver: yupResolver(ProjectSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
    trigger,
  } = methods;

  const formValues = getValues();
  const { name, address, state, city, zipCode } = formValues;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!companies) {
        return;
      }
      const updatedTrades = data?.trades?.map(({ _id, ...rest }) => ({
        ...rest,
        uid: _id,
      }));
      dispatch(setTemplateCreationType());
      const isCreatedWithCSI = selectedTradeTemplate === 'default' && activeTab === 'existing';
      const updatedWorkflow = data.workflow;

      const finalData = {
        ...data,
        trades: updatedTrades,
        workflow: updatedWorkflow,
        members,
        isCreatedWithCSI,
      };
      const { error, payload } = await dispatch(createNewProject(finalData));
      if (!isEmpty(error)) {
        enqueueSnackbar(error.message, { variant: 'error' });
        return;
      }
      handleReset();
      enqueueSnackbar('Project created successfully!', { variant: 'success' });
      await dispatch(getProjectList());
      dispatch(getSubmittalList({ search: '', page: 1, status: [] }));
      dispatch(resetTemplate());
      dispatch(resetWorkflow());
      dispatch(resetCreateProject());
      dispatch(setProjectDrawerState(false));
      navigate(paths.subscriber.submittals.list);
    } catch (error) {
      console.log('error-->', error);
      enqueueSnackbar(`Error Updating Password`, { variant: 'error' });
    }
  });

  const getFormValidation = async () => {
    const currentStepValue = steps[activeStep].value;
    let isFormValid;
    // refers to project stepper form value 'name'
    if (currentStepValue === 'name') {
      const isNameValid = await trigger('name');
      const isAddressValid = await trigger('address');
      const isStateValid = await trigger('state');
      const isCityValid = await trigger('city');
      const isZipCodeValid = await trigger('zipCode');
      isFormValid = isNameValid && isAddressValid && isStateValid && isCityValid && isZipCodeValid;
    } else {
      isFormValid = await trigger(currentStepValue);
    }
    return { isFormValid, currentStepValue };
  };

  const handleNext = async () => {
    if (activeStep === steps.length) return; // Prevent submission if already on last step

    let newSkipped = skipped;

    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    const { isFormValid, currentStepValue } = await getFormValidation();
    if (!isFormValid && currentStepValue === 'trades') {
      enqueueSnackbar('Please add a trade', { variant: 'warning' });
      return;
    }
    // Dispatch form data or perform other actions based on current step value
    if (isFormValid) {
      switch (currentStepValue) {
        case 'name':
          dispatch(setProjectName({ name, address, state, city, zipCode }));
          dispatch(setProjectWorkflow(formValues?.workflow));
          break;
        case 'trades':
          dispatch(setProjectTrades(cloneDeep(formValues?.trades)));
          break;
        default:
          break;
      }
    }

    if (isFormValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
    reset();
    dispatch(resetCreateProject());
  };

  const handleFinish = () => {
    methods.handleSubmit(onSubmit)();
  };

  function getComponent() {
    let component;
    switch (activeStep) {
      case 0:
        component = <ProjectName />;
        break;
      case 1:
        component = <ProjectTrade />;
        break;
      case 2:
        component = <ProjectSubcontractor />;
        break;
      case 3:
        component = <ProjectInviteUsers />;
        break;
      default:
        component = <ProjectName />;
    }
    return component;
  }

  return (
    <>
      {!smDown && (
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          sx={{
            maxHeight: '360px',
            marginTop: '2rem',
            '&.MuiStepper-root .MuiStepConnector-line': { height: '100%' },
            '& .MuiStepLabel-root': { gap: '.75rem' },
          }}
        >
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
                  optional={
                    <Typography variant="caption">
                      {step.description}
                      <br />
                      {index === 0 && step.description2}
                    </Typography>
                  }
                >
                  {step.label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      )}

      {!smDown && <Divider sx={{ width: '1px', background: 'rgb(145 158 171 / 20%)' }} />}

      <Stack flex={1} position="relative">
        <FormProvider methods={methods} onSubmit={onSubmit}>
          {activeStep === steps.length ? (
            <>
              <ProjectFinal />

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                  color="inherit"
                  variant="outlined"
                  disabled={isSubmitting}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button onClick={handleReset} disabled={isSubmitting}>
                  Reset
                </Button>
                <LoadingButton
                  type="button"
                  variant="contained"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  onClick={handleFinish}
                >
                  Finish
                </LoadingButton>
              </Box>
            </>
          ) : (
            <>
              <Paper
                sx={{
                  my: 3,
                  minHeight: 120,
                  background: 'transparent',
                }}
              >
                {getComponent()}
              </Paper>
              <Box
                sx={{
                  display: 'flex',
                  position: 'sticky',
                  bottom: 0,
                  p: '1rem 0',
                  width: '100%',
                  bgcolor: '#fff',
                }}
              >
                {activeStep !== 0 && (
                  <Button
                    variant="outlined"
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                )}
                <Box sx={{ flexGrow: 1 }} />

                {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )}

                {activeStep !== steps.length && (
                  <Button onClick={handleNext} variant="contained">
                    Next
                  </Button>
                )}
              </Box>
            </>
          )}
        </FormProvider>
      </Stack>

      <CustomDrawer
        open={isNewTemplate}
        onClose={() => dispatch(setIsNewTemplate(false))}
        Component={ProjectNewTemplateDrawer}
        setTrades={setValue}
        type="template"
      />
    </>
  );
}

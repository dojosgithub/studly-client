import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { cloneDeep, isEmpty } from 'lodash';

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
import { useResponsive } from 'src/hooks/use-responsive';
//
import {
  createNewProject,
  getCompanySubcontractorList,
  getProjectList,
  resetCreateProject,
  resetMembers,
  resetUpdateProject,
  setDefaultTemplateModified,
  setProjectDrawerState,
  setProjectSettingsName,
  setProjectSettingsTrades,
  setProjectSettingsWorkflow,
  setUpdateProject,
  updateExistingProject,
} from 'src/redux/slices/projectSlice';
import ProjectSettingsName from 'src/sections/project-settings/project-settings-name';
import ProjectSettingsTrade from 'src/sections/project-settings/project-settings-trade';
// utils
import uuidv4 from 'src/utils/uuidv4';
//
import { CustomDrawer } from 'src/components/custom-drawer';
// form
import FormProvider from 'src/components/hook-form';
import { paths } from 'src/routes/paths';
import { getTemplateList, resetTemplate, setIsNewTemplate } from 'src/redux/slices/templateSlice';
import { getWorkflowList, resetWorkflow, setIsNewWorkflow } from 'src/redux/slices/workflowSlice';
import { getSubmittalList } from 'src/redux/slices/submittalSlice';

import ProjectSettingsSubcontractor from './project-settings-subcontractor';
import ProjectSettingsInviteUsers from './project-settings-invite-users';
import ProjectSettingsFinal from './project-settings-final';

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

export default function ProjectSettingsStepperForm() {
  const [activeStep, setActiveStep] = useState(0);

  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [skipped, setSkipped] = useState(new Set([0, 1, 2, 3]));

  const [open, setOpen] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const [openNewTemplateDrawer, setOpenNewTemplateDrawer] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  // ? update project state
  const currentProject = useSelector((state) => state.project.update);
  // console.log('currentProject', currentProject);
  const projectList = useSelector((state) => state.project.list);
  const newTemplate = useSelector((state) => state.project.template);
  const inviteUsers = useSelector((state) => state.project.inviteUsers);
  const members = useSelector((state) => state.project?.update?.members);
  const companies = useSelector((state) => state.user.user.companies);

  const selectedTradeTemplate = useSelector((state) => state.project.create.selectedTradeTemplate);
  const isDefaultTemplateModified = useSelector(
    (state) => state.project.create.isDefaultTemplateModified
  );
  const activeTab = useSelector((state) => state.project.create.activeTab);
  const templates = useSelector((state) => state.template.list);
  const defaultTemplate = templates.find((item) => item.name === 'default');
  const defaultTemplateTrades = defaultTemplate ? defaultTemplate?.trades : [];
  const isCreatedWithCSI = useSelector((state) => state.project?.update?.isCreatedWithCSI);

  const templateList = useSelector((state) => state.template.list);
  const workflowList = useSelector((state) => state.workflow.list);

  // creating new trade template
  const isDefaultTemplate = useSelector((state) => state.template.isDefaultTemplate);
  const isTemplateNameAdded = useSelector((state) => state.template.isTemplateNameAdded);
  const isNewTemplate = useSelector((state) => state.template.isNewTemplate);

  // creating new workflow template
  const isNewWorkflow = useSelector((state) => state.workflow.isNewWorkflow);

  // step === 3 || step === 4
  const isStepOptional = (step) => step === 2 || step === 3;

  const isStepSkipped = (step) => skipped?.has(step);

  useEffect(() => {
    dispatch(getTemplateList());
    dispatch(getWorkflowList());
    dispatch(getCompanySubcontractorList());
    // reseting update project to current project
    dispatch(setUpdateProject());
    return () => dispatch(setUpdateProject());
  }, [dispatch]);

  const getTemplateTrades = useCallback(
    // templates
    (val) => {
      let trades = templateList.filter((template) => template.name === val);
      trades = trades.length > 0 ? trades[0]?.trades : [];
      return trades;
    },
    [templateList]
  );

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

  const defaultValues = useMemo(() => {
    const isNewEntry = activeStep === 2 || activeStep === 3;
    // TODO: currentSelectedTemplate from redux
    return {
      name: currentProject?.name || '',
      address: currentProject?.address || '',
      state: currentProject?.state || '',
      city: currentProject?.city || '',
      zipCode: currentProject?.zipCode || '',
      trades: currentProject?.trades || [
        {
          name: '',
          tradeId: '',
          _id: uuidv4(),
        },
      ],
      workflow: currentProject?.workflow || {
        name: 'default',
        statuses: ['Draft', 'Submitted'],
        returnDate: new Date(),
      },
    };
  }, [activeStep, currentProject]);

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
    trigger,
  } = methods;

  const formValues = getValues();
  const { name, address, state, city, zipCode } = formValues;
  const lgUp = useResponsive('up', 'lg');
  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!companies) {
        return;
      }
      setIsFormSubmitting(true);
      const updatedTrades = data?.trades?.map(({ _id, ...rest }) => rest);
      const updatedWorkflow = data.workflow;

      // Get emails from the trades array
      const tradeEmails = updatedTrades
        .filter((trade) => trade.email) // Only include trades with an email field
        .map((trade) => trade.email);

      // Filter members based on !trade emails and role.shortName !== 'SCO'
      const filteredUsers = members.filter(
        (member) => !tradeEmails.includes(member.email) && member.role.shortName !== 'SCO'
      );
      // Filter members based on trade emails and role.shortName === 'SCO'
      const filteredSCOUsers = members.filter(
        (member) => tradeEmails.includes(member.email) && member.role.shortName === 'SCO'
      );
      const filteredMembers = [...filteredUsers, ...filteredSCOUsers];

      const finalData = {
        ...currentProject,
        ...data,
        trades: updatedTrades,
        workflow: updatedWorkflow,
        members: filteredMembers,
      };
      const { error, payload } = await dispatch(updateExistingProject(finalData));
      if (!isEmpty(error)) {
        enqueueSnackbar(error.message, { variant: 'error' });
        return;
      }
      setIsFormSubmitting(false);
      handleReset();
      enqueueSnackbar('Project update successfully!', { variant: 'success' });
      await dispatch(getProjectList());
      dispatch(getSubmittalList({ search: '', page: 1, status: [] }));

      navigate(paths.subscriber.submittals.list);
    } catch (error) {
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
          dispatch(setProjectSettingsName({ name, address, state, city, zipCode }));
          dispatch(setProjectSettingsWorkflow(formValues?.workflow));
          break;
        case 'trades':
          dispatch(setProjectSettingsTrades(cloneDeep(formValues?.trades)));
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
    // TODO: Step2: values should be there when go back
    if (activeStep === 1) {
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
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
    setSelectedTemplate('');
    reset();
    dispatch(resetCreateProject());
    // reseting update project
    dispatch(resetUpdateProject());
    dispatch(resetTemplate());
    dispatch(resetWorkflow());
    dispatch(setProjectDrawerState(false));
  };

  const handleFinish = () => {
    methods.handleSubmit(onSubmit)();
  };

  const handleSelect = (val) => {};
  const handleTab = (tab) => {};

  const handleTemplateCreation = (val) => {
    setOpen(false);
  };

  function getComponent() {
    let component;
    switch (activeStep) {
      case 0:
        component = <ProjectSettingsName />;
        break;
      case 1:
        component = (
          <ProjectSettingsTrade
            selectedTemplate={selectedTemplate}
            onSelect={handleSelect}
            onTabChange={handleTab}
          />
        );
        break;

      case 2:
        component = <ProjectSettingsSubcontractor />;
        break;
      case 3:
        component = <ProjectSettingsInviteUsers />;
        break;
      default:
        component = <ProjectSettingsName />;
    }
    return component;
  }

  return (
    <>
      {lgUp && (
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

      {lgUp && <Divider sx={{ width: '1px', background: 'rgb(145 158 171 / 20%)' }} />}

      <Stack flex={1} position="relative">
        <FormProvider methods={methods} onSubmit={onSubmit}>
          {activeStep === steps.length ? (
            <>
              <ProjectSettingsFinal />

              <Box
                sx={{
                  display: 'flex',
                  position: 'sticky',
                  bottom: 0,

                  width: '100%',
                  bgcolor: '#fff',
                  flexDirection: { xs: 'column-reverse', sm: 'row' },
                  gap: { xs: '.25rem', sm: 2 },
                  mb: { xs: '0', sm: 2 },
                  p: { xs: '1rem', sm: '1rem 0' },
                  boxShadow: { xs: '-3px -9px 18px -3px rgba(0, 0, 0, 0.1)', sm: 0 },
                  borderRadius: { xs: '1rem 1rem 0 0', sm: 0 },
                }}
              >
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
                  // py: 3,
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
                  width: '100%',
                  bgcolor: '#fff',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: '.25rem', sm: 0 },
                  p: { xs: '1rem', sm: '1rem 0' },
                  boxShadow: { xs: '-3px -9px 18px -3px rgba(0, 0, 0, 0.1)', sm: 0 },
                  borderRadius: { xs: '1rem 1rem 0 0', sm: 0 },
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
    </>
  );
}
